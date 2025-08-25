export type AssignmentType = "hw" | "quiz" | "midterm" | "final" | "osce";

export type Assignment = {
  id?: string;
  courseId: string;
  title: string;
  type: AssignmentType;
  dueAt: number; // ms epoch
  weight: number;
  maxPoints: number;
  instructions: string;
  attachments?: string[];
  ownerId: string;
  createdAt: number;
};

export type SubmissionGrade = {
  points: number | null;
  percent: number | null;
  feedback: string | null;
  gradedAt: number | null;
  graderId: string | null;
};

export type Submission = {
  id?: string;
  assignmentId: string;
  courseId: string;
  studentId: string;
  fileUrl: string;
  submittedAt: number;
  grade: SubmissionGrade;
};

export type Role = "admin" | "teacher" | "student";
export type MDYear = "MD-1" | "MD-2" | "MD-3" | "MD-4" | "MD-5" | "MD-6" | "MD-7" | "MD-8" | "MD-9" | "MD-10" | "MD-11";
export type UserStatus = "active" | "inactive" | "suspended";
export type AdminLevel = "super" | "regular";

export type User = {
  id?: string;
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  status: UserStatus;
  createdAt: number | Date;
  updatedAt: number | Date;
  
  // Student specific fields
  mdYear?: MDYear;
  studentId?: string;
  gpa?: number;
  enrollmentDate?: number | Date;
  
  // Teacher specific fields
  department?: string;
  specialization?: string;
  employeeId?: string;
  hireDate?: number | Date;
  
  // Admin specific fields
  adminLevel?: AdminLevel;
  permissions?: string[];
};

export type Course = {
  id: string; // Make id required since courses from database always have IDs
  code: string;
  title: string;
  credits: number;
  semester: string;
  capacity: number;
  instructor: string;
  description: string;
  ownerId: string;
  createdAt: number;
};

export type CourseInput = Omit<Course, 'id' | 'ownerId' | 'createdAt'>; // For creating new courses

export type EnrollmentStatus = "enrolled" | "dropped" | "completed";

export type Enrollment = {
  id?: string;
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  enrolledAt: number;
  droppedAt?: number;
  completedAt?: number;
  grade?: string;
  gpa?: number;
};

export type Session = {
  id?: string;
  courseId: string;
  title: string;
  description?: string;
  startTime: number;
  endTime: number;
  location?: string;
  instructorId: string;
  attendees?: string[];
  createdAt: number;
};

export type Announcement = {
  id?: string;
  title: string;
  content: string;
  authorId: string;
  courseId?: string;
  priority: "low" | "medium" | "high";
  publishedAt: number;
  expiresAt?: number;
};

export type Semester = {
  id?: string;
  name: string;
  startDate: number;
  endDate: number;
  isActive: boolean;
  academicYear: string;
};

export type AttendanceRecord = {
  id?: string;
  sessionId: string;
  studentId: string;
  status: "present" | "absent" | "late" | "excused";
  timestamp: number;
  notes?: string;
};

export type GradeRecord = {
  id?: string;
  studentId: string;
  courseId: string;
  assignmentId?: string;
  grade: string;
  points?: number;
  maxPoints?: number;
  percentage?: number;
  weight?: number;
  recordedAt: number;
  recordedBy: string;
};


