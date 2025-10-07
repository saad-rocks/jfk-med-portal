import { addDoc, collection, doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { Assignment, Course } from "../types";
import { getAllUsers } from "./users";

// Resolve user identity from any key (Firestore profile id, Auth uid, or email)
async function resolveUserIdentity(userKey: string): Promise<{ profileId?: string; uid?: string; email?: string } | null> {
  try {
    const users = await getAllUsers();
    const keyLc = userKey?.toLowerCase?.() ?? userKey;
    const match = users.find(u => u.id === userKey || u.uid === userKey || (u.email && u.email.toLowerCase() === keyLc));
    if (!match) return null;
    return { profileId: match.id, uid: match.uid, email: match.email };
  } catch (e) {
    console.error('resolveUserIdentity failed:', e);
    return null;
  }
}

// Compute total weight used by all assignments in a course
export async function getCourseWeightUsage(courseId: string): Promise<{ total: number; remaining: number }> {
  const assignments = await listAssignments(courseId);
  const total = assignments.reduce((sum, a) => sum + Number(a.weight || 0), 0);
  const capped = Math.max(0, Math.min(100, total));
  return { total: Math.round(capped * 100) / 100, remaining: Math.max(0, Math.round((100 - capped) * 100) / 100) };
}

export async function createAssignment(a: Omit<Assignment, "id"|"createdAt"|"ownerId"> & { courseId: string }): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Must be signed in");

  const payload: Assignment = {
    ...a,
    ownerId: user.uid,
    createdAt: Date.now(),
  } as unknown as Assignment;

  // Enforce course total weight <= 100% (only when not using category-based mode)
  const courseSnap = await getDoc(doc(db, 'courses', a.courseId));
  const courseData = courseSnap.exists() ? (courseSnap.data() as Course) : null;
  const isCategoryMode = courseData?.gradingMode === 'category';
  if (!isCategoryMode) {
    const { total } = await getCourseWeightUsage(a.courseId);
    const nextTotal = (total || 0) + Number(a.weight || 0);
    if (nextTotal > 100 + 1e-6) {
      throw new Error(`Total course weight would be ${nextTotal.toFixed(1)}%, which exceeds 100%. Reduce this assignment's weight or adjust others.`);
    }
  }

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

  // If weight is being changed, enforce course total <= 100% when not in category mode
  if (typeof updates.weight !== 'undefined' && currentAssignment.courseId) {
    const courseSnap = await getDoc(doc(db, 'courses', currentAssignment.courseId));
    const courseData = courseSnap.exists() ? (courseSnap.data() as Course) : null;
    const isCategoryMode = courseData?.gradingMode === 'category';
    if (!isCategoryMode) {
      const all = await listAssignments(currentAssignment.courseId);
      const totalExcluding = all
        .filter(a => a.id !== assignmentId)
        .reduce((sum, a) => sum + Number(a.weight || 0), 0);
      const nextTotal = totalExcluding + Number(updates.weight || 0);
      if (nextTotal > 100 + 1e-6) {
        throw new Error(`Total course weight would be ${nextTotal.toFixed(1)}%, which exceeds 100%. Reduce this assignment's weight or adjust others.`);
      }
    }
  }

  // Update the assignment
  const assignmentRef = doc(db, "assignments", assignmentId);
  await updateDoc(assignmentRef, {
    ...updates,
    updatedAt: Date.now()
  });
}

export async function getAssignmentsDueForUser(userId: string): Promise<Array<Assignment & { id: string }>> {
  try {
    // Resolve to Firestore profile id for enrollment queries
    const identity = await resolveUserIdentity(userId);
    const profileId = identity?.profileId ?? userId;
    // First get the user's enrollments
    const { listEnrollmentsForStudent } = await import('./enrollments');
    const enrollments = await listEnrollmentsForStudent(profileId);
    
    if (enrollments.length === 0) {
      return [];
    }

    // Get all assignments for enrolled courses
    const enrolledCourseIds = enrollments.map(e => e.courseId);
    const allAssignments: Array<Assignment & { id: string }> = [];
    
    for (const courseId of enrolledCourseIds) {
      try {
        const courseAssignments = await listAssignments(courseId);
        allAssignments.push(...courseAssignments);
      } catch (error) {
        console.error(`Error fetching assignments for course ${courseId}:`, error);
      }
    }

    // Filter assignments that are due in the future (not overdue)
    const now = Date.now();
    const dueAssignments = allAssignments.filter(assignment => assignment.dueAt > now);

    // Sort by due date (earliest first)
    dueAssignments.sort((a, b) => a.dueAt - b.dueAt);

    return dueAssignments;
  } catch (error) {
    console.error('Error getting assignments due for user:', error);
    return [];
  }
}

