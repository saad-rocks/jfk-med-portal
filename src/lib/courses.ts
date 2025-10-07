import { addDoc, collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { Course, CourseInput } from "../types";

// Simple in-memory cache for frequently accessed data
const coursesCache = new Map<string, { data: Array<Course & { id: string }>, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function createCourse(input: CourseInput): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  try {
    const docRef = await addDoc(collection(db, "courses"), {
      code: input.code,
      title: input.title,
      credits: Number(input.credits),
      semester: input.semester,
      instructor: input.instructor,
      description: input.description,
      ownerId: user.uid,
      createdAt: Date.now(),
    } as Course);

    // Invalidate cache when new course is created
    coursesCache.delete('all');

    return docRef.id;
  } catch (error) {
    console.error('Error creating course:', error);
    throw new Error('Failed to create course');
  }
}

export async function listCourses(): Promise<Array<Course & { id: string }>> {
  try {
    // Check cache first
    const cacheKey = 'all';
    const cached = coursesCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      return cached.data;
    }

    const snap = await getDocs(collection(db, "courses"));
    const results: Array<Course & { id: string }> = [];

    snap.forEach(doc => {
      const data = doc.data() as Course;
      results.push({ ...data, id: doc.id });
    });

    // Cache the results
    coursesCache.set(cacheKey, { data: results, timestamp: Date.now() });

    return results;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses');
  }
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


