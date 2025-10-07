import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "../firebase";
import type { TimeEntry, TimeCardSession, MonthlyReport, TimeTrackingStats } from "../types";

// Re-export types for components to use
export type { TimeEntry, TimeCardSession, MonthlyReport, TimeTrackingStats };

// Collection names
const TIME_ENTRIES_COLLECTION = "timeEntries";
const TIME_SESSIONS_COLLECTION = "timeSessions";

// Utility functions
export function formatDate(date: Date): string {
  // Use local date formatting to avoid timezone conversion issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function calculateHours(clockIn: number, clockOut: number): number {
  const diffMs = clockOut - clockIn;
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100; // Round to 2 decimal places
}

// Time Entry CRUD operations
export async function createTimeEntry(entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    // Filter out undefined values to prevent Firestore errors
    const cleanEntry = Object.fromEntries(
      Object.entries({
        ...entry,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).filter(([_, value]) => value !== undefined)
    );

    const docRef = await addDoc(collection(db, TIME_ENTRIES_COLLECTION), cleanEntry);
    return docRef.id;
  } catch (error) {
    console.error("Error creating time entry:", error);
    throw error;
  }
}

export async function updateTimeEntry(id: string, updates: Partial<TimeEntry>): Promise<void> {
  try {
    const docRef = doc(db, TIME_ENTRIES_COLLECTION, id);

    // Filter out undefined values to prevent Firestore errors
    const cleanUpdates = Object.fromEntries(
      Object.entries({
        ...updates,
        updatedAt: Date.now(),
      }).filter(([_, value]) => value !== undefined)
    );

    await updateDoc(docRef, cleanUpdates);
  } catch (error) {
    console.error("Error updating time entry:", error);
    throw error;
  }
}

export async function deleteTimeEntry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, TIME_ENTRIES_COLLECTION, id));
  } catch (error) {
    console.error("Error deleting time entry:", error);
    throw error;
  }
}

export async function getTimeEntriesForUser(userId: string, startDate?: string, endDate?: string): Promise<TimeEntry[]> {
  try {
    let q = query(
      collection(db, TIME_ENTRIES_COLLECTION),
      where("userId", "==", userId),
      orderBy("date", "desc"),
      orderBy("clockIn", "desc")
    );

    if (startDate && endDate) {
      q = query(q, where("date", ">=", startDate), where("date", "<=", endDate));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as TimeEntry[];
  } catch (error: any) {
    // Handle index building error gracefully
    if (error.message && error.message.includes("index is currently building")) {
      console.warn("Firebase index is still building. Using alternative query method.");
      // Fallback: Get all entries for user and sort/filter manually
      try {
        const q = query(
          collection(db, TIME_ENTRIES_COLLECTION),
          where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        let allEntries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as TimeEntry[];

        // Apply date filter if provided
        if (startDate && endDate) {
          allEntries = allEntries.filter(entry =>
            entry.date >= startDate && entry.date <= endDate
          );
        }

        // Sort manually by date desc, then clockIn desc
        return allEntries.sort((a, b) => {
          const dateCompare = b.date.localeCompare(a.date);
          if (dateCompare !== 0) return dateCompare;
          return b.clockIn - a.clockIn;
        });
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
      }
    }

    console.error("Error fetching time entries:", error);
    throw error;
  }
}

export async function getTimeEntriesForDate(userId: string, date: string): Promise<TimeEntry[]> {
  try {
    const q = query(
      collection(db, TIME_ENTRIES_COLLECTION),
      where("userId", "==", userId),
      where("date", "==", date),
      orderBy("clockIn", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as TimeEntry[];
  } catch (error: any) {
    // Handle index building error gracefully
    if (error.message && error.message.includes("index is currently building")) {
      console.warn("Firebase index is still building. Using alternative query method.");
      // Fallback: Get all entries for user and filter by date (less efficient but works)
      try {
        const q = query(
          collection(db, TIME_ENTRIES_COLLECTION),
          where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        const allEntries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as TimeEntry[];

        // Filter by date and sort manually
        return allEntries
          .filter(entry => entry.date === date)
          .sort((a, b) => a.clockIn - b.clockIn);
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
      }
    }

    console.error("Error fetching time entries for date:", error);
    throw error;
  }
}

// Session management
export async function startTimeSession(userId: string): Promise<string> {
  try {
    // Check if there's already an active session and clean it up
    const activeSession = await getActiveSession(userId);
    if (activeSession) {
      console.log("Cleaning up existing active session:", activeSession.id);
      // Mark the existing session as inactive (don't throw error)
      await updateDoc(doc(db, TIME_SESSIONS_COLLECTION, activeSession.id!), {
        isActive: false,
        endTime: Date.now(),
        totalHours: calculateHours(activeSession.startTime, Date.now())
      }).catch(err => console.warn("Could not update existing session:", err));
    }

    const now = Date.now();
    const session: Omit<TimeCardSession, 'id'> = {
      userId,
      startTime: now,
      isActive: true,
    };

    const docRef = await addDoc(collection(db, TIME_SESSIONS_COLLECTION), session);
    return docRef.id;
  } catch (error) {
    console.error("Error starting time session:", error);
    throw error;
  }
}

export async function stopTimeSession(userId: string): Promise<TimeEntry> {
  try {
    const activeSession = await getActiveSession(userId);
    if (!activeSession) {
      throw new Error("No active time session found");
    }

    const now = Date.now();
    const totalHours = calculateHours(activeSession.startTime, now);

    // Update session
    await updateDoc(doc(db, TIME_SESSIONS_COLLECTION, activeSession.id!), {
      endTime: now,
      isActive: false,
      totalHours,
    });

    // Create time entry
    const date = formatDate(new Date(now));
    const timeEntry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      date,
      clockIn: activeSession.startTime,
      clockOut: now,
      totalHours,
      isManual: false,
    };

    const entryId = await createTimeEntry(timeEntry);
    return { id: entryId, ...timeEntry, createdAt: now, updatedAt: now };
  } catch (error) {
    console.error("Error stopping time session:", error);
    throw error;
  }
}

export async function getActiveSession(userId: string): Promise<TimeCardSession | null> {
  try {
    const q = query(
      collection(db, TIME_SESSIONS_COLLECTION),
      where("userId", "==", userId),
      where("isActive", "==", true)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as TimeCardSession;
    }
    return null;
  } catch (error) {
    console.error("Error fetching active session:", error);
    throw error;
  }
}

// Manual entry
export async function createManualTimeEntry(
  userId: string,
  date: string,
  clockInTime: string,
  clockOutTime: string,
  notes?: string
): Promise<TimeEntry> {
  try {
    const clockIn = new Date(`${date}T${clockInTime}`).getTime();
    const clockOut = new Date(`${date}T${clockOutTime}`).getTime();

    if (clockOut <= clockIn) {
      throw new Error("Clock out time must be after clock in time");
    }

    const totalHours = calculateHours(clockIn, clockOut);

    const timeEntry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'> = {
      userId,
      date,
      clockIn,
      clockOut,
      totalHours,
      isManual: true,
      notes,
    };

    const entryId = await createTimeEntry(timeEntry);
    return { id: entryId, ...timeEntry, createdAt: Date.now(), updatedAt: Date.now() };
  } catch (error) {
    console.error("Error creating manual time entry:", error);
    throw error;
  }
}

// Statistics and reports
export async function getTimeTrackingStats(userId: string): Promise<TimeTrackingStats> {
  try {
    const now = new Date();
    const today = formatDate(now);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Calculate start of current month instead of 30 days ago
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayEntries, weekEntries, monthEntries, activeSession] = await Promise.all([
      getTimeEntriesForDate(userId, today),
      getTimeEntriesForUser(userId, formatDate(weekAgo), today),
      getTimeEntriesForUser(userId, formatDate(startOfMonth), today),
      getActiveSession(userId)
    ]);

    const todayHours = todayEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
    const weekHours = weekEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
    const monthHours = monthEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);

    // Count unique days in the month for average calculation
    const uniqueDays = new Set(monthEntries.map(entry => entry.date)).size;
    const averageDailyHours = uniqueDays > 0 ? monthHours / uniqueDays : 0;

    return {
      todayHours: Math.round(todayHours * 100) / 100,
      weekHours: Math.round(weekHours * 100) / 100,
      monthHours: Math.round(monthHours * 100) / 100,
      averageDailyHours: Math.round(averageDailyHours * 100) / 100,
      currentSession: activeSession || undefined,
    };
  } catch (error) {
    console.error("Error fetching time tracking stats:", error);
    throw error;
  }
}

export async function getMonthlyReport(userId: string, userName: string, month: string, year: number): Promise<MonthlyReport> {
  try {
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    // Calculate last day of month properly
    const lastDayOfMonth = new Date(year, parseInt(month), 0);
    const endDate = `${year}-${month.padStart(2, '0')}-${lastDayOfMonth.getDate().toString().padStart(2, '0')}`;

    const entries = await getTimeEntriesForUser(userId, startDate, endDate);
    const totalHours = entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);

    return {
      userId,
      userName,
      month,
      year,
      totalHours: Math.round(totalHours * 100) / 100,
      dailyEntries: entries,
      generatedAt: Date.now(),
    };
  } catch (error) {
    console.error("Error generating monthly report:", error);
    throw error;
  }
}

