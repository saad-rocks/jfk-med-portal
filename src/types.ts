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


