import { addDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
export async function createCourse(input) {
    const user = auth.currentUser;
    if (!user)
        throw new Error("Must be signed in");
    const docRef = await addDoc(collection(db, "courses"), {
        code: input.code,
        title: input.title,
        credits: Number(input.credits),
        semester: input.semester,
        capacity: Number(input.capacity),
        instructor: input.instructor,
        description: input.description,
        ownerId: user.uid,
        createdAt: Date.now(),
    });
    return docRef.id;
}
export async function listCourses() {
    const snap = await getDocs(collection(db, "courses"));
    const results = [];
    snap.forEach(doc => {
        const data = doc.data();
        results.push({ id: doc.id, ...data });
    });
    return results;
}
