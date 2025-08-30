import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getAllUsers } from './users';

export interface TeacherAssignment {
  id?: string;
  teacherId: string; // Firestore user document ID
  teacherEmail: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  semester: string;
  assignedAt: Timestamp | Date;
  status: 'active' | 'inactive';
}

export interface CreateTeacherAssignmentInput {
  teacherId: string;
  teacherEmail: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  semester: string;
}

const TEACHER_ASSIGNMENTS_COLLECTION = 'teacherAssignments';

// Helper function to check if current user is a teacher
async function isCurrentUserTeacher(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) {
    console.log('❌ No current user found');
    return false;
  }

  try {
    console.log('🔍 Checking if user is teacher:', user.email);
    console.log('🔍 User UID:', user.uid);

    const allUsers = await getAllUsers();
    console.log('📊 Total users in database:', allUsers.length);
    console.log('👥 All users:', allUsers.map(u => ({
      id: u.id,
      uid: u.uid,
      email: u.email,
      role: u.role,
      status: u.status
    })));

    // Try to find by email first
    const currentUserByEmail = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
    console.log('📧 User found by email:', currentUserByEmail ? {
      id: currentUserByEmail.id,
      uid: currentUserByEmail.uid,
      email: currentUserByEmail.email,
      role: currentUserByEmail.role
    } : 'Not found');

    // Try to find by UID
    const currentUserByUid = allUsers.find(u => u.uid === user.uid);
    console.log('🆔 User found by UID:', currentUserByUid ? {
      id: currentUserByUid.id,
      uid: currentUserByUid.uid,
      email: currentUserByUid.email,
      role: currentUserByUid.role
    } : 'Not found');

    // Use UID match if email match fails
    const currentUser = currentUserByEmail || currentUserByUid;

    console.log('🎯 Final user found:', currentUser ? {
      id: currentUser.id,
      uid: currentUser.uid,
      email: currentUser.email,
      role: currentUser.role
    } : 'Not found');

    const isTeacher = currentUser?.role === 'teacher';
    console.log('✅ Is teacher?', isTeacher);

    return isTeacher;
  } catch (error) {
    console.error('❌ Error checking if user is teacher:', error);
    return false;
  }
}

// Create a new teacher assignment
export async function createTeacherAssignment(input: CreateTeacherAssignmentInput): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  // Check if user is a teacher
  const isTeacher = await isCurrentUserTeacher();
  if (!isTeacher) {
    throw new Error("Only teachers can assign courses to themselves");
  }

  // Check if course already has an active instructor
  const existingAssignments = await getCourseTeacherAssignments(input.courseId);
  if (existingAssignments.length > 0) {
    throw new Error("This course already has an instructor assigned");
  }

  const payload: TeacherAssignment = {
    ...input,
    assignedAt: Timestamp.now(),
    status: 'active'
  };

  // Use a batch to ensure both operations succeed or fail together
  const batch = writeBatch(db);
  
  // Add teacher assignment
  const assignmentRef = doc(collection(db, TEACHER_ASSIGNMENTS_COLLECTION));
  batch.set(assignmentRef, payload);
  
  // Update course instructor
  const courseRef = doc(db, "courses", input.courseId);
  console.log('🔧 Updating course instructor:', input.courseId, 'to:', input.teacherEmail);
  batch.update(courseRef, {
    instructor: input.teacherEmail
  });
  
  await batch.commit();
  return assignmentRef.id;
}

