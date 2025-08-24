import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export type Course = {
  code: string;
  title: string;
  credits: number;
  semester: string; // e.g., MD-1 .. MD-11
  capacity: number;
  instructor: string;
  description: string;
  ownerId: string;
  createdAt: number; // Date.now()
};

export type CourseInput = {
  code: string;
  title: string;
  credits: number;
  semester: string;
  capacity: number;
  instructor: string;
  description: string;
};

export async function createCourse(input: CourseInput): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

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
  } as Course);

  return docRef.id;
}

export async function listCourses(): Promise<Array<Course & { id: string }>> {
  const snap = await getDocs(collection(db, "courses"));
  const results: Array<Course & { id: string }> = [];
  snap.forEach(doc => {
    const data = doc.data() as Course;
    results.push({ id: doc.id, ...data });
  });
  return results;
}

export async function updateCourse(courseId: string, input: CourseInput): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  console.log('🔧 Updating course:', courseId, 'User:', user.email, 'UID:', user.uid);

  const courseRef = doc(db, "courses", courseId);
  const updateData = {
    code: input.code,
    title: input.title,
    credits: Number(input.credits),
    semester: input.semester,
    capacity: Number(input.capacity),
    instructor: input.instructor,
    description: input.description,
  };

  console.log('🔧 Update data:', updateData);

  try {
    await updateDoc(courseRef, updateData);
    console.log('✅ Course updated successfully');
  } catch (error) {
    console.error('❌ Error updating course:', error);
    throw error;
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  const courseRef = doc(db, "courses", courseId);
  await deleteDoc(courseRef);
}


