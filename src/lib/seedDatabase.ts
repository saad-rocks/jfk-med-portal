import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  Timestamp,
  serverTimestamp,
  getDocs,
  deleteDoc
} from "firebase/firestore";
import type { 
  User, 
  Course, 
  Assignment, 
  Submission, 
  Enrollment,
  Session,
  Announcement
} from "../types";

// Sample data for seeding
const sampleUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // Admin
  {
    uid: 'admin-001',
    name: 'Dr. Sarah Johnson',
    email: 'admin@jfk.edu',
    phone: '+1-555-0101',
    role: 'admin',
    status: 'active',
    adminLevel: 'super',
    permissions: ['all']
  },
  
  // Teachers
  {
    uid: 'teacher-001',
    name: 'Dr. Michael Chen',
    email: 'mchen@jfk.edu',
    phone: '+1-555-0102',
    role: 'teacher',
    status: 'active',
    department: 'Internal Medicine',
    specialization: 'Cardiology',
    employeeId: 'EMP001',
    hireDate: Date.now() - (365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'teacher-002',
    name: 'Dr. Emily Rodriguez',
    email: 'erodriguez@jfk.edu',
    phone: '+1-555-0103',
    role: 'teacher',
    status: 'active',
    department: 'Surgery',
    specialization: 'General Surgery',
    employeeId: 'EMP002',
    hireDate: Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'teacher-003',
    name: 'Dr. James Wilson',
    email: 'jwilson@jfk.edu',
    phone: '+1-555-0104',
    role: 'teacher',
    status: 'active',
    department: 'Pediatrics',
    specialization: 'Neonatology',
    employeeId: 'EMP003',
    hireDate: Date.now() - (3 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'teacher-004',
    name: 'Dr. Lisa Patel',
    email: 'lpatel@jfk.edu',
    phone: '+1-555-0105',
    role: 'teacher',
    status: 'active',
    department: 'Emergency Medicine',
    specialization: 'Trauma',
    employeeId: 'EMP004',
    hireDate: Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'teacher-005',
    name: 'Dr. Robert Martinez',
    email: 'rmartinez@jfk.edu',
    phone: '+1-555-0106',
    role: 'teacher',
    status: 'active',
    department: 'Psychiatry',
    specialization: 'Child Psychiatry',
    employeeId: 'EMP005',
    hireDate: Date.now() - (4 * 365 * 24 * 60 * 60 * 1000)
  },
  
  // Students - MD1 through MD4
  {
    uid: 'student-001',
    name: 'Alex Thompson',
    email: 'athompson@jfk.edu',
    phone: '+1-555-0201',
    role: 'student',
    status: 'active',
    mdYear: 'MD-1',
    studentId: 'STU001',
    gpa: 3.8,
    enrollmentDate: Date.now() - (365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-002',
    name: 'Maria Garcia',
    email: 'mgarcia@jfk.edu',
    phone: '+1-555-0202',
    role: 'student',
    status: 'active',
    mdYear: 'MD-1',
    studentId: 'STU002',
    gpa: 3.9,
    enrollmentDate: Date.now() - (365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-003',
    name: 'David Kim',
    email: 'dkim@jfk.edu',
    phone: '+1-555-0203',
    role: 'student',
    status: 'active',
    mdYear: 'MD-2',
    studentId: 'STU003',
    gpa: 3.7,
    enrollmentDate: Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-004',
    name: 'Sarah Williams',
    email: 'swilliams@jfk.edu',
    phone: '+1-555-0204',
    role: 'student',
    status: 'active',
    mdYear: 'MD-2',
    studentId: 'STU004',
    gpa: 3.6,
    enrollmentDate: Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-005',
    name: 'Robert Brown',
    email: 'rbrown@jfk.edu',
    phone: '+1-555-0205',
    role: 'student',
    status: 'active',
    mdYear: 'MD-2',
    studentId: 'STU005',
    gpa: 3.5,
    enrollmentDate: Date.now() - (2 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-006',
    name: 'Jennifer Lee',
    email: 'jlee@jfk.edu',
    phone: '+1-555-0206',
    role: 'student',
    status: 'active',
    mdYear: 'MD-3',
    studentId: 'STU006',
    gpa: 3.9,
    enrollmentDate: Date.now() - (3 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-007',
    name: 'Michael Johnson',
    email: 'mjohnson@jfk.edu',
    phone: '+1-555-0207',
    role: 'student',
    status: 'active',
    mdYear: 'MD-3',
    studentId: 'STU007',
    gpa: 3.8,
    enrollmentDate: Date.now() - (3 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-008',
    name: 'Emily Davis',
    email: 'edavis@jfk.edu',
    phone: '+1-555-0208',
    role: 'student',
    status: 'active',
    mdYear: 'MD-4',
    studentId: 'STU008',
    gpa: 3.7,
    enrollmentDate: Date.now() - (4 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-009',
    name: 'Christopher Wilson',
    email: 'cwilson@jfk.edu',
    phone: '+1-555-0209',
    role: 'student',
    status: 'active',
    mdYear: 'MD-4',
    studentId: 'STU009',
    gpa: 3.6,
    enrollmentDate: Date.now() - (4 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-010',
    name: 'Amanda Taylor',
    email: 'ataylor@jfk.edu',
    phone: '+1-555-0210',
    role: 'student',
    status: 'active',
    mdYear: 'MD-1',
    studentId: 'STU010',
    gpa: 3.9,
    enrollmentDate: Date.now() - (365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-011',
    name: 'Daniel Anderson',
    email: 'danderson@jfk.edu',
    phone: '+1-555-0211',
    role: 'student',
    status: 'active',
    mdYear: 'MD-3',
    studentId: 'STU011',
    gpa: 3.8,
    enrollmentDate: Date.now() - (3 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-012',
    name: 'Rachel Green',
    email: 'rgreen@jfk.edu',
    phone: '+1-555-0212',
    role: 'student',
    status: 'active',
    mdYear: 'MD-5',
    studentId: 'STU012',
    gpa: 3.9,
    enrollmentDate: Date.now() - (5 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-013',
    name: 'Thomas Miller',
    email: 'tmiller@jfk.edu',
    phone: '+1-555-0213',
    role: 'student',
    status: 'active',
    mdYear: 'MD-5',
    studentId: 'STU013',
    gpa: 3.7,
    enrollmentDate: Date.now() - (5 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-014',
    name: 'Jessica Davis',
    email: 'jdavis@jfk.edu',
    phone: '+1-555-0214',
    role: 'student',
    status: 'active',
    mdYear: 'MD-6',
    studentId: 'STU014',
    gpa: 3.8,
    enrollmentDate: Date.now() - (6 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-015',
    name: 'Kevin Wilson',
    email: 'kwilson@jfk.edu',
    phone: '+1-555-0215',
    role: 'student',
    status: 'active',
    mdYear: 'MD-6',
    studentId: 'STU015',
    gpa: 3.6,
    enrollmentDate: Date.now() - (6 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-016',
    name: 'Lisa Brown',
    email: 'lbrown@jfk.edu',
    phone: '+1-555-0216',
    role: 'student',
    status: 'active',
    mdYear: 'MD-7',
    studentId: 'STU016',
    gpa: 3.9,
    enrollmentDate: Date.now() - (7 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-017',
    name: 'Mark Johnson',
    email: 'mjohnson2@jfk.edu',
    phone: '+1-555-0217',
    role: 'student',
    status: 'active',
    mdYear: 'MD-7',
    studentId: 'STU017',
    gpa: 3.8,
    enrollmentDate: Date.now() - (7 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-018',
    name: 'Amanda White',
    email: 'awhite@jfk.edu',
    phone: '+1-555-0218',
    role: 'student',
    status: 'active',
    mdYear: 'MD-8',
    studentId: 'STU018',
    gpa: 3.7,
    enrollmentDate: Date.now() - (8 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-019',
    name: 'Ryan Taylor',
    email: 'rtaylor@jfk.edu',
    phone: '+1-555-0219',
    role: 'student',
    status: 'active',
    mdYear: 'MD-8',
    studentId: 'STU019',
    gpa: 3.6,
    enrollmentDate: Date.now() - (8 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-020',
    name: 'Sophie Martin',
    email: 'smartin@jfk.edu',
    phone: '+1-555-0220',
    role: 'student',
    status: 'active',
    mdYear: 'MD-9',
    studentId: 'STU020',
    gpa: 3.8,
    enrollmentDate: Date.now() - (9 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-021',
    name: 'James Lee',
    email: 'jlee2@jfk.edu',
    phone: '+1-555-0221',
    role: 'student',
    status: 'active',
    mdYear: 'MD-9',
    studentId: 'STU021',
    gpa: 3.7,
    enrollmentDate: Date.now() - (9 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-022',
    name: 'Emma Garcia',
    email: 'egarcia@jfk.edu',
    phone: '+1-555-0222',
    role: 'student',
    status: 'active',
    mdYear: 'MD-10',
    studentId: 'STU022',
    gpa: 3.9,
    enrollmentDate: Date.now() - (10 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-023',
    name: 'David Rodriguez',
    email: 'drodriguez@jfk.edu',
    phone: '+1-555-0223',
    role: 'student',
    status: 'active',
    mdYear: 'MD-10',
    studentId: 'STU023',
    gpa: 3.8,
    enrollmentDate: Date.now() - (10 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-024',
    name: 'Sarah Chen',
    email: 'schen@jfk.edu',
    phone: '+1-555-0224',
    role: 'student',
    status: 'active',
    mdYear: 'MD-11',
    studentId: 'STU024',
    gpa: 3.9,
    enrollmentDate: Date.now() - (11 * 365 * 24 * 60 * 60 * 1000)
  },
  {
    uid: 'student-025',
    name: 'Michael Patel',
    email: 'mpatel@jfk.edu',
    phone: '+1-555-0225',
    role: 'student',
    status: 'active',
    mdYear: 'MD-11',
    studentId: 'STU025',
    gpa: 3.8,
    enrollmentDate: Date.now() - (11 * 365 * 24 * 60 * 60 * 1000)
  }
];

const sampleCourses: Omit<Course, 'id'>[] = [
  // MD-1 Courses (Basic Sciences)
  {
    code: 'ANAT101',
    title: 'Human Anatomy',
    credits: 6,
    semester: 'MD-1',
    capacity: 40,
    instructor: 'Dr. Michael Chen',
    description: 'Comprehensive study of human anatomy including gross anatomy, histology, and embryology.',
    ownerId: 'teacher-001',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'PHYS102',
    title: 'Human Physiology',
    credits: 5,
    semester: 'MD-1',
    capacity: 40,
    instructor: 'Dr. Emily Rodriguez',
    description: 'Study of normal human body function and mechanisms of disease.',
    ownerId: 'teacher-002',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'BIOC103',
    title: 'Medical Biochemistry',
    credits: 4,
    semester: 'MD-1',
    capacity: 40,
    instructor: 'Dr. James Wilson',
    description: 'Biochemical processes in health and disease, metabolism, and molecular medicine.',
    ownerId: 'teacher-003',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-2 Courses (Pathophysiology)
  {
    code: 'PATH201',
    title: 'Pathology I',
    credits: 5,
    semester: 'MD-2',
    capacity: 35,
    instructor: 'Dr. Lisa Patel',
    description: 'Study of disease processes, cellular injury, and tissue responses.',
    ownerId: 'teacher-004',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'PHAR202',
    title: 'Pharmacology I',
    credits: 4,
    semester: 'MD-2',
    capacity: 35,
    instructor: 'Dr. Robert Martinez',
    description: 'Principles of drug action, pharmacokinetics, and therapeutic applications.',
    ownerId: 'teacher-005',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'MICR203',
    title: 'Medical Microbiology',
    credits: 4,
    semester: 'MD-2',
    capacity: 35,
    instructor: 'Dr. Michael Chen',
    description: 'Study of microorganisms causing human disease and host defense mechanisms.',
    ownerId: 'teacher-001',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-3 Courses (Clinical Sciences)
  {
    code: 'MED301',
    title: 'Internal Medicine',
    credits: 8,
    semester: 'MD-3',
    capacity: 30,
    instructor: 'Dr. Michael Chen',
    description: 'Clinical rotation in internal medicine with patient care responsibilities.',
    ownerId: 'teacher-001',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'SUR302',
    title: 'General Surgery',
    credits: 8,
    semester: 'MD-3',
    capacity: 25,
    instructor: 'Dr. Emily Rodriguez',
    description: 'Clinical rotation in general surgery with operative experience.',
    ownerId: 'teacher-002',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'PED303',
    title: 'Pediatrics',
    credits: 6,
    semester: 'MD-3',
    capacity: 28,
    instructor: 'Dr. James Wilson',
    description: 'Clinical rotation in pediatrics with focus on child health and development.',
    ownerId: 'teacher-003',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-4 Courses (Advanced Clinical)
  {
    code: 'EM404',
    title: 'Emergency Medicine',
    credits: 4,
    semester: 'MD-4',
    capacity: 20,
    instructor: 'Dr. Lisa Patel',
    description: 'Advanced clinical rotation in emergency medicine and trauma care.',
    ownerId: 'teacher-004',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'PSY405',
    title: 'Psychiatry',
    credits: 4,
    semester: 'MD-4',
    capacity: 20,
    instructor: 'Dr. Robert Martinez',
    description: 'Clinical rotation in psychiatry with focus on mental health assessment.',
    ownerId: 'teacher-005',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-5 Courses (Specialized Clinical)
  {
    code: 'OBG506',
    title: 'Obstetrics & Gynecology',
    credits: 6,
    semester: 'MD-5',
    capacity: 18,
    instructor: 'Dr. Emily Rodriguez',
    description: 'Clinical rotation in obstetrics and gynecology with focus on women\'s health.',
    ownerId: 'teacher-002',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'RAD507',
    title: 'Radiology',
    credits: 4,
    semester: 'MD-5',
    capacity: 15,
    instructor: 'Dr. Michael Chen',
    description: 'Introduction to diagnostic imaging and radiological interpretation.',
    ownerId: 'teacher-001',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-6 Courses (Advanced Specialties)
  {
    code: 'CAR608',
    title: 'Cardiology',
    credits: 6,
    semester: 'MD-6',
    capacity: 12,
    instructor: 'Dr. Michael Chen',
    description: 'Advanced cardiology rotation with focus on cardiac procedures.',
    ownerId: 'teacher-001',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'NEU609',
    title: 'Neurology',
    credits: 6,
    semester: 'MD-6',
    capacity: 12,
    instructor: 'Dr. Lisa Patel',
    description: 'Neurology rotation with focus on neurological examination and diagnosis.',
    ownerId: 'teacher-004',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-7 Courses (Research & Electives)
  {
    code: 'RES710',
    title: 'Research Elective',
    credits: 8,
    semester: 'MD-7',
    capacity: 20,
    instructor: 'Dr. James Wilson',
    description: 'Research project in chosen medical specialty with faculty mentor.',
    ownerId: 'teacher-003',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'INT711',
    title: 'International Medicine',
    credits: 6,
    semester: 'MD-7',
    capacity: 15,
    instructor: 'Dr. Robert Martinez',
    description: 'International clinical rotation with focus on global health.',
    ownerId: 'teacher-005',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-8 Courses (Subspecialty)
  {
    code: 'ONC812',
    title: 'Oncology',
    credits: 6,
    semester: 'MD-8',
    capacity: 10,
    instructor: 'Dr. Lisa Patel',
    description: 'Oncology rotation with focus on cancer diagnosis and treatment.',
    ownerId: 'teacher-004',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'ORTH813',
    title: 'Orthopedics',
    credits: 6,
    semester: 'MD-8',
    capacity: 12,
    instructor: 'Dr. Emily Rodriguez',
    description: 'Orthopedic surgery rotation with focus on musculoskeletal conditions.',
    ownerId: 'teacher-002',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-9 Courses (Advanced Practice)
  {
    code: 'ICU914',
    title: 'Intensive Care Medicine',
    credits: 8,
    semester: 'MD-9',
    capacity: 8,
    instructor: 'Dr. Lisa Patel',
    description: 'ICU rotation with focus on critical care management.',
    ownerId: 'teacher-004',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'TRAUMA915',
    title: 'Trauma Surgery',
    credits: 6,
    semester: 'MD-9',
    capacity: 10,
    instructor: 'Dr. Emily Rodriguez',
    description: 'Trauma surgery rotation with focus on emergency procedures.',
    ownerId: 'teacher-002',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-10 Courses (Leadership & Management)
  {
    code: 'LEAD1016',
    title: 'Medical Leadership',
    credits: 4,
    semester: 'MD-10',
    capacity: 15,
    instructor: 'Dr. Sarah Johnson',
    description: 'Leadership development and healthcare management principles.',
    ownerId: 'admin-001',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'ETH1017',
    title: 'Medical Ethics & Law',
    credits: 4,
    semester: 'MD-10',
    capacity: 20,
    instructor: 'Dr. Robert Martinez',
    description: 'Advanced medical ethics, legal issues, and professional responsibility.',
    ownerId: 'teacher-005',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  
  // MD-11 Courses (Capstone & Transition)
  {
    code: 'CAP1018',
    title: 'Capstone Project',
    credits: 10,
    semester: 'MD-11',
    capacity: 25,
    instructor: 'Dr. Sarah Johnson',
    description: 'Comprehensive capstone project demonstrating medical competency.',
    ownerId: 'admin-001',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  },
  {
    code: 'TRANS1019',
    title: 'Transition to Residency',
    credits: 6,
    semester: 'MD-11',
    capacity: 25,
    instructor: 'Dr. Sarah Johnson',
    description: 'Preparation for residency with focus on professional development.',
    ownerId: 'admin-001',
    createdAt: Date.now() - (90 * 24 * 60 * 60 * 1000)
  }
];

const sampleAssignments: Omit<Assignment, 'id'>[] = [
  // ANAT101 - Human Anatomy
  {
    courseId: 'ANAT101',
    title: 'Gross Anatomy Lab Report',
    type: 'hw',
    dueAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
    weight: 15,
    maxPoints: 100,
    instructions: 'Submit a detailed report on the cardiovascular system dissection including structures identified and clinical correlations.',
    attachments: ['anatomy_lab_guidelines.pdf'],
    ownerId: 'teacher-001',
    createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000)
  },
  {
    courseId: 'ANAT101',
    title: 'Anatomy Midterm',
    type: 'midterm',
    dueAt: Date.now() + (14 * 24 * 60 * 60 * 1000),
    weight: 25,
    maxPoints: 150,
    instructions: 'Comprehensive examination covering upper and lower limb anatomy, thorax, and abdomen.',
    attachments: ['midterm_guidelines.pdf'],
    ownerId: 'teacher-001',
    createdAt: Date.now() - (14 * 24 * 60 * 60 * 1000)
  },
  {
    courseId: 'ANAT101',
    title: 'Practical Skills Assessment',
    type: 'quiz',
    dueAt: Date.now() + (21 * 24 * 60 * 60 * 1000),
    weight: 20,
    maxPoints: 100,
    instructions: 'Practical identification of anatomical structures on cadavers and models.',
    attachments: ['assessment_checklist.pdf'],
    ownerId: 'teacher-001',
    createdAt: Date.now() - (21 * 24 * 60 * 60 * 1000)
  },
  
  // PHYS102 - Human Physiology
  {
    courseId: 'PHYS102',
    title: 'Cardiovascular Physiology Report',
    type: 'hw',
    dueAt: Date.now() + (5 * 24 * 60 * 60 * 1000),
    weight: 15,
    maxPoints: 100,
    instructions: 'Analyze cardiovascular physiology data and explain mechanisms of cardiac output regulation.',
    attachments: ['physio_data.pdf'],
    ownerId: 'teacher-002',
    createdAt: Date.now() - (5 * 24 * 60 * 60 * 1000)
  },
  {
    courseId: 'PHYS102',
    title: 'Physiology Quiz',
    type: 'quiz',
    dueAt: Date.now() + (3 * 24 * 60 * 60 * 1000),
    weight: 10,
    maxPoints: 50,
    instructions: 'Online quiz covering respiratory and renal physiology principles.',
    attachments: [],
    ownerId: 'teacher-002',
    createdAt: Date.now() - (3 * 24 * 60 * 60 * 1000)
  },
  
  // BIOC103 - Medical Biochemistry
  {
    courseId: 'BIOC103',
    title: 'Metabolic Pathways Analysis',
    type: 'hw',
    dueAt: Date.now() + (10 * 24 * 60 * 60 * 1000),
    weight: 15,
    maxPoints: 100,
    instructions: 'Analyze metabolic pathway diagrams and explain regulation mechanisms.',
    attachments: ['metabolic_pathways.pdf'],
    ownerId: 'teacher-003',
    createdAt: Date.now() - (10 * 24 * 60 * 60 * 1000)
  },
  
  // PATH201 - Pathology I
  {
    courseId: 'PATH201',
    title: 'Case Study: Myocardial Infarction',
    type: 'hw',
    dueAt: Date.now() + (8 * 24 * 60 * 60 * 1000),
    weight: 20,
    maxPoints: 100,
    instructions: 'Analyze histopathological slides and clinical data for myocardial infarction case.',
    attachments: ['mi_case.pdf', 'histology_slides.pdf'],
    ownerId: 'teacher-004',
    createdAt: Date.now() - (8 * 24 * 60 * 60 * 1000)
  },
  {
    courseId: 'PATH201',
    title: 'Pathology Midterm',
    type: 'midterm',
    dueAt: Date.now() + (16 * 24 * 60 * 60 * 1000),
    weight: 30,
    maxPoints: 200,
    instructions: 'Comprehensive examination covering cellular injury, inflammation, and cardiovascular pathology.',
    attachments: ['pathology_guidelines.pdf'],
    ownerId: 'teacher-004',
    createdAt: Date.now() - (16 * 24 * 60 * 60 * 1000)
  },
  
  // PHAR202 - Pharmacology I
  {
    courseId: 'PHAR202',
    title: 'Drug Mechanism Analysis',
    type: 'hw',
    dueAt: Date.now() + (6 * 24 * 60 * 60 * 1000),
    weight: 15,
    maxPoints: 100,
    instructions: 'Research and present on the mechanism of action of a cardiovascular drug.',
    attachments: ['pharma_guidelines.pdf'],
    ownerId: 'teacher-005',
    createdAt: Date.now() - (6 * 24 * 60 * 60 * 1000)
  },
  
  // MED301 - Internal Medicine (Clinical)
  {
    courseId: 'MED301',
    title: 'Patient Presentation',
    type: 'presentation',
    dueAt: Date.now() + (12 * 24 * 60 * 60 * 1000),
    weight: 25,
    maxPoints: 100,
    instructions: 'Present a patient case including history, physical exam, differential diagnosis, and treatment plan.',
    attachments: ['presentation_rubric.pdf'],
    ownerId: 'teacher-001',
    createdAt: Date.now() - (12 * 24 * 60 * 60 * 1000)
  },
  {
    courseId: 'MED301',
    title: 'Clinical Skills Assessment',
    type: 'quiz',
    dueAt: Date.now() + (20 * 24 * 60 * 60 * 1000),
    weight: 30,
    maxPoints: 150,
    instructions: 'Practical assessment of clinical examination and patient communication skills.',
    attachments: ['clinical_rubric.pdf'],
    ownerId: 'teacher-001',
    createdAt: Date.now() - (20 * 24 * 60 * 60 * 1000)
  },
  
  // OBG506 - Obstetrics & Gynecology
  {
    courseId: 'OBG506',
    title: 'OB/GYN Case Study',
    type: 'hw',
    dueAt: Date.now() + (15 * 24 * 60 * 60 * 1000),
    weight: 20,
    maxPoints: 100,
    instructions: 'Analyze a complex OB/GYN case with focus on diagnostic reasoning and treatment planning.',
    attachments: ['obgyn_case.pdf'],
    ownerId: 'teacher-002',
    createdAt: Date.now() - (15 * 24 * 60 * 60 * 1000)
  },
  
  // CAR608 - Cardiology
  {
    courseId: 'CAR608',
    title: 'Cardiac Procedures Report',
    type: 'hw',
    dueAt: Date.now() + (18 * 24 * 60 * 60 * 1000),
    weight: 25,
    maxPoints: 120,
    instructions: 'Research and report on advanced cardiac procedures and their indications.',
    attachments: ['cardiac_procedures.pdf'],
    ownerId: 'teacher-001',
    createdAt: Date.now() - (18 * 24 * 60 * 60 * 1000)
  },
  
  // RES710 - Research Elective
  {
    courseId: 'RES710',
    title: 'Research Proposal',
    type: 'hw',
    dueAt: Date.now() + (25 * 24 * 60 * 60 * 1000),
    weight: 30,
    maxPoints: 150,
    instructions: 'Develop a comprehensive research proposal in your chosen medical specialty.',
    attachments: ['research_guidelines.pdf'],
    ownerId: 'teacher-003',
    createdAt: Date.now() - (25 * 24 * 60 * 60 * 1000)
  },
  
  // CAP1018 - Capstone Project
  {
    courseId: 'CAP1018',
    title: 'Capstone Research Paper',
    type: 'final',
    dueAt: Date.now() + (30 * 24 * 60 * 60 * 1000),
    weight: 40,
    maxPoints: 200,
    instructions: 'Comprehensive research paper demonstrating mastery of medical knowledge and research skills.',
    attachments: ['capstone_guidelines.pdf'],
    ownerId: 'admin-001',
    createdAt: Date.now() - (30 * 24 * 60 * 60 * 1000)
  }
];

const sampleEnrollments: Omit<Enrollment, 'id'>[] = [
  // MD-1 Students (Basic Sciences)
  // ANAT101 - All MD-1 students
  { courseId: 'ANAT101', studentId: 'student-001', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'ANAT101', studentId: 'student-002', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'ANAT101', studentId: 'student-010', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // PHYS102 - All MD-1 students
  { courseId: 'PHYS102', studentId: 'student-001', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'PHYS102', studentId: 'student-002', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'PHYS102', studentId: 'student-010', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // BIOC103 - All MD-1 students
  { courseId: 'BIOC103', studentId: 'student-001', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'BIOC103', studentId: 'student-002', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'BIOC103', studentId: 'student-010', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-2 Students (Pathophysiology)
  // PATH201 - All MD-2 students
  { courseId: 'PATH201', studentId: 'student-003', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'PATH201', studentId: 'student-004', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'PATH201', studentId: 'student-005', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // PHAR202 - All MD-2 students
  { courseId: 'PHAR202', studentId: 'student-003', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'PHAR202', studentId: 'student-004', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'PHAR202', studentId: 'student-005', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MICR203 - All MD-2 students
  { courseId: 'MICR203', studentId: 'student-003', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'MICR203', studentId: 'student-004', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'MICR203', studentId: 'student-005', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-3 Students (Clinical Sciences)
  // MED301 - All MD-3 students
  { courseId: 'MED301', studentId: 'student-006', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'MED301', studentId: 'student-007', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'MED301', studentId: 'student-011', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // SUR302 - All MD-3 students
  { courseId: 'SUR302', studentId: 'student-006', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'SUR302', studentId: 'student-007', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'SUR302', studentId: 'student-011', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // PED303 - All MD-3 students
  { courseId: 'PED303', studentId: 'student-006', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'PED303', studentId: 'student-007', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'PED303', studentId: 'student-011', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-4 Students (Advanced Clinical)
  // EM404 - All MD-4 students
  { courseId: 'EM404', studentId: 'student-008', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'EM404', studentId: 'student-009', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // PSY405 - All MD-4 students
  { courseId: 'PSY405', studentId: 'student-008', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'PSY405', studentId: 'student-009', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-5 Students (Specialized Clinical)
  // OBG506 - All MD-5 students
  { courseId: 'OBG506', studentId: 'student-012', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'OBG506', studentId: 'student-013', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // RAD507 - All MD-5 students
  { courseId: 'RAD507', studentId: 'student-012', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'RAD507', studentId: 'student-013', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-6 Students (Advanced Specialties)
  // CAR608 - All MD-6 students
  { courseId: 'CAR608', studentId: 'student-014', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'CAR608', studentId: 'student-015', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // NEU609 - All MD-6 students
  { courseId: 'NEU609', studentId: 'student-014', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'NEU609', studentId: 'student-015', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-7 Students (Research & Electives)
  // RES710 - All MD-7 students
  { courseId: 'RES710', studentId: 'student-016', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'RES710', studentId: 'student-017', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // INT711 - All MD-7 students
  { courseId: 'INT711', studentId: 'student-016', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'INT711', studentId: 'student-017', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-8 Students (Subspecialty)
  // ONC812 - All MD-8 students
  { courseId: 'ONC812', studentId: 'student-018', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'ONC812', studentId: 'student-019', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // ORTH813 - All MD-8 students
  { courseId: 'ORTH813', studentId: 'student-018', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'ORTH813', studentId: 'student-019', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-9 Students (Advanced Practice)
  // ICU914 - All MD-9 students
  { courseId: 'ICU914', studentId: 'student-020', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'ICU914', studentId: 'student-021', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // TRAUMA915 - All MD-9 students
  { courseId: 'TRAUMA915', studentId: 'student-020', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'TRAUMA915', studentId: 'student-021', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-10 Students (Leadership & Management)
  // LEAD1016 - All MD-10 students
  { courseId: 'LEAD1016', studentId: 'student-022', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'LEAD1016', studentId: 'student-023', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // ETH1017 - All MD-10 students
  { courseId: 'ETH1017', studentId: 'student-022', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'ETH1017', studentId: 'student-023', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // MD-11 Students (Capstone & Transition)
  // CAP1018 - All MD-11 students
  { courseId: 'CAP1018', studentId: 'student-024', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'CAP1018', studentId: 'student-025', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  
  // TRANS1019 - All MD-11 students
  { courseId: 'TRANS1019', studentId: 'student-024', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) },
  { courseId: 'TRANS1019', studentId: 'student-025', status: 'enrolled', enrolledAt: Date.now() - (30 * 24 * 60 * 60 * 1000) }
];

const sampleSessions: Omit<Session, 'id'>[] = [
  // ANAT101 Sessions
  {
    courseId: 'ANAT101',
    title: 'Cardiovascular System Dissection',
    description: 'Hands-on dissection of the heart and major vessels',
    startTime: Date.now() + (2 * 24 * 60 * 60 * 1000),
    endTime: Date.now() + (2 * 24 * 60 * 60 * 1000) + (3 * 60 * 60 * 1000),
    location: 'Anatomy Lab A',
    instructorId: 'teacher-001',
    attendees: ['student-001', 'student-002', 'student-010'],
    createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000)
  },
  {
    courseId: 'ANAT101',
    title: 'Upper Limb Anatomy',
    description: 'Study of upper limb structures and clinical correlations',
    startTime: Date.now() + (4 * 24 * 60 * 60 * 1000),
    endTime: Date.now() + (4 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000),
    location: 'Lecture Hall A',
    instructorId: 'teacher-001',
    attendees: ['student-001', 'student-002', 'student-010'],
    createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000)
  },
  
  // PHYS102 Sessions
  {
    courseId: 'PHYS102',
    title: 'Cardiovascular Physiology Lab',
    description: 'Practical experiments on cardiac output and blood pressure',
    startTime: Date.now() + (1 * 24 * 60 * 60 * 1000),
    endTime: Date.now() + (1 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000),
    location: 'Physiology Lab B',
    instructorId: 'teacher-002',
    attendees: ['student-001', 'student-002', 'student-010'],
    createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000)
  },
  
  // PATH201 Sessions
  {
    courseId: 'PATH201',
    title: 'Histopathology Review',
    description: 'Microscopic examination of diseased tissues',
    startTime: Date.now() + (3 * 24 * 60 * 60 * 1000),
    endTime: Date.now() + (3 * 24 * 60 * 60 * 1000) + (2 * 60 * 60 * 1000),
    location: 'Pathology Lab',
    instructorId: 'teacher-004',
    attendees: ['student-003', 'student-004', 'student-005'],
    createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000)
  },
  
  // MED301 Sessions (Clinical)
  {
    courseId: 'MED301',
    title: 'Patient Rounds',
    description: 'Clinical rounds with attending physician',
    startTime: Date.now() + (5 * 24 * 60 * 60 * 1000),
    endTime: Date.now() + (5 * 24 * 60 * 60 * 1000) + (4 * 60 * 60 * 1000),
    location: 'Internal Medicine Ward',
    instructorId: 'teacher-001',
    attendees: ['student-006', 'student-007', 'student-011'],
    createdAt: Date.now() - (7 * 24 * 60 * 60 * 1000)
  }
];

const sampleAnnouncements: Omit<Announcement, 'id'>[] = [
  {
    title: 'Welcome to Fall Semester 2024!',
    content: 'Welcome back students! We have an exciting semester ahead with new courses and clinical rotations. Please review your course schedules and assignment due dates.',
    authorId: 'admin-001',
    priority: 'medium',
    publishedAt: Date.now() - (7 * 24 * 60 * 60 * 1000),
    expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Anatomy Lab Safety Protocols',
    content: 'Important reminder: All students must complete safety training before entering the anatomy lab. Proper PPE and respectful conduct required.',
    authorId: 'teacher-001',
    courseId: 'ANAT101',
    priority: 'high',
    publishedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Physiology Lab Equipment Update',
    content: 'New cardiovascular monitoring equipment has been installed in Physiology Lab B. Training session scheduled for next week.',
    authorId: 'teacher-002',
    courseId: 'PHYS102',
    priority: 'medium',
    publishedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
    expiresAt: Date.now() + (14 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Pathology Lab Schedule Change',
    content: 'Pathology lab sessions have been rescheduled due to equipment maintenance. Check your course schedule for updates.',
    authorId: 'teacher-004',
    courseId: 'PATH201',
    priority: 'high',
    publishedAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
  },
  {
    title: 'Clinical Rotation Orientation',
    content: 'MD-3 students: Clinical rotation orientation will be held this Friday. Attendance is mandatory for all clinical students.',
    authorId: 'teacher-001',
    courseId: 'MED301',
    priority: 'high',
    publishedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
  }
];

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Seed Users
    console.log('👥 Seeding users...');
    const userIds: { [key: string]: string } = {};
    
    for (const user of sampleUsers) {
      const userRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      if (user.uid) {
        userIds[user.uid] = userRef.id;
      }
      console.log(`✅ Created user: ${user.name}`);
    }
    
    // Seed Courses
    console.log('📚 Seeding courses...');
    const courseIds: { [key: string]: string } = {};
    
    for (const course of sampleCourses) {
      const courseRef = await addDoc(collection(db, 'courses'), {
        ...course,
        createdAt: serverTimestamp()
      });
      courseIds[course.code] = courseRef.id;
      console.log(`✅ Created course: ${course.title}`);
    }
    
    // Seed Assignments
    console.log('📝 Seeding assignments...');
    const assignmentIds: { [key: string]: string } = {};
    
    for (const assignment of sampleAssignments) {
      // Map the human-readable course ID to the actual Firestore document ID
      const actualCourseId = courseIds[assignment.courseId];
      if (actualCourseId) {
        const assignmentRef = await addDoc(collection(db, 'assignments'), {
          ...assignment,
          courseId: actualCourseId, // Use the actual Firestore document ID
          createdAt: serverTimestamp()
        });
        assignmentIds[assignment.title] = assignmentRef.id;
        console.log(`✅ Created assignment: ${assignment.title} with ID: ${assignmentRef.id} for course ${assignment.courseId} (${actualCourseId})`);
      } else {
        console.log(`⚠️ Skipping assignment ${assignment.title} - course ${assignment.courseId} not found`);
      }
    }
    
    // Debug: Log all assignment IDs for reference
    console.log('🔍 Assignment IDs created:', assignmentIds);
    
    // Seed Enrollments
    console.log('🎓 Seeding enrollments...');
    for (const enrollment of sampleEnrollments) {
      // Map the human-readable course ID to the actual Firestore document ID
      const actualCourseId = courseIds[enrollment.courseId];
      if (actualCourseId) {
        await addDoc(collection(db, 'enrollments'), {
          ...enrollment,
          courseId: actualCourseId, // Use the actual Firestore document ID
          enrolledAt: serverTimestamp()
        });
        console.log(`✅ Created enrollment for student ${enrollment.studentId} in course ${enrollment.courseId} (${actualCourseId})`);
      } else {
        console.log(`⚠️ Skipping enrollment for course ${enrollment.courseId} - course not found`);
      }
    }
    
    // Seed Sessions
    console.log('🕐 Seeding sessions...');
    for (const session of sampleSessions) {
      // Map the human-readable course ID to the actual Firestore document ID
      const actualCourseId = courseIds[session.courseId];
      if (actualCourseId) {
        await addDoc(collection(db, 'classSessions'), {
          ...session,
          courseId: actualCourseId, // Use the actual Firestore document ID
          createdAt: serverTimestamp()
        });
        console.log(`✅ Created session: ${session.title} for course ${session.courseId} (${actualCourseId})`);
      } else {
        console.log(`⚠️ Skipping session ${session.title} - course ${session.courseId} not found`);
      }
    }
    
    // Seed Announcements
    console.log('📢 Seeding announcements...');
    for (const announcement of sampleAnnouncements) {
      try {
        // Filter out undefined values before creating the document
        const cleanAnnouncement = Object.fromEntries(
          Object.entries(announcement).filter(([_, value]) => value !== undefined)
        );
        
        await addDoc(collection(db, 'announcements'), {
          ...cleanAnnouncement,
          publishedAt: serverTimestamp()
        });
        console.log(`✅ Created announcement: ${announcement.title}`);
      } catch (error) {
        console.error(`❌ Failed to create announcement: ${announcement.title}`, error);
      }
    }
    
    // Seed some sample submissions and grades
    console.log('📤 Seeding sample submissions...');
    if (Object.keys(assignmentIds).length > 0 && Object.keys(courseIds).length > 0) {
      await seedSampleSubmissions(assignmentIds, courseIds);
    } else {
      console.log('⚠️ No assignments or courses created, skipping submissions');
    }
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: ${sampleUsers.length}`);
    console.log(`- Courses: ${sampleCourses.length}`);
    console.log(`- Assignments: ${sampleAssignments.length}`);
    console.log(`- Enrollments: ${sampleEnrollments.length}`);
    console.log(`- Sessions: ${sampleSessions.length}`);
    console.log(`- Announcements: ${sampleAnnouncements.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

async function seedSampleSubmissions(assignmentIds: { [key: string]: string }, courseIds: { [key: string]: string }) {
  // Create some sample submissions with grades
  const sampleSubmissions = [
    // ANAT101 - Gross Anatomy Lab Report
    {
      assignmentId: assignmentIds['Gross Anatomy Lab Report'],
      courseId: courseIds['ANAT101'],
      studentId: 'student-001',
      fileUrl: 'https://example.com/anatomy_lab_report_1.pdf',
      submittedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
      grade: {
        points: 92,
        percent: 92,
        feedback: 'Excellent dissection work! Clear identification of cardiovascular structures with accurate clinical correlations.',
        gradedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
        graderId: 'teacher-001'
      }
    },
    {
      assignmentId: assignmentIds['Gross Anatomy Lab Report'],
      courseId: courseIds['ANAT101'],
      studentId: 'student-002',
      fileUrl: 'https://example.com/anatomy_lab_report_2.pdf',
      submittedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
      grade: {
        points: 88,
        percent: 88,
        feedback: 'Good work overall. Strong anatomical knowledge but could improve clinical application examples.',
        gradedAt: Date.now() - (12 * 60 * 60 * 1000),
        graderId: 'teacher-001'
      }
    },
    {
      assignmentId: assignmentIds['Gross Anatomy Lab Report'],
      courseId: courseIds['ANAT101'],
      studentId: 'student-010',
      fileUrl: 'https://example.com/anatomy_lab_report_3.pdf',
      submittedAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
      grade: {
        points: 95,
        percent: 95,
        feedback: 'Outstanding work! Exceptional detail and excellent clinical correlations throughout.',
        gradedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
        graderId: 'teacher-001'
      }
    },
    
    // ANAT101 - Anatomy Midterm
    {
      assignmentId: assignmentIds['Anatomy Midterm'],
      courseId: courseIds['ANAT101'],
      studentId: 'student-001',
      fileUrl: 'https://example.com/anatomy_midterm_1.pdf',
      submittedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
      grade: {
        points: 135,
        percent: 90,
        feedback: 'Strong performance on upper limb and thorax sections. Could improve on abdominal anatomy.',
        gradedAt: Date.now() - (6 * 60 * 60 * 1000),
        graderId: 'teacher-001'
      }
    },
    {
      assignmentId: assignmentIds['Anatomy Midterm'],
      courseId: courseIds['ANAT101'],
      studentId: 'student-002',
      fileUrl: 'https://example.com/anatomy_midterm_2.pdf',
      submittedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
      grade: {
        points: 142,
        percent: 95,
        feedback: 'Excellent comprehensive knowledge demonstrated across all sections.',
        gradedAt: Date.now() - (6 * 60 * 60 * 1000),
        graderId: 'teacher-001'
      }
    },
    
    // PHYS102 - Cardiovascular Physiology Report
    {
      assignmentId: assignmentIds['Cardiovascular Physiology Report'],
      courseId: courseIds['PHYS102'],
      studentId: 'student-001',
      fileUrl: 'https://example.com/physio_report_1.pdf',
      submittedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
      grade: {
        points: 88,
        percent: 88,
        feedback: 'Good analysis of data. Could strengthen explanation of regulatory mechanisms.',
        gradedAt: Date.now() - (12 * 60 * 60 * 1000),
        graderId: 'teacher-002'
      }
    },
    
    // PATH201 - Case Study: Myocardial Infarction
    {
      assignmentId: assignmentIds['Case Study: Myocardial Infarction'],
      courseId: courseIds['PATH201'],
      studentId: 'student-003',
      fileUrl: 'https://example.com/mi_case_1.pdf',
      submittedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
      grade: {
        points: 85,
        percent: 85,
        feedback: 'Good understanding of histopathology. Could improve clinical correlation analysis.',
        gradedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
        graderId: 'teacher-004'
      }
    },
    {
      assignmentId: assignmentIds['Case Study: Myocardial Infarction'],
      courseId: courseIds['PATH201'],
      studentId: 'student-004',
      fileUrl: 'https://example.com/mi_case_2.pdf',
      submittedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
      grade: {
        points: 92,
        percent: 92,
        feedback: 'Excellent analysis! Strong integration of histopathology with clinical findings.',
        gradedAt: Date.now() - (6 * 60 * 60 * 1000),
        graderId: 'teacher-004'
      }
    },
    
    // MED301 - Patient Presentation (Clinical)
    {
      assignmentId: assignmentIds['Patient Presentation'],
      courseId: courseIds['MED301'],
      studentId: 'student-006',
      fileUrl: 'https://example.com/patient_presentation_1.pdf',
      submittedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
      grade: {
        points: 88,
        percent: 88,
        feedback: 'Good patient presentation skills. Could improve differential diagnosis breadth.',
        gradedAt: Date.now() - (12 * 60 * 60 * 1000),
        graderId: 'teacher-001'
      }
    },
    
    // OBG506 - OB/GYN Case Study
    {
      assignmentId: assignmentIds['OB/GYN Case Study'],
      courseId: courseIds['OBG506'],
      studentId: 'student-012',
      fileUrl: 'https://example.com/obgyn_case_1.pdf',
      submittedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
      grade: {
        points: 92,
        percent: 92,
        feedback: 'Excellent case analysis with comprehensive diagnostic reasoning.',
        gradedAt: Date.now() - (1 * 24 * 60 * 60 * 1000),
        graderId: 'teacher-002'
      }
    },
    
    // CAR608 - Cardiac Procedures Report
    {
      assignmentId: assignmentIds['Cardiac Procedures Report'],
      courseId: courseIds['CAR608'],
      studentId: 'student-014',
      fileUrl: 'https://example.com/cardiac_procedures_1.pdf',
      submittedAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
      grade: {
        points: 95,
        percent: 95,
        feedback: 'Outstanding research and comprehensive coverage of cardiac procedures.',
        gradedAt: Date.now() - (2 * 24 * 60 * 60 * 1000),
        graderId: 'teacher-001'
      }
    },
    
    // RES710 - Research Proposal
    {
      assignmentId: assignmentIds['Research Proposal'],
      courseId: courseIds['RES710'],
      studentId: 'student-016',
      fileUrl: 'https://example.com/research_proposal_1.pdf',
      submittedAt: Date.now() - (4 * 24 * 60 * 60 * 1000),
      grade: {
        points: 88,
        percent: 88,
        feedback: 'Strong research proposal with clear methodology and objectives.',
        gradedAt: Date.now() - (3 * 24 * 60 * 60 * 1000),
        graderId: 'teacher-003'
      }
    },
    
    // CAP1018 - Capstone Research Paper
    {
      assignmentId: assignmentIds['Capstone Research Paper'],
      courseId: courseIds['CAP1018'],
      studentId: 'student-024',
      fileUrl: 'https://example.com/capstone_paper_1.pdf',
      submittedAt: Date.now() - (5 * 24 * 60 * 60 * 1000),
      grade: {
        points: 175,
        percent: 88,
        feedback: 'Excellent capstone work demonstrating comprehensive medical knowledge.',
        gradedAt: Date.now() - (4 * 24 * 60 * 60 * 1000),
        graderId: 'admin-001'
      }
    }
  ];
  
  for (const submission of sampleSubmissions) {
    // Skip submissions with undefined assignmentId
    if (!submission.assignmentId) {
      console.log(`⚠️ Skipping submission for ${submission.studentId} - assignmentId is undefined`);
      continue;
    }
    
    await addDoc(collection(db, 'submissions'), {
      ...submission,
      submittedAt: serverTimestamp(),
      grade: {
        ...submission.grade,
        gradedAt: serverTimestamp()
      }
    });
    console.log(`✅ Created submission for ${submission.studentId} on ${submission.assignmentId}`);
  }
}

// Function to clear all seeded data (for testing)
export async function clearSeededData() {
  console.log('🧹 Clearing seeded data...');
  
  try {
    // Note: This is a destructive operation - use with caution
    // In production, you might want to add confirmation prompts
    
    const collections = ['users', 'courses', 'assignments', 'enrollments', 'classSessions', 'announcements', 'submissions'];
    
    for (const collectionName of collections) {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`✅ Cleared collection: ${collectionName}`);
    }
    
    console.log('🎉 All seeded data cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    throw error;
  }
}
