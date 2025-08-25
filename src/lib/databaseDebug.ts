import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Debug utility to check database contents
export class DatabaseDebugger {

  // Check all collections and their document counts
  static async checkAllCollections() {
    console.log("🔍 Checking all Firestore collections...");

    const collections = [
      'users',
      'courses',
      'enrollments',
      'teacherAssignments',
      'assignments',
      'submissions'
    ];

    for (const collectionName of collections) {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        console.log(`📊 ${collectionName}: ${querySnapshot.size} documents`);
      } catch (error) {
        console.log(`❌ Error checking ${collectionName}:`, error);
      }
    }
  }

  // Check specific user details
  static async checkUserDetails(userId: string) {
    console.log(`👤 Checking user details for: ${userId}`);

    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("👤 User data:", userData);

        // Check enrollments for this user
        console.log("📚 Checking enrollments for this user...");
        const enrollmentsQuery = query(
          collection(db, "enrollments"),
          where("studentId", "==", userId)
        );
        const enrollmentsSnap = await getDocs(enrollmentsQuery);
        console.log(`📚 User enrollments: ${enrollmentsSnap.size}`);

        enrollmentsSnap.forEach(doc => {
          console.log("  - Enrollment:", doc.data());
        });

        // Check teacher assignments for this user
        console.log("👨‍🏫 Checking teacher assignments for this user...");
        const teacherAssignmentsQuery = query(
          collection(db, "teacherAssignments"),
          where("teacherId", "==", userId)
        );
        const teacherAssignmentsSnap = await getDocs(teacherAssignmentsQuery);
        console.log(`👨‍🏫 Teacher assignments: ${teacherAssignmentsSnap.size}`);

        teacherAssignmentsSnap.forEach(doc => {
          console.log("  - Assignment:", doc.data());
        });

      } else {
        console.log("❌ User not found");
      }
    } catch (error) {
      console.error("❌ Error checking user:", error);
    }
  }

  // Check all courses
  static async checkAllCourses() {
    console.log("📚 Checking all courses...");

    try {
      const coursesSnap = await getDocs(collection(db, "courses"));
      console.log(`📚 Total courses: ${coursesSnap.size}`);

      coursesSnap.forEach(doc => {
        const courseData = doc.data();
        console.log(`  - ${courseData.code}: ${courseData.title} (${courseData.semester})`);
      });
    } catch (error) {
      console.error("❌ Error checking courses:", error);
    }
  }

  // Enroll a user in a course
  static async enrollUserInCourse(userId: string, courseId: string) {
    console.log(`📝 Enrolling user ${userId} in course ${courseId}...`);

    try {
      const { addDoc } = await import("firebase/firestore");

      const enrollmentData = {
        studentId: userId,
        courseId: courseId,
        status: "enrolled",
        enrolledAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "enrollments"), enrollmentData);
      console.log(`✅ User enrolled successfully with ID: ${docRef.id}`);

      return docRef.id;
    } catch (error) {
      console.error("❌ Error enrolling user:", error);
      throw error;
    }
  }

  // Assign teacher to course
  static async assignTeacherToCourse(teacherId: string, teacherEmail: string, courseId: string) {
    console.log(`👨‍🏫 Assigning teacher ${teacherEmail} to course ${courseId}...`);

    try {
      const { addDoc, Timestamp } = await import("firebase/firestore");

      // Get course details
      const courseDoc = await getDoc(doc(db, "courses", courseId));
      if (!courseDoc.exists()) {
        throw new Error(`Course ${courseId} not found`);
      }

      const courseData = courseDoc.data();

      const assignmentData = {
        teacherId,
        teacherEmail,
        courseId,
        courseCode: courseData.code,
        courseTitle: courseData.title,
        semester: courseData.semester || "Unknown",
        assignedAt: Timestamp.now(),
        status: 'active'
      };

      const docRef = await addDoc(collection(db, "teacherAssignments"), assignmentData);
      console.log(`✅ Teacher assigned successfully with ID: ${docRef.id}`);

      return docRef.id;
    } catch (error) {
      console.error("❌ Error assigning teacher:", error);
      throw error;
    }
  }
}

// Quick access functions for console use
export const checkDatabase = () => DatabaseDebugger.checkAllCollections();
export const checkUser = (userId: string) => DatabaseDebugger.checkUserDetails(userId);
export const checkCourses = () => DatabaseDebugger.checkAllCourses();
export const enrollUser = (userId: string, courseId: string) => DatabaseDebugger.enrollUserInCourse(userId, courseId);
export const assignTeacher = (teacherId: string, teacherEmail: string, courseId: string) =>
  DatabaseDebugger.assignTeacherToCourse(teacherId, teacherEmail, courseId);
