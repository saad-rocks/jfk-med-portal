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
  writeBatch
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


    // Check if record already exists for this course, student, and date
    const existingRecords = await getAttendanceRecordsForCourseDate(courseId, date);
    const existingRecord = existingRecords.find(r => r.studentId === studentId);

    if (existingRecord) {

      // Update existing record - only include notes field if it has a value
      const updateData: any = {
        status,
        timestamp: Timestamp.now(),
        markedBy: auth.currentUser?.uid
      };

      // Only include notes field if it has a value (Firestore doesn't accept undefined)
      if (notes !== undefined) {
        updateData.notes = notes;
      }

      await updateDoc(doc(db, ATTENDANCE_COLLECTION, existingRecord.id!), updateData);

      return {
        ...existingRecord,
        status,
        notes,
        timestamp: Date.now(),
        markedBy: auth.currentUser?.uid
      };
    }

    // Create new record
    const attendanceData: any = {
      courseId,
      studentId,
      date,
      status,
      timestamp: Timestamp.now(),
      markedBy: auth.currentUser?.uid
    };

    // Only include notes field if it has a value (Firestore doesn't accept undefined)
    if (notes !== undefined) {
      attendanceData.notes = notes;
    }

    const docRef = await addDoc(collection(db, ATTENDANCE_COLLECTION), attendanceData);

    return {
      id: docRef.id,
      courseId,
      studentId,
      date,
      status,
      timestamp: Date.now(),
      markedBy: auth.currentUser?.uid,
      ...(notes !== undefined ? { notes } : {})
    };
  } catch (error) {
    throw new Error(`Failed to create attendance record: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Get attendance records for a course on a specific date (optimized)
export async function getAttendanceRecordsForCourseDate(courseId: string, date: string): Promise<AttendanceRecord[]> {
  try {

    // Optimized: Use a single query with courseId, limit results and filter by date in memory
    // This avoids complex composite index requirements while still being efficient
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('courseId', '==', courseId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);

    const records: AttendanceRecord[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Filter by date in memory (much faster than multiple queries)
      if (data.date === date) {
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
      }
    });

    return records;
  } catch (error) {
    return [];
  }
}

// Get all attendance records for a course
export async function getCourseAttendanceRecords(courseId: string): Promise<AttendanceRecord[]> {
  try {
    // Use simpler query that doesn't require composite index
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('courseId', '==', courseId),
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
    return [];
  }
}

// Get attendance records for a specific student in a course
export async function getStudentCourseAttendanceRecords(studentId: string, courseId: string): Promise<AttendanceRecord[]> {
  try {

    // Use simpler query that doesn't require composite index
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('studentId', '==', studentId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);

    const records: AttendanceRecord[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Filter by courseId in memory
      if (data.courseId === courseId) {

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
      }
    });

    return records;
  } catch (error) {
    return [];
  }
}

// Get all attendance records for a student
export async function getStudentAttendanceRecords(studentId: string): Promise<AttendanceRecord[]> {
  try {

    // Use simpler query that doesn't require composite index
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('studentId', '==', studentId),
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
    throw new Error('Failed to update attendance record');
  }
}

// Delete attendance record
export async function deleteAttendanceRecord(recordId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ATTENDANCE_COLLECTION, recordId));
  } catch (error) {
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
    // Check authentication
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to mark attendance');
    }


    const batch = writeBatch(db);
    const createdRecords: AttendanceRecord[] = [];
    const now = Timestamp.now();

    // Check if records already exist to avoid duplicates
    const existingRecords = await getAttendanceRecordsForCourseDate(courseId, date);
    const existingStudentIds = existingRecords.map(r => r.studentId);


    let processedCount = 0;
    for (const studentId of studentIds) {
      // Skip if record already exists
      if (existingStudentIds.includes(studentId)) {
        continue;
      }

      const docRef = doc(collection(db, ATTENDANCE_COLLECTION));
      const attendanceData: any = {
        courseId,
        studentId,
        date,
        status: defaultStatus,
        timestamp: now,
        markedBy: auth.currentUser.uid
      };

      // Notes are not used in bulk operations, so we omit the field

      batch.set(docRef, attendanceData);
      createdRecords.push({
        id: docRef.id,
        courseId,
        studentId,
        date,
        status: defaultStatus,
        timestamp: Date.now(),
        markedBy: auth.currentUser.uid
        // Notes are not included in bulk operations
      });

      processedCount++;
    }

    if (processedCount > 0) {
      await batch.commit();
    } else {
    }

    return createdRecords;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during bulk attendance creation';
    throw new Error(`Failed to bulk create attendance records: ${errorMessage}`);
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

    const stats = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      excused: records.filter(r => r.status === 'excused').length
    };

    return stats;
  } catch (error) {
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
    return {};
  }
}

// Check if attendance has been taken for a course on a specific date
export async function hasAttendanceBeenTakenForCourseDate(courseId: string, date: string): Promise<boolean> {
  try {
    const records = await getAttendanceRecordsForCourseDate(courseId, date);
    return records.length > 0;
  } catch (error) {
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
    return null;
  }
}

// Helper function to format date for storage (YYYY-MM-DD)
export function formatDateForStorage(date: Date): string {
  const formatted = date.toISOString().split('T')[0];
  return formatted;
}

// Helper function to parse date from storage
export function parseDateFromStorage(dateString: string): Date {
  return new Date(dateString + 'T00:00:00');
}

// Diagnostic function to check attendance data consistency
export async function diagnoseAttendanceData(courseId: string, date?: string): Promise<{
  totalRecords: number;
  uniqueStudentIds: string[];
  sampleRecords: AttendanceRecord[];
  issues: string[];
}> {
  try {
    const issues: string[] = [];
    const uniqueStudentIds = new Set<string>();
    const sampleRecords: AttendanceRecord[] = [];

    // Get all attendance records for the course
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('courseId', '==', courseId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      uniqueStudentIds.add(data.studentId);

      // Collect sample records
      if (sampleRecords.length < 10) {
        sampleRecords.push({
          id: doc.id,
          courseId: data.courseId,
          studentId: data.studentId,
          date: data.date,
          status: data.status,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : data.timestamp,
          notes: data.notes,
          markedBy: data.markedBy
        } as AttendanceRecord);
      }

      // Check for potential issues
      if (!data.studentId || data.studentId.trim() === '') {
        issues.push(`Empty studentId in record ${doc.id}`);
      }
      if (!data.date || !data.status) {
        issues.push(`Missing required fields in record ${doc.id}`);
      }
    });

    return {
      totalRecords: querySnapshot.size,
      uniqueStudentIds: Array.from(uniqueStudentIds),
      sampleRecords,
      issues
    };
  } catch (error) {
    return {
      totalRecords: 0,
      uniqueStudentIds: [],
      sampleRecords: [],
      issues: [`Diagnostic error: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

// Function to fix student ID mismatches in attendance records
export async function fixAttendanceStudentIds(courseId: string, idMapping: { [oldId: string]: string }): Promise<{
  updated: number;
  failed: number;
  errors: string[];
}> {
  try {

    const { auth } = await import('../firebase');
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    const batch = writeBatch(db);
    let updated = 0;
    let failed = 0;
    const errors: string[] = [];

    // Get all attendance records for the course
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('courseId', '==', courseId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const oldStudentId = data.studentId;

      // Check if this student ID needs to be updated
      if (idMapping[oldStudentId]) {
        const newStudentId = idMapping[oldStudentId];

        try {

          batch.update(doc.ref, {
            studentId: newStudentId,
            timestamp: Timestamp.now(), // Update timestamp
            markedBy: auth.currentUser?.uid // Update who made the change
          });

          updated++;
        } catch (error) {
          failed++;
          errors.push(`Failed to update record ${doc.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    });

    if (updated > 0) {
      await batch.commit();
    }

    return { updated, failed, errors };
  } catch (error) {
    return {
      updated: 0,
      failed: 1,
      errors: [`Fix operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

// Function to get attendance records that need fixing
export async function getAttendanceRecordsNeedingFix(courseId: string, correctStudentIds: string[]): Promise<{
  recordsToFix: AttendanceRecord[];
  incorrectIds: string[];
}> {
  try {

    const recordsToFix: AttendanceRecord[] = [];
    const incorrectIds = new Set<string>();

    // Get all attendance records for the course
    const q = query(
      collection(db, ATTENDANCE_COLLECTION),
      where('courseId', '==', courseId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const studentId = data.studentId;

      // If this student ID is not in the correct list, it needs fixing
      if (!correctStudentIds.includes(studentId)) {
        incorrectIds.add(studentId);

        recordsToFix.push({
          id: doc.id,
          courseId: data.courseId,
          studentId: data.studentId,
          date: data.date,
          status: data.status,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : data.timestamp,
          notes: data.notes,
          markedBy: data.markedBy
        } as AttendanceRecord);
      }
    });


    return {
      recordsToFix,
      incorrectIds: Array.from(incorrectIds)
    };
  } catch (error) {
    return {
      recordsToFix: [],
      incorrectIds: []
    };
  }
}

// Optimized bulk attendance operations
export async function quickMarkAttendanceBulk(
  courseId: string,
  date: string,
  attendanceUpdates: Array<{ studentId: string; status: AttendanceRecord['status'] }>
): Promise<{ success: number; failed: number; errors: string[] }> {
  try {

    const { auth } = await import('../firebase');
    if (!auth.currentUser) {
      throw new Error('User must be authenticated');
    }

    const batch = writeBatch(db);
    const now = Timestamp.now();
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Process each attendance update
    for (const update of attendanceUpdates) {
      try {
        const { studentId, status } = update;

        // Check if record exists
        const existingRecords = await getAttendanceRecordsForCourseDate(courseId, date);
        const existingRecord = existingRecords.find(r => r.studentId === studentId);

        if (existingRecord) {
          // Update existing record
          const updateData: any = {
            status,
            timestamp: now,
            markedBy: auth.currentUser.uid
          };

          const docRef = doc(db, ATTENDANCE_COLLECTION, existingRecord.id!);
          batch.update(docRef, updateData);
        } else {
          // Create new record
          const docRef = doc(collection(db, ATTENDANCE_COLLECTION));
          const attendanceData = {
            courseId,
            studentId,
            date,
            status,
            timestamp: now,
            markedBy: auth.currentUser.uid
          };

          batch.set(docRef, attendanceData);
        }

        successCount++;
      } catch (error) {
        failedCount++;
        errors.push(`Failed to update ${update.studentId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Commit all changes in one batch
    if (successCount > 0) {
      await batch.commit();
    }

    return { success: successCount, failed: failedCount, errors };
  } catch (error) {
    return {
      success: 0,
      failed: attendanceUpdates.length,
      errors: [`Bulk operation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

// Get attendance summary for quick display
export async function getAttendanceSummary(courseId: string, date: string): Promise<{
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  marked: boolean;
}> {
  try {
    const records = await getAttendanceRecordsForCourseDate(courseId, date);

    const summary = {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      excused: records.filter(r => r.status === 'excused').length,
      marked: records.length > 0
    };

    return summary;
  } catch (error) {
    return { total: 0, present: 0, absent: 0, late: 0, excused: 0, marked: false };
  }
}
