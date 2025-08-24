import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, writeBatch } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile, deleteUser as deleteAuthUser } from 'firebase/auth';
import { db, auth } from '../firebase';
const USERS_COLLECTION = 'users';
// Get all users
export async function getAllUsers() {
    try {
        const usersRef = collection(db, USERS_COLLECTION);
        // First try with orderBy, if it fails, try without
        let querySnapshot;
        try {
            const q = query(usersRef, orderBy('createdAt', 'desc'));
            querySnapshot = await getDocs(q);
        }
        catch (orderByError) {
            console.warn('OrderBy failed, trying without ordering:', orderByError);
            querySnapshot = await getDocs(usersRef);
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
            };
        });
        return users;
    }
    catch (error) {
        console.error('Error fetching users:', error);
        // Return empty array instead of throwing to prevent app crash
        return [];
    }
}
// Get users by role
export async function getUsersByRole(role) {
    try {
        const usersRef = collection(db, USERS_COLLECTION);
        // First try with orderBy, if it fails, try without
        let querySnapshot;
        try {
            const q = query(usersRef, where('role', '==', role), orderBy('createdAt', 'desc'));
            querySnapshot = await getDocs(q);
        }
        catch (orderByError) {
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
            };
        });
        return users;
    }
    catch (error) {
        console.error(`Error fetching ${role}s:`, error);
        throw new Error(`Failed to fetch ${role}s`);
    }
}
// Get user by ID
export async function getUserById(userId) {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return {
                id: userSnap.id,
                ...userSnap.data()
            };
        }
        return null;
    }
    catch (error) {
        console.error('Error fetching user:', error);
        throw new Error('Failed to fetch user');
    }
}
// Get user by Firebase Auth UID
export async function getUserByUid(uid) {
    try {
        const usersRef = collection(db, USERS_COLLECTION);
        const q = query(usersRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data()
            };
        }
        return null;
    }
    catch (error) {
        console.error('Error fetching user by UID:', error);
        throw new Error('Failed to fetch user by UID');
    }
}
// Create new user (with Firebase Auth + Firestore profile)
export async function createUser(userData) {
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
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const firebaseUser = userCredential.user;
        // Update Firebase Auth profile
        await updateProfile(firebaseUser, {
            displayName: userData.name
        });
        // Create Firestore profile
        const userProfile = {
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
        }
        else if (userData.role === 'teacher') {
            userProfile.department = userData.department;
            userProfile.specialization = userData.specialization;
            userProfile.employeeId = userData.employeeId || generateEmployeeId();
            userProfile.hireDate = Timestamp.now();
        }
        else if (userData.role === 'admin') {
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
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user: ' + error.message);
    }
}
// Create new user without signing in (for admin use)
export async function createUserWithoutSignIn(userData) {
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
        // Store current user to restore later
        const currentUser = auth.currentUser;
        // Create Firebase Auth user (this will sign in the new user)
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const firebaseUser = userCredential.user;
        // Update Firebase Auth profile
        await updateProfile(firebaseUser, {
            displayName: userData.name
        });
        // Create Firestore profile
        const userProfile = {
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
        }
        else if (userData.role === 'teacher') {
            userProfile.department = userData.department;
            userProfile.specialization = userData.specialization;
            userProfile.employeeId = userData.employeeId || generateEmployeeId();
            userProfile.hireDate = Timestamp.now();
        }
        else if (userData.role === 'admin') {
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
    }
    catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Failed to create user: ' + error.message);
    }
}
// Update user
export async function updateUser(userId, updates) {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        await updateDoc(userRef, {
            ...updates,
            updatedAt: Timestamp.now()
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user');
    }
}
// Delete user (Firestore profile only - Firebase Auth deletion requires admin SDK)
export async function deleteUserProfile(userId) {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        await deleteDoc(userRef);
    }
    catch (error) {
        console.error('Error deleting user profile:', error);
        throw new Error('Failed to delete user profile');
    }
}
// Search users
export async function searchUsers(searchTerm, role) {
    try {
        let q;
        const usersRef = collection(db, USERS_COLLECTION);
        if (role) {
            q = query(usersRef, where('role', '==', role));
        }
        else {
            q = query(usersRef, orderBy('createdAt', 'desc'));
        }
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Client-side filtering for search term (Firestore doesn't support full-text search)
        if (searchTerm) {
            const lowercaseSearch = searchTerm.toLowerCase();
            return users.filter(user => user.name.toLowerCase().includes(lowercaseSearch) ||
                user.email.toLowerCase().includes(lowercaseSearch) ||
                (user.studentId && user.studentId.toLowerCase().includes(lowercaseSearch)) ||
                (user.employeeId && user.employeeId.toLowerCase().includes(lowercaseSearch)));
        }
        return users;
    }
    catch (error) {
        console.error('Error searching users:', error);
        throw new Error('Failed to search users');
    }
}
// Get user statistics
export async function getUserStats() {
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
    }
    catch (error) {
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
function generateStudentId() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `JFK${year}${randomNum}`;
}
function generateEmployeeId() {
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `JFK-FAC-${randomNum}`;
}
// Batch operations for bulk user management
export async function batchUpdateUsers(updates) {
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
    }
    catch (error) {
        console.error('Error batch updating users:', error);
        throw new Error('Failed to batch update users');
    }
}
