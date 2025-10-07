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
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { db, auth } from '../firebase';
import type { Role, MDYear } from '../types';

export interface UserProfile {
  id?: string;
  uid?: string; // Firebase Auth UID
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  
  // Student specific fields
  mdYear?: 'MD-1' | 'MD-2' | 'MD-3' | 'MD-4' | 'MD-5' | 'MD-6' | 'MD-7' | 'MD-8' | 'MD-9' | 'MD-10' | 'MD-11';
  studentId?: string;
  gpa?: number;
  enrollmentDate?: Timestamp | Date;
  
  // Teacher specific fields
  department?: string;
  specialization?: string;
  employeeId?: string;
  hireDate?: Timestamp | Date;
  
  // Admin specific fields
  adminLevel?: 'super' | 'regular';
  permissions?: string[];
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'student' | 'teacher' | 'admin';

  // Student specific
  mdYear?: 'MD-1' | 'MD-2' | 'MD-3' | 'MD-4' | 'MD-5' | 'MD-6' | 'MD-7' | 'MD-8' | 'MD-9' | 'MD-10' | 'MD-11';
  studentId?: string;
  gpa?: number;
  enrollmentDate?: Timestamp | Date;

  // Teacher specific
  department?: string;
  specialization?: string;
  employeeId?: string;
  hireDate?: Timestamp | Date;

  // Admin specific
  adminLevel?: 'super' | 'regular';
  permissions?: string[];
}

const USERS_COLLECTION = 'users';

// Get all users
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);

    // First try with orderBy, if it fails, try without
    let querySnapshot;
    try {
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      querySnapshot = await getDocs(q);
    } catch (orderByError) {
      console.warn('OrderBy failed, trying without ordering:', orderByError);
      querySnapshot = await getDocs(usersRef);
    }

    const users = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid, // Explicitly include uid from document data
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role || 'student',
        status: data.status || 'active',
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
        // Include optional fields
        mdYear: data.mdYear,
        studentId: data.studentId,
        gpa: data.gpa,
        enrollmentDate: data.enrollmentDate,
        department: data.department,
        specialization: data.specialization,
        employeeId: data.employeeId,
        hireDate: data.hireDate,
        adminLevel: data.adminLevel,
        permissions: data.permissions,
      } as UserProfile;
    });

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return empty array instead of throwing to prevent app crash
    return [];
  }
}

// Get users by role
export async function getUsersByRole(role: 'student' | 'teacher' | 'admin'): Promise<UserProfile[]> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    
    // First try with orderBy, if it fails, try without
    let querySnapshot;
    try {
      const q = query(
        usersRef, 
        where('role', '==', role),
        orderBy('createdAt', 'desc')
      );
      querySnapshot = await getDocs(q);
    } catch (orderByError) {
      console.warn(`OrderBy failed for ${role}s, trying without ordering:`, orderByError);
      const q = query(usersRef, where('role', '==', role));
      querySnapshot = await getDocs(q);
    }
    
    const users = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure all required fields have defaults
        role: data.role || 'student',
        status: data.status || 'active',
        createdAt: data.createdAt || Timestamp.now(),
        updatedAt: data.updatedAt || Timestamp.now(),
      } as UserProfile;
    });
    
    return users;
  } catch (error) {
    console.error(`Error fetching ${role}s:`, error);
    throw new Error(`Failed to fetch ${role}s`);
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return {
        id: userSnap.id,
        ...userSnap.data()
      } as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}

// Get user by Firebase Auth UID - Optimized with caching
const userCache = new Map<string, { data: UserProfile | null, timestamp: number }>();
const USER_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for user data

export async function getUserByUid(uid: string): Promise<UserProfile | null> {
  try {
    // Check cache first
    const cacheKey = `uid_${uid}`;
    const cached = userCache.get(cacheKey);

    if (cached && (Date.now() - cached.timestamp) < USER_CACHE_DURATION) {
      return cached.data;
    }

    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('uid', '==', uid), limit(1));
    const querySnapshot = await getDocs(q);

    let result: UserProfile | null = null;

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      result = {
        id: doc.id,
        ...doc.data()
      } as UserProfile;
    }

    // Cache the result
    userCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  } catch (error) {
    console.error('Error fetching user by UID:', error);
    throw new Error('Failed to fetch user by UID');
  }
}

