import { collection, getDocs, query, setDoc, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
// Storage upload removed for link-based submissions
export async function saveSubmission(data) {
    const user = auth.currentUser;
    if (!user)
        throw new Error("Must be signed in");
    const payload = {
        ...data,
        submittedAt: Date.now(),
    };
    // Use deterministic doc id: assignmentId_studentId to allow replace
    const docId = `${payload.assignmentId}_${payload.studentId}`;
    await setDoc(doc(db, "submissions", docId), payload);
    return docId;
}
export async function listSubmissions(assignmentId) {
    const q = query(collection(db, "submissions"), where("assignmentId", "==", assignmentId));
    const snap = await getDocs(q);
    const out = [];
    snap.forEach(d => out.push({ id: d.id, ...d.data() }));
    return out;
}
export async function getSubmissionForStudent(assignmentId, studentId) {
    const docId = `${assignmentId}_${studentId}`;
    const d = await getDoc(doc(db, "submissions", docId));
    return d.exists() ? ({ id: d.id, ...d.data() }) : null;
}
