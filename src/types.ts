export type AssignmentType = "hw" | "quiz" | "midterm" | "final" | "presentation" | "homework";

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
  comments?: string;
  canResubmit?: boolean; // When true, teacher allows student to resubmit
  resubmissionNote?: string; // Optional note from teacher explaining why resubmission is allowed
  lastUpdatedAt?: number; // Track when submission was last updated
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
  instructor: string;
  description: string;
  ownerId: string;
  createdAt: number;
  // Grading system (optional extensions)
  gradingMode?: 'per-assignment' | 'category';
  categoryWeights?: Partial<Record<AssignmentType, number>>; // weights must sum to 100
  gradingFinalized?: boolean; // when true, scheme is finalized for the term
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
  status?: 'active' | 'upcoming' | 'completed' | 'cancelled';
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
  courseId: string;
  studentId: string;
  date: string; // YYYY-MM-DD format
  status: "present" | "absent" | "late" | "excused";
  timestamp: number;
  notes?: string;
  markedBy?: string; // teacher/admin who marked attendance
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

// Time Tracking Types
export type TimeEntry = {
  id?: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  clockIn: number; // timestamp
  clockOut?: number; // timestamp (optional for active sessions)
  totalHours?: number; // calculated total hours for the day
  isManual?: boolean; // true if manually entered
  notes?: string;
  createdAt: number;
  updatedAt: number;
  updatedBy?: string; // for admin edits
};

export type TimeCardSession = {
  id?: string;
  userId: string;
  startTime: number;
  endTime?: number;
  isActive: boolean;
  totalHours?: number;
};

export type MonthlyReport = {
  userId: string;
  userName: string;
  month: string; // YYYY-MM format
  year: number;
  totalHours: number;
  dailyEntries: TimeEntry[];
  generatedAt: number;
};

export type TimeTrackingStats = {
  todayHours: number;
  weekHours: number;
  monthHours: number;
  averageDailyHours: number;
  currentSession?: TimeCardSession;
};