export async function getOverdueAssignmentsForUser(userId: string): Promise<Array<Assignment & { id: string }>> {
  try {
    // Resolve to Firestore profile id for enrollment queries
    const identity = await resolveUserIdentity(userId);
    const profileId = identity?.profileId ?? userId;
    // First get the user's enrollments
    const { listEnrollmentsForStudent } = await import('./enrollments');
    const enrollments = await listEnrollmentsForStudent(profileId);
    
    if (enrollments.length === 0) {
      return [];
    }

    // Get all assignments for enrolled courses
    const enrolledCourseIds = enrollments.map(e => e.courseId);
    const allAssignments: Array<Assignment & { id: string }> = [];
    
    for (const courseId of enrolledCourseIds) {
      try {
        const courseAssignments = await listAssignments(courseId);
        allAssignments.push(...courseAssignments);
      } catch (error) {
        console.error(`Error fetching assignments for course ${courseId}:`, error);
      }
    }

    // Filter assignments that are overdue
    const now = Date.now();
    const overdueAssignments = allAssignments.filter(assignment => assignment.dueAt < now);

    // Sort by due date (most overdue first)
    overdueAssignments.sort((a, b) => b.dueAt - a.dueAt);

    return overdueAssignments;
  } catch (error) {
    console.error('Error getting overdue assignments for user:', error);
    return [];
  }
}

export async function calculateOverallGradeForUser(userId: string): Promise<number> {
  try {
    // Resolve identity: use profile id for enrollments, uid for submissions
    const identity = await resolveUserIdentity(userId);
    const profileId = identity?.profileId ?? userId;
    const uid = identity?.uid ?? userId;
    // First get the user's enrollments
    const { listEnrollmentsForStudent } = await import('./enrollments');
    const enrollments = await listEnrollmentsForStudent(profileId);
    
    if (enrollments.length === 0) {
      return 0;
    }

    // Get all assignments for enrolled courses
    const enrolledCourseIds = enrollments.map(e => e.courseId);
    const allAssignments: Array<Assignment & { id: string }> = [];
    
    for (const courseId of enrolledCourseIds) {
      try {
        const courseAssignments = await listAssignments(courseId);
        allAssignments.push(...courseAssignments);
      } catch (error) {
        console.error(`Error fetching assignments for course ${courseId}:`, error);
      }
    }

    if (allAssignments.length === 0) {
      return 0;
    }

    // Get submissions for all assignments
    const { listSubmissions } = await import('./submissions');
    let totalWeightedGrade = 0;
    let totalWeight = 0;

    for (const assignment of allAssignments) {
      try {
        const submissions = await listSubmissions(assignment.id!);
        // Submissions historically stored Auth UID; some data may use profile id. Match either.
        const studentSubmission = submissions.find(s => s.studentId === uid || s.studentId === profileId);
        
        if (studentSubmission && studentSubmission.grade.points !== null && studentSubmission.grade.points !== undefined) {
          const gradePercentage = (studentSubmission.grade.points / assignment.maxPoints) * 100;
          totalWeightedGrade += (gradePercentage * assignment.weight);
          totalWeight += assignment.weight;
        }
      } catch (error) {
        console.error(`Error fetching submissions for assignment ${assignment.id}:`, error);
      }
    }

    if (totalWeight === 0) {
      return 0;
    }

    return Math.round((totalWeightedGrade / totalWeight) * 100) / 100;
  } catch (error) {
    console.error('Error calculating overall grade for user:', error);
    return 0;
  }
}

export async function calculateAttendanceForUser(userId: string): Promise<number> {
  try {
    // Resolve to profile id for enrollments and attendance records
    const identity = await resolveUserIdentity(userId);
    const profileId = identity?.profileId ?? userId;
    // First get the user's enrollments
    const { listEnrollmentsForStudent } = await import('./enrollments');
    const enrollments = await listEnrollmentsForStudent(profileId);
    
    if (enrollments.length === 0) {
      return 0;
    }

    // Get all class sessions for enrolled courses
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const { db } = await import('../firebase');
    
    const enrolledCourseIds = enrollments.map(e => e.courseId);
    const relevantSessions: Array<{id: string, courseId: string}> = [];
    
    for (const courseId of enrolledCourseIds) {
      try {
        const sessionsQuery = query(
          collection(db, "classSessions"),
          where("courseId", "==", courseId)
        );
        const sessionsSnapshot = await getDocs(sessionsQuery);
        sessionsSnapshot.forEach(doc => {
          relevantSessions.push({ id: doc.id, courseId: doc.data().courseId });
        });
      } catch (error) {
        console.error(`Error fetching class sessions for course ${courseId}:`, error);
      }
    }

    if (relevantSessions.length === 0) {
      return 100; // No sessions means perfect attendance
    }

    // Get attendance records for the user
    
    let totalSessions = 0;
    let attendedSessions = 0;

    for (const session of relevantSessions) {
      try {
        const attendanceQuery = query(
          collection(db, "attendance"),
          where("sessionId", "==", session.id),
          where("studentId", "==", profileId)
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);
        
        if (!attendanceSnapshot.empty) {
          const attendanceRecord = attendanceSnapshot.docs[0].data();
          totalSessions++;
          
          if (attendanceRecord.status === 'present' || attendanceRecord.status === 'late') {
            attendedSessions++;
          }
        }
      } catch (error) {
        console.error(`Error fetching attendance for session ${session.id}:`, error);
      }
    }

    if (totalSessions === 0) {
      return 100;
    }

    return Math.round((attendedSessions / totalSessions) * 100);
  } catch (error) {
    console.error('Error calculating attendance for user:', error);
    return 0;
  }
}


