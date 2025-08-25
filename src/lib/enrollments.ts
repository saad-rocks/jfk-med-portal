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