// Get all assignments for a specific teacher
export async function getTeacherAssignments(teacherId: string): Promise<Array<TeacherAssignment & { id: string }>> {
  try {
    console.log(`🔍 Fetching teacher assignments for teacherId: ${teacherId}`);
    
    // First try with orderBy (requires index)
    try {
      const q = query(
        collection(db, TEACHER_ASSIGNMENTS_COLLECTION),
        where('teacherId', '==', teacherId),
        where('status', '==', 'active'),
        orderBy('assignedAt', 'desc')
      );
      
      const snap = await getDocs(q);
      const assignments: Array<TeacherAssignment & { id: string }> = [];
      
      snap.forEach(doc => {
        assignments.push({ id: doc.id, ...doc.data() as TeacherAssignment });
      });
      
      console.log(`✅ Found ${assignments.length} teacher assignments with orderBy`);
      return assignments;
    } catch (orderByError) {
      console.log(`⚠️ OrderBy query failed, trying without orderBy:`, orderByError);
      
      // Fallback: query without orderBy
      const q = query(
        collection(db, TEACHER_ASSIGNMENTS_COLLECTION),
        where('teacherId', '==', teacherId),
        where('status', '==', 'active')
      );
      
      const snap = await getDocs(q);
      const assignments: Array<TeacherAssignment & { id: string }> = [];
      
      snap.forEach(doc => {
        assignments.push({ id: doc.id, ...doc.data() as TeacherAssignment });
      });
      
      // Sort manually if needed
      assignments.sort((a, b) => {
        const aTime = a.assignedAt instanceof Date ? a.assignedAt.getTime() : (a.assignedAt as any)?.seconds * 1000 || 0;
        const bTime = b.assignedAt instanceof Date ? b.assignedAt.getTime() : (b.assignedAt as any)?.seconds * 1000 || 0;
        return bTime - aTime;
      });
      
      console.log(`✅ Found ${assignments.length} teacher assignments without orderBy`);
      return assignments;
    }
  } catch (error) {
    console.error(`❌ Error fetching teacher assignments for ${teacherId}:`, error);
    return [];
  }
}

// Get all assignments for a specific course
export async function getCourseTeacherAssignments(courseId: string): Promise<Array<TeacherAssignment & { id: string }>> {
  const q = query(
    collection(db, TEACHER_ASSIGNMENTS_COLLECTION),
    where('courseId', '==', courseId),
    where('status', '==', 'active'),
    orderBy('assignedAt', 'desc')
  );
  
  const snap = await getDocs(q);
  const assignments: Array<TeacherAssignment & { id: string }> = [];
  
  snap.forEach(doc => {
    assignments.push({ id: doc.id, ...doc.data() as TeacherAssignment });
  });
  
  return assignments;
}

// Remove a teacher assignment (soft delete by setting status to inactive)
export async function removeTeacherAssignment(assignmentId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  // Check if user is a teacher
  const isTeacher = await isCurrentUserTeacher();
  if (!isTeacher) {
    throw new Error("Only teachers can remove their course assignments");
  }

  // Get the assignment details first
  const assignmentRef = doc(db, TEACHER_ASSIGNMENTS_COLLECTION, assignmentId);
  const assignmentDoc = await getDoc(assignmentRef);
  
  if (!assignmentDoc.exists()) {
    throw new Error("Assignment not found");
  }
  
  const assignmentData = assignmentDoc.data() as TeacherAssignment;
  
  // Use a batch to ensure both operations succeed or fail together
  const batch = writeBatch(db);
  
  // Deactivate the assignment
  batch.update(assignmentRef, {
    status: 'inactive',
    updatedAt: Timestamp.now()
  });
  
  // Clear the course instructor
  const courseRef = doc(db, "courses", assignmentData.courseId);
  console.log('🔧 Clearing course instructor:', assignmentData.courseId, 'setting to: TBD');
  batch.update(courseRef, {
    instructor: "TBD" // or empty string, depending on your preference
  });
  
  await batch.commit();
}

// Check if a teacher is assigned to a specific course
export async function isTeacherAssignedToCourse(teacherId: string, courseId: string): Promise<boolean> {
  const q = query(
    collection(db, TEACHER_ASSIGNMENTS_COLLECTION),
    where('teacherId', '==', teacherId),
    where('courseId', '==', courseId),
    where('status', '==', 'active')
  );
  
  const snap = await getDocs(q);
  return !snap.empty;
}

// Get all active teacher assignments
export async function getAllTeacherAssignments(): Promise<Array<TeacherAssignment & { id: string }>> {
  const q = query(
    collection(db, TEACHER_ASSIGNMENTS_COLLECTION),
    where('status', '==', 'active'),
    orderBy('assignedAt', 'desc')
  );
  
  const snap = await getDocs(q);
  const assignments: Array<TeacherAssignment & { id: string }> = [];
  
  snap.forEach(doc => {
    assignments.push({ id: doc.id, ...doc.data() as TeacherAssignment });
  });
  
  return assignments;
}

// Get the current instructor for a specific course
export async function getCourseInstructor(courseId: string): Promise<string | null> {
  const assignments = await getCourseTeacherAssignments(courseId);
  if (assignments.length > 0) {
    return assignments[0].teacherEmail;
  }
  return null;
}

