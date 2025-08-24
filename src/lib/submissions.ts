import { collection, getDocs, query, setDoc, where, doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { Submission } from "../types";

// Storage upload removed for link-based submissions

export async function saveSubmission(data: Omit<Submission, "submittedAt">): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");
  const payload: Submission = {
    ...data,
    submittedAt: Date.now(),
  } as Submission;
  // Use deterministic doc id: assignmentId_studentId to allow replace
  const docId = `${payload.assignmentId}_${payload.studentId}`;
  await setDoc(doc(db, "submissions", docId), payload);
  return docId;
}

export async function listSubmissions(assignmentId: string): Promise<Array<Submission & { id: string }>> {
  const q = query(collection(db, "submissions"), where("assignmentId", "==", assignmentId));
  const snap = await getDocs(q);
  const out: Array<Submission & { id: string }> = [];
  snap.forEach(d => out.push({ id: d.id, ...(d.data() as Submission) }));
  return out;
}

export async function getSubmissionForStudent(assignmentId: string, studentId: string): Promise<(Submission & { id: string }) | null> {
  const docId = `${assignmentId}_${studentId}`;
  const d = await getDoc(doc(db, "submissions", docId));
  return d.exists() ? ({ id: d.id, ...(d.data() as Submission) }) : null;
}


