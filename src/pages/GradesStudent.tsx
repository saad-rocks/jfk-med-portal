import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  type QueryDocumentSnapshot,
  type DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';
import { useRole } from '../hooks/useRole';
import { listAssignments } from '../lib/assignments';
import { listSubmissions } from '../lib/submissions';
import { getUserByUid } from '../lib/users';
import type { Assignment, Submission, Course, Enrollment } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Award,
  BookOpen,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  GraduationCap,
  FileText,
  BarChart3,
  Trophy,
  Star
} from 'lucide-react';

interface CourseGrade {
  course: Course;
  enrollment: Enrollment;
  assignments: (Assignment & { id: string })[];
  submissions: Submission[];
  overallGrade: number;
  completedAssignments: number;
  totalAssignments: number;
  weightedPoints: number;
  totalWeight: number;
  letterGrade: string;
}

interface AssignmentGrade {
  assignment: Assignment & { id: string };
  submission?: Submission;
  earnedPoints: number | null;
  maxPoints: number;
  percentage: number | null;
  weight: number;
  status: 'graded' | 'submitted' | 'missing';
}

export default function GradesStudent() {
  const navigate = useNavigate();
  const { role, user } = useRole();
  const [courseGrades, setCourseGrades] = useState<CourseGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  useEffect(() => {
    if (!user || role !== 'student') return;

    const fetchGrades = async () => {
      setLoading(true);

      try {
        const profile = await getUserByUid(user.uid).catch(() => null);
        const studentIdCandidates = Array.from(
          new Set(
            [profile?.id, profile?.uid, user.uid].filter(
              (value): value is string => Boolean(value)
            )
          )
        );

        if (studentIdCandidates.length === 0) {
          setCourseGrades([]);
          return;
        }

        const studentIdSet = new Set(studentIdCandidates);
        const enrollmentsRef = collection(db, 'enrollments');
        const enrollmentDocsMap = new Map<string, QueryDocumentSnapshot<DocumentData>>();

        for (const candidate of studentIdCandidates) {
          const snap = await getDocs(query(enrollmentsRef, where('studentId', '==', candidate)));
          snap.forEach((docSnap) => {
            enrollmentDocsMap.set(docSnap.id, docSnap);
          });
        }

        const enrollmentDocs = Array.from(enrollmentDocsMap.values());

        if (enrollmentDocs.length === 0) {
          setCourseGrades([]);
          return;
        }

        const grades: CourseGrade[] = [];

        for (const enrollDoc of enrollmentDocs) {
          const enrollment = { id: enrollDoc.id, ...enrollDoc.data() } as Enrollment;

          if (enrollment.status !== 'enrolled') continue;

          const courseDoc = await getDoc(doc(db, 'courses', enrollment.courseId));
          if (!courseDoc.exists()) continue;

          const course = { id: courseDoc.id, ...courseDoc.data() } as Course;

          const assignments = await listAssignments(enrollment.courseId);

          const allSubmissions: Submission[] = [];
          for (const assignment of assignments) {
            try {
              const subs = await listSubmissions(assignment.id!);
              const userSubmissions = subs.filter((s) => studentIdSet.has(s.studentId));
              allSubmissions.push(...userSubmissions);
            } catch (error) {
            }
          }

          let weightedPoints = 0;
          let totalWeight = 0;
          let completedAssignments = 0;

          for (const assignment of assignments) {
            const submission = allSubmissions.find(s => s.assignmentId === assignment.id);

            if (submission && submission.grade.points !== null && submission.grade.gradedAt) {
              completedAssignments++;
              const percentage = (submission.grade.points / assignment.maxPoints) * 100;
              const weight = Number(assignment.weight || 0);

              const normalizedWeight = weight > 1 ? weight : weight * 100;

              weightedPoints += (percentage * normalizedWeight);
              totalWeight += normalizedWeight;
            }
          }

          const overallGrade = totalWeight > 0 ? weightedPoints / totalWeight : 0;
          const letterGrade = calculateLetterGrade(overallGrade);

          grades.push({
            course,
            enrollment,
            assignments,
            submissions: allSubmissions,
            overallGrade,
            completedAssignments,
            totalAssignments: assignments.length,
            weightedPoints,
            totalWeight,
            letterGrade
          });
        }

        grades.sort((a, b) => a.course.title.localeCompare(b.course.title));
        setCourseGrades(grades);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user, role]);

  const overallStats = useMemo(() => {
    if (courseGrades.length === 0) return { gpa: 0, totalCredits: 0, completionRate: 0 };

    let totalPoints = 0;
    let totalCourses = 0;
    let totalCredits = 0;
    let totalAssignments = 0;
    let completedAssignments = 0;

    courseGrades.forEach(cg => {
      totalPoints += cg.overallGrade;
      totalCourses++;
      totalCredits += cg.course.credits || 0;
      totalAssignments += cg.totalAssignments;
      completedAssignments += cg.completedAssignments;
    });

    const gpa = totalCourses > 0 ? (totalPoints / totalCourses) / 25 : 0; // Convert to 4.0 scale
    const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

    return {
      gpa: Math.min(4.0, Math.max(0, gpa)),
      totalCredits,
      completionRate
    };
  }, [courseGrades]);

  const getAssignmentGrades = (courseGrade: CourseGrade): AssignmentGrade[] => {
    return courseGrade.assignments.map(assignment => {
      const submission = courseGrade.submissions.find(s => s.assignmentId === assignment.id);

      let status: 'graded' | 'submitted' | 'missing' = 'missing';
      let earnedPoints: number | null = null;
      let percentage: number | null = null;

      if (submission) {
        if (submission.grade.gradedAt && submission.grade.points !== null) {
          status = 'graded';
          earnedPoints = submission.grade.points;
          percentage = (earnedPoints / assignment.maxPoints) * 100;
        } else {
          status = 'submitted';
        }
      }

      return {
        assignment,
        submission,
        earnedPoints,
        maxPoints: assignment.maxPoints,
        percentage,
        weight: Number(assignment.weight || 0),
        status
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading your grades...</span>
        </div>
      </div>
    );
  }

  if (role !== 'student') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
          <p className="text-red-700">Only students can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
          <p className="text-gray-600 mt-2">
            View your academic performance across all courses
          </p>
        </div>
        <Trophy className="h-12 w-12 text-yellow-500" />
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Overall GPA</p>
                <p className="text-4xl font-bold text-blue-600">
                  {overallStats.gpa.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">out of 4.0</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-full">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Completion Rate</p>
                <p className="text-4xl font-bold text-green-600">
                  {overallStats.completionRate.toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">assignments graded</p>
              </div>
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Credits</p>
                <p className="text-4xl font-bold text-purple-600">
                  {overallStats.totalCredits}
                </p>
                <p className="text-xs text-gray-500 mt-1">credit hours</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-full">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Grades */}
      {courseGrades.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">
              You are not enrolled in any courses yet.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate('/courses')}
            >
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {courseGrades.map((courseGrade) => {
            const assignmentGrades = getAssignmentGrades(courseGrade);
            const isExpanded = expandedCourse === courseGrade.course.id;

            return (
              <Card key={courseGrade.course.id} className="overflow-hidden border hover:shadow-lg transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader className="border-b border-blue-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900">
                            {courseGrade.course.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">
                            {courseGrade.course.code} • {courseGrade.course.credits} Credits • Instructor: {courseGrade.course.instructor}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-blue-600">
                            {courseGrade.overallGrade.toFixed(1)}%
                          </span>
                          <Badge className={`${getGradeColor(courseGrade.letterGrade)} text-lg font-bold px-3 py-1`}>
                            {courseGrade.letterGrade}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {courseGrade.completedAssignments} of {courseGrade.totalAssignments} graded
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedCourse(isExpanded ? null : courseGrade.course.id)}
                      >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>
                  </div>

                  {/* Course Stats Bar */}
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Avg Score</p>
                        <p className="text-sm font-semibold text-gray-900">{courseGrade.overallGrade.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500">Completed</p>
                        <p className="text-sm font-semibold text-gray-900">{courseGrade.completedAssignments}/{courseGrade.totalAssignments}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="text-xs text-gray-500">Pending</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {assignmentGrades.filter(a => a.status === 'submitted').length}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-xs text-gray-500">Missing</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {assignmentGrades.filter(a => a.status === 'missing').length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="p-6">
                    {assignmentGrades.length === 0 ? (
                      <div className="text-center py-8 bg-white rounded-lg">
                        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-600">No assignments in this course yet</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assignment</th>
                              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Weight</th>
                              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Score</th>
                              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Percentage</th>
                              <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {assignmentGrades.map((ag) => (
                              <tr key={ag.assignment.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium text-gray-900">{ag.assignment.title}</span>
                                  </div>
                                  {ag.submission?.grade.feedback && (
                                    <p className="text-xs text-gray-500 mt-1 ml-6">
                                      Feedback: {ag.submission.grade.feedback}
                                    </p>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Badge className={getAssignmentTypeColor(ag.assignment.type)}>
                                    {getAssignmentTypeLabel(ag.assignment.type)}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className="text-sm text-gray-700">{ag.weight}%</span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {ag.status === 'graded' ? (
                                    <span className="font-semibold text-gray-900">
                                      {ag.earnedPoints?.toFixed(1)} / {ag.maxPoints}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  {ag.status === 'graded' && ag.percentage !== null ? (
                                    <div className="flex items-center justify-center gap-2">
                                      <span className={`font-bold ${getPercentageColor(ag.percentage)}`}>
                                        {ag.percentage.toFixed(1)}%
                                      </span>
                                      {ag.percentage >= 90 && <Star className="h-4 w-4 text-yellow-500" />}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">—</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Badge className={getStatusColor(ag.status)}>
                                    {getStatusLabel(ag.status)}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                            <tr>
                              <td colSpan={2} className="py-3 px-4 font-bold text-gray-900">
                                Course Total
                              </td>
                              <td className="py-3 px-4 text-center font-semibold text-gray-700">
                                {courseGrade.totalWeight.toFixed(0)}%
                              </td>
                              <td colSpan={2} className="py-3 px-4 text-center">
                                <span className="text-lg font-bold text-blue-600">
                                  {courseGrade.overallGrade.toFixed(1)}%
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Badge className={`${getGradeColor(courseGrade.letterGrade)} font-bold`}>
                                  {courseGrade.letterGrade}
                                </Badge>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Helper functions
function calculateLetterGrade(percentage: number): string {
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}

function getGradeColor(letter: string): string {
  if (letter.startsWith('A')) return 'bg-green-100 text-green-700 border-green-200';
  if (letter.startsWith('B')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (letter.startsWith('C')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  if (letter.startsWith('D')) return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

function getPercentageColor(percentage: number): string {
  if (percentage >= 90) return 'text-green-600';
  if (percentage >= 80) return 'text-blue-600';
  if (percentage >= 70) return 'text-yellow-600';
  if (percentage >= 60) return 'text-orange-600';
  return 'text-red-600';
}

function getAssignmentTypeColor(type: string): string {
  switch (type) {
    case 'hw': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'quiz': return 'bg-green-100 text-green-700 border-green-200';
    case 'midterm': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'final': return 'bg-red-100 text-red-700 border-red-200';
    case 'presentation': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getAssignmentTypeLabel(type: string): string {
  switch (type) {
    case 'hw': return 'Homework';
    case 'quiz': return 'Quiz';
    case 'midterm': return 'Midterm';
    case 'final': return 'Final';
    case 'presentation': return 'Presentation';
    case 'homework': return 'Homework';
    default: return type;
  }
}

function getStatusColor(status: 'graded' | 'submitted' | 'missing'): string {
  switch (status) {
    case 'graded': return 'bg-green-100 text-green-700 border-green-200';
    case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'missing': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getStatusLabel(status: 'graded' | 'submitted' | 'missing'): string {
  switch (status) {
    case 'graded': return 'Graded';
    case 'submitted': return 'Submitted';
    case 'missing': return 'Missing';
    default: return 'Unknown';
  }
}
