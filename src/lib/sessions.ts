import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp,
  writeBatch,
  type UpdateData
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Session {
  id?: string;
  name: string; // 'Spring', 'Summer', 'Fall'
  year: number;
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  isActive: boolean;
  isCurrent: boolean;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  description?: string;
  registrationDeadline?: Timestamp | Date;
  withdrawalDeadline?: Timestamp | Date;
}

export interface CreateSessionInput {
  name: string;
  year: number;
  startDate: Date;
  endDate: Date;
  description?: string;
  registrationDeadline?: Date;
  withdrawalDeadline?: Date;
  isCurrent?: boolean;
}

const SESSIONS_COLLECTION = 'sessions';

// Get current session based on current date
export function getCurrentSession(sessions: Session[]): Session | null {
  const now = new Date();
  
  // First, check if there's a manually set current session
  const manuallySetCurrent = sessions.find(session => session.isCurrent === true);
  if (manuallySetCurrent) {
    return manuallySetCurrent;
  }
  
  // If no manually set current session, use date-based logic
  return sessions.find(session => {
    const startDate = session.startDate instanceof Date 
      ? session.startDate 
      : session.startDate.toDate();
    const endDate = session.endDate instanceof Date 
      ? session.endDate 
      : session.endDate.toDate();
    
    return now >= startDate && now <= endDate;
  }) || null;
}

// Get next session
export function getNextSession(sessions: Session[]): Session | null {
  const now = new Date();
  const futureSessions = sessions
    .filter(session => {
      const startDate = session.startDate instanceof Date 
        ? session.startDate 
        : session.startDate.toDate();
      return startDate > now;
    })
    .sort((a, b) => {
      const aStart = a.startDate instanceof Date 
        ? a.startDate 
        : a.startDate.toDate();
      const bStart = b.startDate instanceof Date 
        ? b.startDate 
        : b.startDate.toDate();
      return aStart.getTime() - bStart.getTime();
    });
  
  return futureSessions.length > 0 ? futureSessions[0] : null;
}

// Get all sessions
export async function getAllSessions(): Promise<Session[]> {
  try {
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const q = query(sessionsRef, orderBy('startDate', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const sessions = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate || Timestamp.now(),
        endDate: data.endDate || Timestamp.now(),
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
      } as Session;
    });
    
    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}

// Get current session from database
export async function getCurrentSessionFromDB(): Promise<Session | null> {
  try {
    const sessions = await getAllSessions();
    
    // First, check if there's a manually set current session
    const manuallySetCurrent = sessions.find(session => session.isCurrent === true);
    if (manuallySetCurrent) {
      return manuallySetCurrent;
    }
    
    // If no manually set current session, fall back to date-based logic
    return getCurrentSession(sessions);
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
}

// Get session by ID
export async function getSessionById(sessionId: string): Promise<Session | null> {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      return {
        id: sessionSnap.id,
        ...sessionSnap.data()
      } as Session;
    }
    return null;
  } catch (error) {
    console.error('Error fetching session:', error);
    return null;
  }
}

// Create new session
export async function createSession(sessionData: CreateSessionInput): Promise<Session> {
  try {
    // Validate input data
    if (!sessionData.name) {
      throw new Error('Session name is required');
    }
    if (!sessionData.year) {
      throw new Error('Year is required');
    }
    if (!sessionData.startDate || !sessionData.endDate) {
      throw new Error('Start and end dates are required');
    }
    if (sessionData.startDate >= sessionData.endDate) {
      throw new Error('Start date must be before end date');
    }
    
    // Check if session already exists for this name and year
    const existingSessions = await getAllSessions();
    const existingSession = existingSessions.find(
      s => s.name === sessionData.name && s.year === sessionData.year
    );
    
    if (existingSession) {
      throw new Error(`Session ${sessionData.name} ${sessionData.year} already exists`);
    }
    
    // Create session document
    const sessionDataToSave: Omit<Session, 'id'> = {
      name: sessionData.name,
      year: sessionData.year,
      startDate: Timestamp.fromDate(sessionData.startDate),
      endDate: Timestamp.fromDate(sessionData.endDate),
      isActive: true,
      isCurrent: sessionData.isCurrent || false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // Only add optional fields if they have values
    if (sessionData.description) {
      sessionDataToSave.description = sessionData.description;
    }
    if (sessionData.registrationDeadline) {
      sessionDataToSave.registrationDeadline = Timestamp.fromDate(sessionData.registrationDeadline);
    }
    if (sessionData.withdrawalDeadline) {
      sessionDataToSave.withdrawalDeadline = Timestamp.fromDate(sessionData.withdrawalDeadline);
    }
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionDataToSave);
    
    const newSession = {
      id: docRef.id,
      ...sessionDataToSave
    };
    
    // Update current session status
    await updateCurrentSessionStatus();
    
    return newSession;
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Failed to create session: ' + (error as Error).message);
  }
}