// Create new user (with Firebase Auth + Firestore profile)
export async function createUser(userData: CreateUserInput): Promise<UserProfile> {
  try {
    // Validate input data
    if (!userData.email) {
      throw new Error('Email is required');
    }
    if (!userData.password) {
      throw new Error('Password is required');
    }
    if (!userData.name) {
      throw new Error('Name is required');
    }
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const firebaseUser = userCredential.user;
    
    // Update Firebase Auth profile
    await updateProfile(firebaseUser, {
      displayName: userData.name
    });
    
    // Create Firestore profile
    const userProfile: Omit<UserProfile, 'id'> = {
      uid: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    // Add role-specific fields
    if (userData.role === 'student') {
      userProfile.mdYear = userData.mdYear || 'MD-1';
      userProfile.studentId = userData.studentId || generateStudentId();
      userProfile.gpa = userData.gpa || 0;
      userProfile.enrollmentDate = Timestamp.now();
    } else if (userData.role === 'teacher') {
      userProfile.department = userData.department;
      userProfile.specialization = userData.specialization;
      userProfile.employeeId = userData.employeeId || generateEmployeeId();
      userProfile.hireDate = Timestamp.now();
    } else if (userData.role === 'admin') {
      userProfile.adminLevel = userData.adminLevel || 'regular';
      userProfile.permissions = userData.permissions || ['user_management'];
    }
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, USERS_COLLECTION), userProfile);
    
    const newUser = {
      id: docRef.id,
      ...userProfile
    };
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user: ' + (error as Error).message);
  }
}

// Create new user without signing in (for admin use)
export async function createUserWithoutSignIn(userData: CreateUserInput): Promise<UserProfile> {
  try {
    // Validate input data
    if (!userData.email) {
      throw new Error('Email is required');
    }
    if (!userData.password) {
      throw new Error('Password is required');
    }
    if (!userData.name) {
      throw new Error('Name is required');
    }
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Create Firebase Auth user (this will sign in the new user)
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const firebaseUser = userCredential.user;
    
    // Update Firebase Auth profile
    await updateProfile(firebaseUser, {
      displayName: userData.name
    });
    
    // Create Firestore profile
    const userProfile: Omit<UserProfile, 'id'> = {
      uid: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      status: 'active',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    // Add role-specific fields
    if (userData.role === 'student') {
      userProfile.mdYear = userData.mdYear || 'MD-1';
      userProfile.studentId = userData.studentId || generateStudentId();
      userProfile.gpa = userData.gpa || 0;
      userProfile.enrollmentDate = Timestamp.now();
    } else if (userData.role === 'teacher') {
      userProfile.department = userData.department;
      userProfile.specialization = userData.specialization;
      userProfile.employeeId = userData.employeeId || generateEmployeeId();
      userProfile.hireDate = Timestamp.now();
    } else if (userData.role === 'admin') {
      userProfile.adminLevel = userData.adminLevel || 'regular';
      userProfile.permissions = userData.permissions || ['user_management'];
    }
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, USERS_COLLECTION), userProfile);
    
    // Sign out the newly created user immediately
    await auth.signOut();
    
    const newUser = {
      id: docRef.id,
      ...userProfile
    };
    
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user: ' + (error as Error).message);
  }
}

