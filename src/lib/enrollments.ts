import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, type Query, type CollectionReference } from "firebase/firestore";
import { auth, db } from "../firebase";
import { getAllUsers } from "./users";

export type EnrollmentStatus = "enrolled" | "dropped" | "completed";

export type Enrollment = {
  id?: string;
  studentId: string;
  courseId: string;
  semesterId: string;
  status: EnrollmentStatus;
  enrolledAt: number;
  droppedAt?: number;
  completedAt?: number;
  grade?: string;
  gpa?: number;
  createdAt: number;
};

export type EnrollmentInput = {
  studentId: string;
  courseId: string;
  semesterId: string;
  status?: EnrollmentStatus;
};

// Cache for enrollment data with longer TTL for better performance
const enrollmentCache = new Map<string, { data: any, timestamp: number }>();
const ENROLLMENT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes for enrollment data

// Cache for user data to prevent repeated fetches
const userDataCache = new Map<string, { data: any, timestamp: number }>();
const USER_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for user data

// Diagnostic function to check enrollment data consistency
export async function diagnoseEnrollmentData(courseId: string): Promise<{
  totalEnrollments: number;
  uniqueStudentIds: string[];
  sampleEnrollments: any[];
  issues: string[];
}> {
  try {

    const issues: string[] = [];
    const uniqueStudentIds = new Set<string>();
    const sampleEnrollments: any[] = [];

    const enrollments = await listEnrollments();
    const courseEnrollments = enrollments.filter(e => e.courseId === courseId);


    courseEnrollments.forEach((enrollment) => {
      uniqueStudentIds.add(enrollment.studentId);

      // Collect sample enrollments
      if (sampleEnrollments.length < 10) {
        sampleEnrollments.push(enrollment);
      }

      // Check for potential issues
      if (!enrollment.studentId || enrollment.studentId.trim() === '') {
        issues.push(`Empty studentId in enrollment ${enrollment.id}`);
      }
    });

    return {
      totalEnrollments: courseEnrollments.length,
      uniqueStudentIds: Array.from(uniqueStudentIds),
      sampleEnrollments,
      issues
    };
  } catch (error) {
    return {
      totalEnrollments: 0,
      uniqueStudentIds: [],
      sampleEnrollments: [],
      issues: [`Diagnostic error: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

export async function createEnrollment(input: EnrollmentInput): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  try {
    const ref = await addDoc(collection(db, "enrollments"), {
      studentId: input.studentId,
      courseId: input.courseId,
      semesterId: input.semesterId,
      status: input.status ?? "enrolled",
      createdAt: Date.now(),
    } as Enrollment);

    // Invalidate relevant caches
    enrollmentCache.delete(`student_${input.studentId}`);
    enrollmentCache.delete(`course_${input.courseId}`);

    return ref.id;
  } catch (error) {
    throw new Error('Failed to create enrollment');
  }
}

export async function listEnrollments(filters?: { courseId?: string; semesterId?: string }): Promise<Array<Enrollment & { id: string }>> {
  const col = collection(db, "enrollments");
  let q: Query | CollectionReference = col;
  const whereClauses: ReturnType<typeof where>[] = [];
  if (filters?.courseId) whereClauses.push(where("courseId", "==", filters.courseId));
  if (filters?.semesterId) whereClauses.push(where("semesterId", "==", filters.semesterId));
  if (whereClauses.length > 0) {
    q = query(col, ...whereClauses);
  }
  const snap = await getDocs(q);
  const out: Array<Enrollment & { id: string }> = [];
  snap.forEach(d => out.push({ id: d.id, ...(d.data() as Enrollment) }));
  return out;
}

// Optimized function to get enrollments with student details in bulk (fixes N+1 queries)
export async function getEnrollmentsWithStudentDetails(courseId: string): Promise<Array<Enrollment & {
  id: string;
  studentName: string;
  studentEmail: string;
  studentMdYear: string;
}>> {
  try {
    const cacheKey = `course_enrollments_with_details_${courseId}`;
    const cached = enrollmentCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < ENROLLMENT_CACHE_DURATION) {
      return cached.data;
    }

    // Get all enrollments for the course
    const enrollments = await listEnrollments({ courseId });
    const activeEnrollments = enrollments.filter(e => e.status === 'enrolled');

    if (activeEnrollments.length === 0) {
      enrollmentCache.set(cacheKey, { data: [], timestamp: Date.now() });
      return [];
    }

    // Get all users in one query (instead of N queries)
    let allUsers;
    const userCacheKey = 'all_users';
    const userCached = userDataCache.get(userCacheKey);

    if (userCached && Date.now() - userCached.timestamp < USER_CACHE_DURATION) {
      allUsers = userCached.data;
    } else {
      const { getAllUsers } = await import('./users');
      allUsers = await getAllUsers();
      userDataCache.set(userCacheKey, { data: allUsers, timestamp: Date.now() });
    }

    // Create a user map for O(1) lookups
    const usersMapById = new Map(allUsers.map((user: any) => [user.id, user]));
    const usersMapByUid = new Map(
      allUsers
        .filter((user: any) => user.uid)
        .map((user: any) => [user.uid, user])
    );

    // Combine enrollment and user data
    const enrollmentsWithDetails = activeEnrollments.map(enrollment => {
      const student = (usersMapById.get(enrollment.studentId) ||
        usersMapByUid.get(enrollment.studentId)) as any;
      return {
        ...enrollment,
        studentName: student?.name || student?.email || 'Unknown Student',
        studentEmail: student?.email || '',
        studentMdYear: student?.mdYear || 'MD-1'
      };
    });

    // Cache the result
    enrollmentCache.set(cacheKey, { data: enrollmentsWithDetails, timestamp: Date.now() });

    return enrollmentsWithDetails;
  } catch (error) {
    return [];
  }
}

export async function listEnrollmentsForStudent(studentId: string): Promise<Array<Enrollment & { id: string }>> {
  try {
    // Check cache first
    const cacheKey = `student_${studentId}`;
    const cached = enrollmentCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < ENROLLMENT_CACHE_DURATION) {
      return cached.data;
    }

    // Initial query by provided key
    const q = query(collection(db, "enrollments"), where("studentId", "==", studentId));
    let snap = await getDocs(q);
    let out: Array<Enrollment & { id: string }> = [];

    snap.forEach(d => out.push({ id: d.id, ...(d.data() as Enrollment) }));

    // Fallback: if nothing found, try resolving a Firestore profile id from uid/email
    if (out.length === 0) {
      try {
        const users = await getAllUsers();
        const keyLc = studentId?.toLowerCase?.() ?? studentId;
        const match = users.find(u => u.uid === studentId || u.id === studentId || (u.email && u.email.toLowerCase() === keyLc));
        if (match?.id && match.id !== studentId) {
          const q2 = query(collection(db, "enrollments"), where("studentId", "==", match.id));
          snap = await getDocs(q2);
          out = [];
          snap.forEach(d => out.push({ id: d.id, ...(d.data() as Enrollment) }));
        }
      } catch (e) {
      }
    }

    // Cache the results
    enrollmentCache.set(cacheKey, { data: out, timestamp: Date.now() });

    return out;
  } catch (error) {
    throw new Error('Failed to fetch student enrollments');
  }
}

export async function updateEnrollmentStatus(enrollmentId: string, status: EnrollmentStatus): Promise<void> {
  try {
    await updateDoc(doc(db, "enrollments", enrollmentId), { status });

    // Invalidate all enrollment caches when data changes
    enrollmentCache.clear();
  } catch (error) {
    throw new Error('Failed to update enrollment status');
  }
}

export async function deleteEnrollment(enrollmentId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "enrollments", enrollmentId));

    // Invalidate all enrollment caches when data changes
    enrollmentCache.clear();
  } catch (error) {
    throw new Error('Failed to delete enrollment');
  }
}

export async function getCourseById(courseId: string): Promise<{ id: string; [key: string]: unknown } | null> {
  const d = await getDoc(doc(db, "courses", courseId));
  return d.exists() ? { id: d.id, ...d.data() } : null;
}

// Debug function to check all enrollments
export async function debugEnrollments(): Promise<Array<Enrollment & { id: string }>> {
  try {
    const allEnrollments = await listEnrollments();

    allEnrollments.forEach((enrollment, index) => {
    });

    return allEnrollments;
  } catch (error) {
    return [];
  }
}

// Debug function to check database state
export async function debugDatabaseState(): Promise<void> {
  try {

    // Check courses
    const coursesSnap = await getDocs(collection(db, "courses"));
    const courses = coursesSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

    // Check users
    const usersSnap = await getDocs(collection(db, "users"));
    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

    const students = users.filter(u => (u as any).role === 'student');
    const teachers = users.filter(u => (u as any).role === 'teacher');
    const admins = users.filter(u => (u as any).role === 'admin');

    // Check enrollments
    const enrollments = await listEnrollments();

    // Group enrollments by course
    const enrollmentsByCourse: { [courseId: string]: string[] } = {};
    enrollments.forEach(enrollment => {
      if (!enrollmentsByCourse[enrollment.courseId]) {
        enrollmentsByCourse[enrollment.courseId] = [];
      }
      enrollmentsByCourse[enrollment.courseId].push(enrollment.studentId);
    });

    Object.entries(enrollmentsByCourse).forEach(([courseId, studentIds]) => {
      const course = courses.find(c => c.id === courseId);
      studentIds.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
      });
    });

  } catch (error) {
  }
}

// Create sample enrollments for testing
export async function createSampleEnrollments(): Promise<void> {
  try {

    // Get all courses and students
    const coursesSnap = await getDocs(collection(db, "courses"));
    const studentsSnap = await getDocs(query(collection(db, "users"), where("role", "==", "student")));

    const courses = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));


    if (courses.length === 0) {
      return;
    }

    if (students.length === 0) {
      return;
    }

    // Create enrollments for each course with some students
    for (const course of courses.slice(0, Math.min(3, courses.length))) { // Use first 3 courses
      const studentsForCourse = students.slice(0, Math.min(5, students.length)); // Enroll up to 5 students per course


      for (const student of studentsForCourse) {
        try {
          // Use the student's Firestore document ID as the enrollment key
          // This matches how the app loads students
          const enrollmentData = {
            studentId: student.id, // Use Firestore document ID (matches student.id used in attendance)
            courseId: course.id,
            semesterId: "current-semester",
            status: "enrolled" as const,
            createdAt: Date.now()
          };

          await addDoc(collection(db, "enrollments"), enrollmentData);
        } catch (error) {
        }
      }
    }

  } catch (error) {
    throw error;
  }
}