// Set session as current (only one can be current at a time)
export async function setSessionAsCurrent(sessionId: string): Promise<void> {
  try {
    // First, set all sessions to not current
    const allSessions = await getAllSessions();
    const batch = writeBatch(db);
    
    allSessions.forEach(session => {
      if (session.id) {
        const sessionRef = doc(db, SESSIONS_COLLECTION, session.id);
        batch.update(sessionRef, { 
          isCurrent: false,
          updatedAt: Timestamp.now()
        });
      }
    });
    
    // Then set the selected session as current
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    batch.update(sessionRef, { 
      isCurrent: true,
      updatedAt: Timestamp.now()
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error setting session as current:', error);
    throw new Error('Failed to set session as current');
  }
}

// Update session
export async function updateSession(sessionId: string, updates: Partial<Session>): Promise<void> {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    
    // Filter out undefined values
    const cleanUpdates: UpdateData<Session> = {
      updatedAt: Timestamp.now()
    };
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'startDate' || key === 'endDate' || key === 'registrationDeadline' || key === 'withdrawalDeadline') {
          (cleanUpdates as Record<string, unknown>)[key] = Timestamp.fromDate(value as Date);
        } else {
          (cleanUpdates as Record<string, unknown>)[key] = value;
        }
      }
    });
    
    // If setting as current, ensure only one session is current
    if (cleanUpdates.isCurrent === true) {
      await setSessionAsCurrent(sessionId);
      return; // Exit early since setSessionAsCurrent handles the update
    }
    
    await updateDoc(sessionRef, cleanUpdates);
    
    // Update current session status after any changes
    await updateCurrentSessionStatus();
  } catch (error) {
    console.error('Error updating session:', error);
    throw new Error('Failed to update session');
  }
}

// Delete session
export async function deleteSession(sessionId: string): Promise<void> {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await deleteDoc(sessionRef);
    
    // Update current session status after deletion
    await updateCurrentSessionStatus();
  } catch (error) {
    console.error('Error deleting session:', error);
    throw new Error('Failed to delete session');
  }
}

// Update current session status for all sessions
export async function updateCurrentSessionStatus(): Promise<void> {
  try {
    const sessions = await getAllSessions();
    const currentSession = getCurrentSession(sessions);
    
    const batch = writeBatch(db);
    
    sessions.forEach(session => {
      if (session.id) {
        const sessionRef = doc(db, SESSIONS_COLLECTION, session.id);
        const isCurrent = currentSession?.id === session.id;
        
        batch.update(sessionRef, {
          isCurrent,
          updatedAt: Timestamp.now()
        });
      }
    });
    
    await batch.commit();
  } catch (error) {
    console.error('Error updating current session status:', error);
  }
}

// Get session display name
export function getSessionDisplayName(session: Session): string {
  return `${session.name} ${session.year}`;
}

// Get session status
export function getSessionStatus(session: Session): 'current' | 'upcoming' | 'past' {
  const now = new Date();
  const startDate = session.startDate instanceof Date 
    ? session.startDate 
    : session.startDate.toDate();
  const endDate = session.endDate instanceof Date 
    ? session.endDate 
    : session.endDate.toDate();
  
  if (now >= startDate && now <= endDate) {
    return 'current';
  } else if (now < startDate) {
    return 'upcoming';
  } else {
    return 'past';
  }
}

// Get session progress percentage
export function getSessionProgress(session: Session): number {
  const now = new Date();
  const startDate = session.startDate instanceof Date 
    ? session.startDate 
    : session.startDate.toDate();
  const endDate = session.endDate instanceof Date 
    ? session.endDate 
    : session.endDate.toDate();
  
  if (now < startDate) return 0;
  if (now > endDate) return 100;
  
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();
  
  return Math.round((elapsed / totalDuration) * 100);
}

// Initialize default sessions for current year
export async function initializeDefaultSessions(year: number = new Date().getFullYear()): Promise<void> {
  try {
    const existingSessions = await getAllSessions();
    const yearSessions = existingSessions.filter(s => s.year === year);
    
    if (yearSessions.length > 0) {
      console.log(`Sessions for ${year} already exist`);
      return;
    }
    
    const sessions = [
      {
        name: 'Spring',
        startDate: new Date(year, 0, 15), // January 15
        endDate: new Date(year, 4, 15),   // May 15
        description: 'Spring semester session'
      },
      {
        name: 'Summer',
        startDate: new Date(year, 5, 1),  // June 1
        endDate: new Date(year, 7, 15),   // August 15
        description: 'Summer session'
      },
      {
        name: 'Fall',
        startDate: new Date(year, 8, 1),  // September 1
        endDate: new Date(year, 11, 20),  // December 20
        description: 'Fall semester session'
      }
    ];
    
    for (const sessionData of sessions) {
      await createSession({
        ...sessionData,
        year
      });
    }
    
    console.log(`Initialized default sessions for ${year}`);
  } catch (error) {
    console.error('Error initializing default sessions:', error);
  }
}