// Check if a course is available for assignment (no active instructor)
export async function isCourseAvailableForAssignment(courseId: string): Promise<boolean> {
  const assignments = await getCourseTeacherAssignments(courseId);
  return assignments.length === 0;
}

// Debug function to check all teacher assignments
export async function debugTeacherAssignments(): Promise<Array<TeacherAssignment & { id: string }>> {
  try {
    console.log("🔍 Debugging teacher assignments...");
    const allAssignments = await getAllTeacherAssignments();
    console.log("📊 Total teacher assignments in DB:", allAssignments.length);

    allAssignments.forEach((assignment, index) => {
      console.log(`  ${index + 1}. Teacher: ${assignment.teacherEmail}, Course: ${assignment.courseCode}, Status: ${assignment.status}, TeacherID: ${assignment.teacherId}`);
    });

    return allAssignments;
  } catch (error) {
    console.error("❌ Error debugging teacher assignments:", error);
    return [];
  }
}

// Debug function to check user database state
export async function debugUserDatabase(): Promise<void> {
  try {
    console.log("🔍 Debugging user database...");
    const allUsers = await getAllUsers();
    console.log("📊 Total users in database:", allUsers.length);

    const teachers = allUsers.filter(u => u.role === 'teacher');
    const students = allUsers.filter(u => u.role === 'student');
    const admins = allUsers.filter(u => u.role === 'admin');

    console.log("👨‍🏫 Teachers:", teachers.length);
    teachers.forEach((teacher, index) => {
      console.log(`  ${index + 1}. ID: ${teacher.id}, UID: ${teacher.uid}, Email: ${teacher.email}, Status: ${teacher.status}`);
    });

    console.log("👨‍🎓 Students:", students.length);
    students.forEach((student, index) => {
      console.log(`  ${index + 1}. ID: ${student.id}, UID: ${student.uid}, Email: ${student.email}, MD Year: ${student.mdYear}, Status: ${student.status}`);
    });

    console.log("👑 Admins:", admins.length);
    admins.forEach((admin, index) => {
      console.log(`  ${index + 1}. ID: ${admin.id}, UID: ${admin.uid}, Email: ${admin.email}, Status: ${admin.status}`);
    });

    // Check current Firebase Auth user
    const currentUser = auth.currentUser;
    console.log("🔐 Current Firebase Auth User:", currentUser ? {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName
    } : 'Not authenticated');

    // Try to match current user with database user
    if (currentUser) {
      const dbUser = allUsers.find(u => u.uid === currentUser.uid || u.email?.toLowerCase() === currentUser.email?.toLowerCase());
      console.log("🔗 Database match for current user:", dbUser ? {
        id: dbUser.id,
        uid: dbUser.uid,
        email: dbUser.email,
        role: dbUser.role,
        status: dbUser.status
      } : 'No match found');
    }

  } catch (error) {
    console.error("❌ Error debugging user database:", error);
  }
}

// Helper function to check if a specific teacher has any assignments
export async function checkTeacherAssignments(teacherId: string): Promise<Array<TeacherAssignment & { id: string }>> {
  try {
    console.log(`🔍 Checking assignments for teacher ID: ${teacherId}`);
    
    // Query directly without orderBy to avoid index issues
    const q = query(
      collection(db, TEACHER_ASSIGNMENTS_COLLECTION),
      where('teacherId', '==', teacherId),
      where('status', '==', 'active')
    );
    
    const snap = await getDocs(q);
    const assignments: Array<TeacherAssignment & { id: string }> = [];
    
    snap.forEach(doc => {
      assignments.push({ id: doc.id, ...doc.data() as TeacherAssignment });
    });
    
    console.log(`✅ Found ${assignments.length} assignments for teacher ${teacherId}:`, assignments);
    return assignments;
  } catch (error) {
    console.error(`❌ Error checking teacher assignments for ${teacherId}:`, error);
    return [];
  }
}

