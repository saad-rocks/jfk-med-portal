import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// Debug utility to check database contents
export class DatabaseDebugger {

  // Check all collections and their document counts
  static async checkAllCollections() {

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
      } catch (error) {
      }
    }
  }

  // Check specific user details
  static async checkUserDetails(userId: string) {

    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check enrollments for this user
        const enrollmentsQuery = query(
          collection(db, "enrollments"),
          where("studentId", "==", userId)
        );
        const enrollmentsSnap = await getDocs(enrollmentsQuery);

        enrollmentsSnap.forEach(doc => {
        });

        // Check teacher assignments for this user
        const teacherAssignmentsQuery = query(
          collection(db, "teacherAssignments"),
          where("teacherId", "==", userId)
        );
        const teacherAssignmentsSnap = await getDocs(teacherAssignmentsQuery);

        teacherAssignmentsSnap.forEach(doc => {
        });

      } else {
      }
    } catch (error) {
    }
  }

  // Check all courses
  static async checkAllCourses() {

    try {
      const coursesSnap = await getDocs(collection(db, "courses"));

      coursesSnap.forEach(doc => {
        const courseData = doc.data();
      });
    } catch (error) {
    }
  }

  // Enroll a user in a course
  static async enrollUserInCourse(userId: string, courseId: string) {

    try {
      const { addDoc } = await import("firebase/firestore");

      const enrollmentData = {
        studentId: userId,
        courseId: courseId,
        status: "enrolled",
        enrolledAt: Date.now()
      };

      const docRef = await addDoc(collection(db, "enrollments"), enrollmentData);

      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  // Assign teacher to course
  static async assignTeacherToCourse(teacherId: string, teacherEmail: string, courseId: string) {

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

      return docRef.id;
    } catch (error) {
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
