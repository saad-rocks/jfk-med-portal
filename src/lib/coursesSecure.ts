import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { Course, CourseInput } from '../types';
import { getUserByUid } from './users';

export async function updateCourse(courseId: string, input: CourseInput): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be signed in');

  const courseRef = doc(db, 'courses', courseId);
  const updateData = {
    code: input.code,
    title: input.title,
    credits: Number(input.credits),
    semester: input.semester,
    instructor: input.instructor,
    description: input.description,
  };

  const courseSnap = await getDoc(courseRef);
  if (!courseSnap.exists()) throw new Error('Course not found');
  const current = courseSnap.data() as Course;

  let role: 'admin' | 'teacher' | 'student' = 'student';
  try {
    const profile = await getUserByUid(user.uid);
    role = (profile as any)?.role || 'student';
  } catch {}

  const isOwner = (current as any).ownerId === user.uid;
  if (role !== 'admin') {
    if (role === 'teacher') {
      if (!isOwner) {
        const changedKeys = Object.entries(updateData)
          .filter(([k, v]) => (current as any)[k] !== v)
          .map(([k]) => k);
        const onlyInstructor = changedKeys.length > 0 && changedKeys.every(k => k === 'instructor');
        if (!onlyInstructor) {
          throw new Error('Teachers may only edit their own courses (or update instructor).');
        }
      }
    } else {
      throw new Error('Insufficient permissions to update course');
    }
  }

  await updateDoc(courseRef, updateData);
}

export async function deleteCourse(courseId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be signed in');

  const courseRef = doc(db, 'courses', courseId);
  const courseSnap = await getDoc(courseRef);
  if (!courseSnap.exists()) throw new Error('Course not found');
  const current = courseSnap.data() as Course;

  let role: 'admin' | 'teacher' | 'student' = 'student';
  try {
    const profile = await getUserByUid(user.uid);
    role = (profile as any)?.role || 'student';
  } catch {}

  const isOwner = (current as any).ownerId === user.uid;
  if (!(role === 'admin' || (role === 'teacher' && isOwner))) {
    throw new Error('Insufficient permissions to delete course');
  }

  await deleteDoc(courseRef);
}

