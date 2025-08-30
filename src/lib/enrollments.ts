import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, type Query, type CollectionReference } from "firebase/firestore";
import { auth, db } from "../firebase";

export type EnrollmentStatus = "enrolled" | "dropped" | "completed";

export type Enrollment = {
  studentId: string;
  courseId: string;
  semesterId: string;
  status: EnrollmentStatus;
  createdAt: number;
};

export type EnrollmentInput = {
  studentId: string;
  courseId: string;
  semesterId: string;
  status?: EnrollmentStatus;
};

export async function createEnrollment(input: EnrollmentInput): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  const ref = await addDoc(collection(db, "enrollments"), {
    studentId: input.studentId,
    courseId: input.courseId,
    semesterId: input.semesterId,
    status: input.status ?? "enrolled",
    createdAt: Date.now(),
  } as Enrollment);
  return ref.id;
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

export async function listEnrollmentsForStudent(studentId: string): Promise<Array<Enrollment & { id: string }>> {
  const q = query(collection(db, "enrollments"), where("studentId", "==", studentId));
  const snap = await getDocs(q);
  const out: Array<Enrollment & { id: string }> = [];
  snap.forEach(d => out.push({ id: d.id, ...(d.data() as Enrollment) }));
  return out;
}

export async function updateEnrollmentStatus(enrollmentId: string, status: EnrollmentStatus): Promise<void> {
  await updateDoc(doc(db, "enrollments", enrollmentId), { status });
}

export async function deleteEnrollment(enrollmentId: string): Promise<void> {
  await deleteDoc(doc(db, "enrollments", enrollmentId));
}

export async function getCourseById(courseId: string): Promise<{ id: string; [key: string]: unknown } | null> {
  const d = await getDoc(doc(db, "courses", courseId));
  return d.exists() ? { id: d.id, ...d.data() } : null;
}

// Debug function to check all enrollments
export async function debugEnrollments(): Promise<Array<Enrollment & { id: string }>> {
  try {
    console.log('🔍 Debugging all enrollments...');
    const allEnrollments = await listEnrollments();
    console.log('📊 Total enrollments in DB:', allEnrollments.length);

    allEnrollments.forEach((enrollment, index) => {
      console.log(`  ${index + 1}. Student: ${enrollment.studentId}, Course: ${enrollment.courseId}, Status: ${enrollment.status}`);
    });

    return allEnrollments;
  } catch (error) {
    console.error('❌ Error debugging enrollments:', error);
    return [];
  }
}

// Debug function to check database state
export async function debugDatabaseState(): Promise<void> {
  try {
    console.log('🔍 Checking database state...');

    // Check courses
    const coursesSnap = await getDocs(collection(db, "courses"));
    const courses = coursesSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    console.log(`📚 Courses in DB: ${courses.length}`);
    courses.forEach(course => console.log(`  - ${(course as any).title} (${course.id})`));

    // Check users
    const usersSnap = await getDocs(collection(db, "users"));
    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
    console.log(`👥 Total users in DB: ${users.length}`);

    const students = users.filter(u => (u as any).role === 'student');
    const teachers = users.filter(u => (u as any).role === 'teacher');
    const admins = users.filter(u => (u as any).role === 'admin');

    console.log(`🎓 Students: ${students.length}`);
    students.forEach(student => console.log(`  - ${(student as any).name} (${student.id}, uid: ${(student as any).uid})`));

    console.log(`👨‍🏫 Teachers: ${teachers.length}`);
    teachers.forEach(teacher => console.log(`  - ${(teacher as any).name} (${teacher.id}, uid: ${(teacher as any).uid})`));

    console.log(`👑 Admins: ${admins.length}`);
    admins.forEach(admin => console.log(`  - ${(admin as any).name} (${admin.id}, uid: ${(admin as any).uid})`));

    // Check enrollments
    const enrollments = await listEnrollments();
    console.log(`📝 Enrollments in DB: ${enrollments.length}`);

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
      console.log(`  📚 Course: ${(course as any)?.title || courseId} (${studentIds.length} students)`);
      studentIds.forEach(studentId => {
        const student = students.find(s => s.id === studentId);
        console.log(`    👤 ${(student as any)?.name || 'Unknown'} (${studentId})`);
      });
    });

  } catch (error) {
    console.error('❌ Error debugging database state:', error);
  }
}

// Create sample enrollments for testing
export async function createSampleEnrollments(): Promise<void> {
  try {
    console.log('🎯 Creating sample enrollments...');

    // Get all courses and students
    const coursesSnap = await getDocs(collection(db, "courses"));
    const studentsSnap = await getDocs(query(collection(db, "users"), where("role", "==", "student")));

    const courses = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const students = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    console.log(`Found ${courses.length} courses and ${students.length} students`);
    console.log('Courses:', courses.map(c => ({ id: c.id, title: (c as any).title })));
    console.log('Students:', students.map(s => ({ id: s.id, uid: (s as any).uid, name: (s as any).name, email: (s as any).email })));

    if (courses.length === 0) {
      console.log('❌ No courses found. Please create some courses first.');
      return;
    }

    if (students.length === 0) {
      console.log('❌ No students found. Please create some student users first.');
      return;
    }

    // Create enrollments for each course with some students
    for (const course of courses.slice(0, Math.min(3, courses.length))) { // Use first 3 courses
      const studentsForCourse = students.slice(0, Math.min(5, students.length)); // Enroll up to 5 students per course

      console.log(`\n📚 Processing course: ${(course as any).title} (${course.id})`);
      console.log(`👥 Enrolling ${studentsForCourse.length} students`);

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

          console.log(`➕ Creating enrollment: Student ${(student as any).name} (${student.id}) -> Course ${(course as any).title} (${course.id})`);
          await addDoc(collection(db, "enrollments"), enrollmentData);
        } catch (error) {
          console.error(`❌ Error creating enrollment for student ${(student as any).name}:`, error);
        }
      }
    }

    console.log('\n✅ Sample enrollments created successfully!');
    console.log('🔄 Please refresh the page to see the updated enrollment counts.');
  } catch (error) {
    console.error('❌ Error creating sample enrollments:', error);
    throw error;
  }
}