// Utility function to assign a teacher to a course (for admin use)
export async function assignTeacherToCourse(
  teacherId: string,
  teacherEmail: string,
  courseId: string
): Promise<string> {
  try {
    console.log(`👨‍🏫 Assigning teacher ${teacherEmail} to course ${courseId}...`);

    // Get course details
    const { getDoc, doc, addDoc, writeBatch, Timestamp } = await import("firebase/firestore");
    const courseDoc = await getDoc(doc(db, "courses", courseId));

    if (!courseDoc.exists()) {
      throw new Error(`Course ${courseId} not found`);
    }

    const courseData = courseDoc.data();

    // Check if course already has an active instructor
    const existingAssignments = await getCourseTeacherAssignments(courseId);
    if (existingAssignments.length > 0) {
      throw new Error("This course already has an instructor assigned");
    }

    // Create teacher assignment directly (bypassing teacher restriction)
    const assignmentData: TeacherAssignment = {
      teacherId,
      teacherEmail,
      courseId,
      courseCode: courseData.code,
      courseTitle: courseData.title,
      semester: courseData.semester || "Unknown",
      assignedAt: Timestamp.now(),
      status: 'active'
    };

    // Use a batch to ensure both operations succeed or fail together
    const batch = writeBatch(db);
    
    // Add teacher assignment
    const assignmentRef = doc(collection(db, TEACHER_ASSIGNMENTS_COLLECTION));
    batch.set(assignmentRef, assignmentData);
    
    // Update course instructor
    const courseRef = doc(db, "courses", courseId);
    console.log('🔧 Updating course instructor:', courseId, 'to:', teacherEmail);
    batch.update(courseRef, {
      instructor: teacherEmail
    });
    
    await batch.commit();
    
    console.log(`✅ Teacher assigned successfully with ID: ${assignmentRef.id}`);
    return assignmentRef.id;
  } catch (error) {
    console.error("❌ Error assigning teacher to course:", error);
    throw error;
  }
}

// Admin function to remove teacher assignment from a course
export async function adminRemoveTeacherAssignment(courseId: string): Promise<void> {
  try {
    console.log(`👨‍🏫 Admin removing teacher assignment from course ${courseId}...`);

    const { doc, writeBatch, getDocs, query, where } = await import("firebase/firestore");
    
    // Get the current teacher assignment for this course
    const assignments = await getCourseTeacherAssignments(courseId);
    if (assignments.length === 0) {
      throw new Error("No teacher assignment found for this course");
    }

    // Use a batch to ensure both operations succeed or fail together
    const batch = writeBatch(db);
    
    // Remove teacher assignment (set status to inactive)
    for (const assignment of assignments) {
      const assignmentRef = doc(db, TEACHER_ASSIGNMENTS_COLLECTION, assignment.id);
      batch.update(assignmentRef, { status: 'inactive' });
    }
    
    // Update course instructor to empty
    const courseRef = doc(db, "courses", courseId);
    console.log('🔧 Removing instructor from course:', courseId);
    batch.update(courseRef, {
      instructor: ""
    });
    
    await batch.commit();
    
    console.log(`✅ Teacher assignment removed successfully from course ${courseId}`);
  } catch (error) {
    console.error("❌ Error removing teacher assignment:", error);
    throw error;
  }
}

// Create sample teacher assignments for testing
export async function createSampleTeacherAssignments(): Promise<void> {
  try {
    console.log('🎯 Creating sample teacher assignments...');

    // Get all users and courses
    const users = await getAllUsers();
    const teachers = users.filter(u => u.role === 'teacher');
    const courses = await getDocs(collection(db, 'courses'));

    if (teachers.length === 0) {
      console.log('❌ No teachers found in database');
      return;
    }

    if (courses.empty) {
      console.log('❌ No courses found in database');
      return;
    }

    const courseDocs = courses.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Create assignments for each teacher with some courses
    for (let i = 0; i < teachers.length; i++) {
      const teacher = teachers[i];
      const teacherCourses = courseDocs.slice(i * 2, (i + 1) * 2); // Assign 2 courses per teacher

      for (const course of teacherCourses) {
        try {
          const assignmentInput: CreateTeacherAssignmentInput = {
            teacherId: teacher.id!,
            teacherEmail: teacher.email!,
            courseId: course.id,
            courseCode: (course as any).code || `COURSE${course.id.slice(0, 4)}`,
            courseTitle: (course as any).title || `Course ${course.id.slice(0, 8)}`,
            semester: (course as any).semester || 'MD-1'
          };

          await createTeacherAssignment(assignmentInput);
          console.log(`✅ Created assignment: ${teacher.email} -> ${(course as any).title}`);
        } catch (error) {
          console.log(`⚠️ Assignment already exists or error: ${teacher.email} -> ${(course as any).title}`);
        }
      }
    }

    console.log('🎉 Sample teacher assignments created successfully!');
  } catch (error) {
    console.error('Error creating sample teacher assignments:', error);
    throw error;
  }
}