import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { UserProfile } from './users';

// Seed data for initial testing
const seedUsers: Omit<UserProfile, 'id'>[] = [
  // Students
  {
    uid: 'seed-student-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@student.jfk.edu',
    phone: '+1 (555) 123-4567',
    role: 'student',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    mdYear: 'MD-2',
    studentId: 'JFK2024001',
    gpa: 3.8,
    enrollmentDate: Timestamp.now()
  },
  {
    uid: 'seed-student-2',
    name: 'Michael Chen',
    email: 'michael.chen@student.jfk.edu',
    phone: '+1 (555) 234-5678',
    role: 'student',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    mdYear: 'MD-1',
    studentId: 'JFK2024002',
    gpa: 3.9,
    enrollmentDate: Timestamp.now()
  },
  // Teachers
  {
    uid: 'seed-teacher-1',
    name: 'Dr. Robert Smith',
    email: 'robert.smith@jfk.edu',
    phone: '+1 (555) 456-7890',
    role: 'teacher',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    department: 'Internal Medicine',
    specialization: 'Cardiology',
    employeeId: 'JFK-FAC-001',
    hireDate: Timestamp.now()
  },
  // Admins
  {
    uid: 'seed-admin-1',
    name: 'Admin Wilson',
    email: 'admin@jfk.edu',
    phone: '+1 (555) 678-9012',
    role: 'admin',
    status: 'active',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    adminLevel: 'super',
    permissions: ['user_management', 'course_management', 'system_settings']
  }
];

export async function seedUsersData(): Promise<void> {
  try {
    // Check if users already exist
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    
    if (snapshot.empty) {
      
      for (const userData of seedUsers) {
        await addDoc(usersRef, userData);
      }
      
    } else {
    }
  } catch (error) {
  }
}
