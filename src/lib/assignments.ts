import { addDoc, collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { Assignment } from "../types";

export async function createAssignment(a: Omit<Assignment, "id"|"createdAt"|"ownerId"> & { courseId: string }): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  const payload: Assignment = {
    ...a,
    ownerId: user.uid,
    createdAt: Date.now(),
  } as unknown as Assignment;

  const ref = await addDoc(collection(db, "assignments"), payload);
  return ref.id;
}

export async function listAssignments(courseId: string): Promise<Array<Assignment & { id: string }>> {
  const q = query(collection(db, "assignments"), where("courseId", "==", courseId));
  const snap = await getDocs(q);
  const out: Array<Assignment & { id: string }> = [];
  snap.forEach(d => out.push({ id: d.id, ...(d.data() as Assignment) }));
  return out;
}

export async function getAssignment(assignmentId: string): Promise<(Assignment & { id: string }) | null> {
  const d = await getDoc(doc(db, "assignments", assignmentId));
  return d.exists() ? ({ id: d.id, ...(d.data() as Assignment) }) : null;
}

export async function updateAssignment(assignmentId: string, updates: Partial<Assignment>): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  // Get the current assignment to check ownership
  const currentAssignment = await getAssignment(assignmentId);
  if (!currentAssignment) {
    throw new Error("Assignment not found");
  }

  // Check if the current user owns this assignment
  if (currentAssignment.ownerId !== user.uid) {
    throw new Error("You can only edit your own assignments");
  }

  // Update the assignment
  const assignmentRef = doc(db, "assignments", assignmentId);
  await updateDoc(assignmentRef, {
    ...updates,
    updatedAt: Date.now()
  });
}