// Update user - Optimized with cache invalidation
export async function updateUser(userId: string, updates: Partial<UserProfile>): Promise<void> {
  try {
    console.log('🔄 Updating user:', userId, 'with updates:', updates);

    // Filter out undefined values to prevent Firestore errors
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );

    console.log('🧹 Clean updates:', cleanUpdates);

    const userRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userRef, {
      ...cleanUpdates,
      updatedAt: Timestamp.now()
    });

    // Invalidate user cache when user data changes
    const uid = updates.uid;
    if (uid) {
      userCache.delete(`uid_${uid}`);
    }

    console.log('✅ User updated successfully');
  } catch (error) {
    console.error('❌ Error updating user:', {
      userId,
      updates,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
    throw new Error('Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Delete user (Firestore profile only - Firebase Auth deletion requires admin SDK)
export async function deleteUserProfile(userId: string): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new Error('Failed to delete user profile');
  }
}

// Search users
export async function searchUsers(searchTerm: string, role?: 'student' | 'teacher' | 'admin'): Promise<UserProfile[]> {
  try {
    let q;
    const usersRef = collection(db, USERS_COLLECTION);
    
    if (role) {
      q = query(usersRef, where('role', '==', role));
    } else {
      q = query(usersRef, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as UserProfile));
    
    // Client-side filtering for search term (Firestore doesn't support full-text search)
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      return users.filter(user => 
        user.name.toLowerCase().includes(lowercaseSearch) ||
        user.email.toLowerCase().includes(lowercaseSearch) ||
        (user.studentId && user.studentId.toLowerCase().includes(lowercaseSearch)) ||
        (user.employeeId && user.employeeId.toLowerCase().includes(lowercaseSearch))
      );
    }
    
    return users;
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('Failed to search users');
  }
}

// Get user statistics
export async function getUserStats(): Promise<{
  totalUsers: number;
  students: number;
  teachers: number;
  admins: number;
  activeUsers: number;
}> {
  try {
    const users = await getAllUsers();

    const students = users.filter(u => u.role === 'student');
    const teachers = users.filter(u => u.role === 'teacher');
    const admins = users.filter(u => u.role === 'admin');
    const activeUsers = users.filter(u => u.status === 'active');

    const stats = {
      totalUsers: users.length,
      students: students.length,
      teachers: teachers.length,
      admins: admins.length,
      activeUsers: activeUsers.length,
    };

    return stats;
  } catch (error) {
    console.error('Error getting user stats:', error);
    // Return default stats instead of throwing
    const defaultStats = {
      totalUsers: 0,
      students: 0,
      teachers: 0,
      admins: 0,
      activeUsers: 0,
    };
    return defaultStats;
  }
}

// Helper functions
function generateStudentId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `JFK${year}${randomNum}`;
}

function generateEmployeeId(): string {
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `JFK-FAC-${randomNum}`;
}

// Create admin user with proper role assignment
export async function createAdminUser(userData: Omit<CreateUserInput, 'role'>): Promise<UserProfile> {
  return createUser({
    ...userData,
    role: 'admin',
    adminLevel: 'super',
    permissions: ['user_management', 'system_admin', 'user_creation']
  });
}

// Create teacher user with proper role assignment
export async function createTeacherUser(userData: Omit<CreateUserInput, 'role'>): Promise<UserProfile> {
  return createUser({
    ...userData,
    role: 'teacher',
    hireDate: Timestamp.now()
  });
}

// Create student user with proper role assignment
export async function createStudentUser(userData: Omit<CreateUserInput, 'role'>, mdYear?: MDYear): Promise<UserProfile> {
  return createUser({
    ...userData,
    role: 'student',
    mdYear: mdYear || 'MD-1',
    enrollmentDate: Timestamp.now()
  });
}

// Fix uid field for existing users who might be missing it
export async function fixUserUids(): Promise<void> {
  try {
    console.log('Fixing uid fields for existing users...');

    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await getDocs(usersRef);

    const batch = writeBatch(db);
    let updateCount = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // If uid is missing but we have an email, try to find the auth user
      if (!data.uid && data.email) {
        // For now, we'll set a placeholder uid based on email
        // In a real scenario, you'd need to match with Firebase Auth users
        const placeholderUid = `user_${doc.id}_${Date.now()}`;
        console.log(`Setting placeholder uid for user ${data.email}: ${placeholderUid}`);

        batch.update(doc.ref, {
          uid: placeholderUid,
          updatedAt: Timestamp.now()
        });
        updateCount++;
      }
    });

    if (updateCount > 0) {
      await batch.commit();
      console.log(`Updated ${updateCount} users with uid fields`);
    } else {
      console.log('All users already have uid fields');
    }
  } catch (error) {
    console.error('Error fixing user uids:', error);
    throw new Error('Failed to fix user uids');
  }
}

// Helper to ensure role consistency - syncs role data
export async function syncUserRole(uid: string, role: Role, mdYear?: MDYear): Promise<void> {
  try {
    const userProfile = await getUserByUid(uid);
    if (userProfile && userProfile.id) {
      await updateUser(userProfile.id, { role, mdYear });
      console.log('✅ User role synchronized:', uid, role);
    } else {
      console.warn('⚠️ Cannot sync role - user profile not found:', uid);
    }
  } catch (error) {
    console.error('❌ Error syncing user role:', error);
    throw new Error('Failed to sync user role');
  }
}

// Batch operations for bulk user management
export async function batchUpdateUsers(updates: { id: string; data: Partial<UserProfile> }[]): Promise<void> {
  try {
    const batch = writeBatch(db);

    updates.forEach(({ id, data }) => {
      const userRef = doc(db, USERS_COLLECTION, id);
      batch.update(userRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error batch updating users:', error);
    throw new Error('Failed to batch update users');
  }
}
