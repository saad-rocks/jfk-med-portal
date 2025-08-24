import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
export async function createAssignment(a) {
    const user = auth.currentUser;
    if (!user)
        throw new Error("Must be signed in");
    const payload = {
        ...a,
        ownerId: user.uid,
        createdAt: Date.now(),
    };
    const ref = await addDoc(collection(db, "assignments"), payload);
    return ref.id;
}
export async function listAssignments(courseId) {
    const q = query(collection(db, "assignments"), where("courseId", "==", courseId));
    const snap = await getDocs(q);
    const out = [];
    snap.forEach(d => out.push({ id: d.id, ...d.data() }));
    return out;
}
export async function getAssignment(assignmentId) {
    const d = await getDoc(doc(db, "assignments", assignmentId));
    return d.exists() ? ({ id: d.id, ...d.data() }) : null;
}
