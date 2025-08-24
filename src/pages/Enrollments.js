import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../firebase";
export async function createEnrollment(input) {
    const user = auth.currentUser;
    if (!user)
        throw new Error("Must be signed in");
    const ref = await addDoc(collection(db, "enrollments"), {
        studentId: input.studentId,
        courseId: input.courseId,
        semesterId: input.semesterId,
        status: input.status ?? "enrolled",
        createdAt: Date.now(),
    });
    return ref.id;
}
export async function listEnrollments(filters) {
    const col = collection(db, "enrollments");
    let q = col;
    const whereClauses = [];
    if (filters?.courseId)
        whereClauses.push(where("courseId", "==", filters.courseId));
    if (filters?.semesterId)
        whereClauses.push(where("semesterId", "==", filters.semesterId));
    if (whereClauses.length > 0) {
        // @ts-ignore
        q = query(col, ...whereClauses);
    }
    const snap = await getDocs(q);
    const out = [];
    snap.forEach(d => out.push({ id: d.id, ...d.data() }));
    return out;
}
export async function listEnrollmentsForStudent(studentId) {
    const q = query(collection(db, "enrollments"), where("studentId", "==", studentId));
    const snap = await getDocs(q);
    const out = [];
    snap.forEach(d => out.push({ id: d.id, ...d.data() }));
    return out;
}
export async function updateEnrollmentStatus(enrollmentId, status) {
    await updateDoc(doc(db, "enrollments", enrollmentId), { status });
}
export async function deleteEnrollment(enrollmentId) {
    await deleteDoc(doc(db, "enrollments", enrollmentId));
}
export async function getCourseById(courseId) {
    const d = await getDoc(doc(db, "courses", courseId));
    return d.exists() ? { id: d.id, ...d.data() } : null;
}
