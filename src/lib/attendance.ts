import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
  type QueryConstraint
} from 'firebase/firestore';
import { auth } from '../firebase';
import { db } from '../firebase';
import type { AttendanceRecord } from '../types';

const ATTENDANCE_COLLECTION = 'attendance';

// Create attendance record for a course on a specific date
export async function createAttendanceRecord(
  courseId: string,
  studentId: string,
  date: string, // YYYY-MM-DD format
  status: AttendanceRecord['status'],
  notes?: string
): Promise<AttendanceRecord> {
  try {
    // Validate inputs
    if (!courseId) {
      throw new Error('Course ID is required');
    }
    if (!studentId) {
      throw new Error('Student ID is required');
    }
    if (!date) {
      throw new Error('Date is required');
    }
    if (!status) {
      throw new Error('Attendance status is required');
    }

    console.log('Creating attendance record:', { courseId, studentId, date, status, notes });

    // Check if record already exists for this course, student, and date
    const existingRecords = await getAttendanceRecordsForCourseDate(courseId, date);
    const existingRecord = existingRecords.find(r => r.studentId === studentId);

    if (existingRecord) {
      console.log('Updating existing attendance record');
      // Update existing record
      await updateDoc(doc(db, ATTENDANCE_COLLECTION, existingRecord.id!), {
        status,
        notes: notes || undefined,
        timestamp: Timestamp.now(),
        markedBy: auth.currentUser?.uid
      });
      return {
        ...existingRecord,
        status,
        notes,
        timestamp: Date.now(),
        markedBy: auth.currentUser?.uid
      };
    }

    // Create new record
    const attendanceData = {
      courseId,
      studentId,
      date,
      status,
      notes: notes || undefined,
      timestamp: Timestamp.now(),
      markedBy: auth.currentUser?.uid
    };

    console.log('Creating new attendance record:', attendanceData);
    const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), attendanceData);

    console.log('Attendance record created successfully:', docRef.id);
    return {
      id: docRef.id,
      ...attendanceData,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error creating attendance record:', error);
    throw new Error(`Failed to create attendance record: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get attendance records for a course on a specific date
export async function getAttendanceRecordsForCourseDate(courseId: string, date: string): Promise<AttendanceRecord[]> {
  try {
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('courseId', '==', courseId),
      where('date', '==', date),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const records: AttendanceRecord[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        courseId: data.courseId,
        studentId: data.studentId,
        date: data.date,
        status: data.status,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : data.timestamp,
        notes: data.notes,
        markedBy: data.markedBy
      } as AttendanceRecord);
    });

    return records;
  } catch (error) {
    console.error('Error fetching attendance records for course date:', error);
    return [];
  }
}

// Get all attendance records for a course
export async function getCourseAttendanceRecords(courseId: string): Promise<AttendanceRecord[]> {
  try {
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('courseId', '==', courseId),
      orderBy('date', 'desc'),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const records: AttendanceRecord[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        courseId: data.courseId,
        studentId: data.studentId,
        date: data.date,
        status: data.status,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : data.timestamp,
        notes: data.notes,
        markedBy: data.markedBy
      } as AttendanceRecord);
    });

    return records;
  } catch (error) {
    console.error('Error fetching course attendance records:', error);
    return [];
  }
}

// Get attendance records for a specific student in a course
export async function getStudentCourseAttendanceRecords(studentId: string, courseId: string): Promise<AttendanceRecord[]> {
  try {
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('studentId', '==', studentId),
      where('courseId', '==', courseId),
      orderBy('date', 'desc'),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const records: AttendanceRecord[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        courseId: data.courseId,
        studentId: data.studentId,
        date: data.date,
        status: data.status,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : data.timestamp,
        notes: data.notes,
        markedBy: data.markedBy
      } as AttendanceRecord);
    });

    return records;
  } catch (error) {
    console.error('Error fetching student course attendance records:', error);
    return [];
  }
}

// Get all attendance records for a student
export async function getStudentAttendanceRecords(studentId: string): Promise<AttendanceRecord[]> {
  try {
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('studentId', '==', studentId),
      orderBy('date', 'desc'),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const records: AttendanceRecord[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        courseId: data.courseId,
        studentId: data.studentId,
        date: data.date,
        status: data.status,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : data.timestamp,
        notes: data.notes,
        markedBy: data.markedBy
      } as AttendanceRecord);
    });

    return records;
  } catch (error) {
    console.error('Error fetching student attendance records:', error);
    return [];
  }
}

// Get attendance record by ID
export async function getAttendanceRecordById(recordId: string): Promise<AttendanceRecord | null> {
  try {
    const docRef = doc(db, ATTENDANCE_COLLECTION, recordId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : data.timestamp
      } as AttendanceRecord;
    }

    return null;
  } catch (error) {
    console.error('Error fetching attendance record:', error);
    return null;
  }
}

// Update attendance record
export async function updateAttendanceRecord(
  recordId: string,
  updates: Partial<Pick<AttendanceRecord, 'status' | 'notes'>>
): Promise<void> {
  try {
    const updateData: any = {
      ...updates,
      timestamp: Timestamp.now()
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if ((updateData as Record<string, unknown>)[key] === undefined) {
        delete (updateData as Record<string, unknown>)[key];
      }
    });

    await updateDoc(doc(db, ATTENDANCE_COLLECTION, recordId), updateData);
  } catch (error) {
    console.error('Error updating attendance record:', error);
    throw new Error('Failed to update attendance record');
  }
}

// Delete attendance record
export async function deleteAttendanceRecord(recordId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ATTENDANCE_COLLECTION, recordId));
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    throw new Error('Failed to delete attendance record');
  }
}

// Bulk create attendance records for a course on a specific date
export async function bulkCreateAttendanceRecords(
  courseId: string,
  date: string,
  studentIds: string[],
  defaultStatus: AttendanceRecord['status'] = 'present'
): Promise<AttendanceRecord[]> {
  try {
    const batch = writeBatch(db);
    const createdRecords: AttendanceRecord[] = [];
    const now = Timestamp.now();

    for (const studentId of studentIds) {
      const docRef = doc(collection(db, ATTENDANCE_COLLECTION));
      const attendanceData = {
        courseId,
        studentId,
        date,
        status: defaultStatus,
        notes: undefined,
        timestamp: now,
        markedBy: auth.currentUser?.uid
      };

      batch.set(docRef, attendanceData);
      createdRecords.push({
        id: docRef.id,
        ...attendanceData,
        timestamp: Date.now()
      });
    }

    await batch.commit();
    return createdRecords;
  } catch (error) {
    console.error('Error bulk creating attendance records:', error);
    throw new Error('Failed to bulk create attendance records');
  }
}

// Get attendance statistics for a course on a specific date
export async function getCourseDateAttendanceStats(courseId: string, date: string): Promise<{
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
}> {
  try {
    const records = await getAttendanceRecordsForCourseDate(courseId, date);

    return {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      excused: records.filter(r => r.status === 'excused').length
    };
  } catch (error) {
    console.error('Error getting course date attendance stats:', error);
    return { total: 0, present: 0, absent: 0, late: 0, excused: 0 };
  }
}

// Get attendance statistics for a course (all dates)
export async function getCourseAttendanceStats(courseId: string): Promise<{
  totalRecords: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendanceRate: number;
}> {
  try {
    const records = await getCourseAttendanceRecords(courseId);

    const stats = {
      totalRecords: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      excused: records.filter(r => r.status === 'excused').length,
      attendanceRate: 0
    };

    if (stats.totalRecords > 0) {
      stats.attendanceRate = Math.round(((stats.present + stats.late) / stats.totalRecords) * 100);
    }

    return stats;
  } catch (error) {
    console.error('Error getting course attendance stats:', error);
    return { totalRecords: 0, present: 0, absent: 0, late: 0, excused: 0, attendanceRate: 0 };
  }
}

// Get student's attendance for a specific course
export async function getStudentCourseAttendanceHistory(studentId: string, courseId: string): Promise<Array<{
  date: string;
  status: AttendanceRecord['status'];
  timestamp: number;
  notes?: string;
}>> {
  try {
    const records = await getStudentCourseAttendanceRecords(studentId, courseId);
    return records.map(record => ({
      date: record.date,
      status: record.status,
      timestamp: record.timestamp,
      notes: record.notes
    }));
  } catch (error) {
    console.error('Error getting student course attendance history:', error);
    return [];
  }
}

// Calculate attendance percentage for a student in a course
export async function calculateStudentCourseAttendancePercentage(studentId: string, courseId: string): Promise<number> {
  try {
    const records = await getStudentCourseAttendanceRecords(studentId, courseId);

    if (records.length === 0) return 100;

    const presentCount = records.filter(record =>
      record.status === 'present' || record.status === 'late'
    ).length;

    return Math.round((presentCount / records.length) * 100);
  } catch (error) {
    console.error('Error calculating student course attendance percentage:', error);
    return 0;
  }
}

// Get attendance calendar data for a course
export async function getCourseAttendanceCalendar(courseId: string): Promise<{ [dateString: string]: { status: AttendanceRecord['status']; count?: number } }> {
  try {
    const records = await getCourseAttendanceRecords(courseId);
    const calendarData: { [dateString: string]: { status: AttendanceRecord['status']; count?: number } } = {};

    // Group records by date and mark dates where attendance was taken
    records.forEach(record => {
      if (!calendarData[record.date]) {
        calendarData[record.date] = { status: 'present', count: 0 };
      }

      // Mark that attendance was taken on this date
      calendarData[record.date].count = (calendarData[record.date].count || 0) + 1;
    });

    return calendarData;
  } catch (error) {
    console.error('Error getting course attendance calendar:', error);
    return {};
  }
}

// Get simple attendance calendar data (just dates where attendance was taken)
export async function getCourseAttendanceDates(courseId: string): Promise<{ [dateString: string]: boolean }> {
  try {
    const records = await getCourseAttendanceRecords(courseId);
    const attendanceDates: { [dateString: string]: boolean } = {};

    // Mark each date where attendance was recorded
    records.forEach(record => {
      attendanceDates[record.date] = true;
    });

    return attendanceDates;
  } catch (error) {
    console.error('Error getting course attendance dates:', error);
    return {};
  }
}

// Get attendance calendar data for a student in a course
export async function getStudentCourseAttendanceCalendar(studentId: string, courseId: string): Promise<{ [dateString: string]: AttendanceRecord['status'] }> {
  try {
    const records = await getStudentCourseAttendanceRecords(studentId, courseId);
    const calendarData: { [dateString: string]: AttendanceRecord['status'] } = {};

    records.forEach(record => {
      calendarData[record.date] = record.status;
    });

    return calendarData;
  } catch (error) {
    console.error('Error getting student course attendance calendar:', error);
    return {};
  }
}

// Check if attendance has been taken for a course on a specific date
export async function hasAttendanceBeenTakenForCourseDate(courseId: string, date: string): Promise<boolean> {
  try {
    const records = await getAttendanceRecordsForCourseDate(courseId, date);
    return records.length > 0;
  } catch (error) {
    console.error('Error checking if attendance has been taken:', error);
    return false;
  }
}

// Get attendance status for a specific student in a course on a date
export async function getStudentCourseDateAttendance(
  courseId: string,
  studentId: string,
  date: string
): Promise<AttendanceRecord | null> {
  try {
    const records = await getAttendanceRecordsForCourseDate(courseId, date);
    return records.find(r => r.studentId === studentId) || null;
  } catch (error) {
    console.error('Error getting student course date attendance:', error);
    return null;
  }
}

// Helper function to format date for storage (YYYY-MM-DD)
export function formatDateForStorage(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper function to parse date from storage
export function parseDateFromStorage(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}