// Admin functions
export async function getAllTimeEntriesForDateRange(startDate: string, endDate: string): Promise<TimeEntry[]> {
  try {
    // Use the existing index (date, userId, clockIn) from firestore.indexes.json
    const q = query(
      collection(db, TIME_ENTRIES_COLLECTION),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "asc"),
      orderBy("userId", "asc")
    );

    const querySnapshot = await getDocs(q);

    // Sort manually to get desc order we want for display
    const entries = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as TimeEntry[];

    return entries.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.clockIn - a.clockIn;
    });
  } catch (error: any) {
    // Fallback: if compound index still fails, get all entries for date range and sort manually
    if (error.message && error.message.includes("index")) {
      console.warn("Compound index failed, using simpler query");
      try {
        const q = query(
          collection(db, TIME_ENTRIES_COLLECTION),
          where("date", ">=", startDate),
          where("date", "<=", endDate)
        );

        const querySnapshot = await getDocs(q);
        const entries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as TimeEntry[];

        // Sort manually by date desc, then clockIn desc
        return entries.sort((a, b) => {
          const dateCompare = b.date.localeCompare(a.date);
          if (dateCompare !== 0) return dateCompare;
          return b.clockIn - a.clockIn;
        });
      } catch (fallbackError) {
        console.error("Fallback query also failed:", fallbackError);
      }
    }

    console.error("Error fetching all time entries:", error);
    throw error;
  }
}

export async function updateTimeEntryAsAdmin(
  entryId: string,
  updates: Partial<TimeEntry>,
  adminId: string
): Promise<void> {
  try {
    // Filter out undefined values to prevent Firestore errors
    const cleanUpdates = Object.fromEntries(
      Object.entries({
        ...updates,
        updatedAt: Date.now(),
        updatedBy: adminId,
      }).filter(([_, value]) => value !== undefined)
    );

    await updateDoc(doc(db, TIME_ENTRIES_COLLECTION, entryId), cleanUpdates);
  } catch (error) {
    console.error("Error updating time entry as admin:", error);
    throw error;
  }
}
