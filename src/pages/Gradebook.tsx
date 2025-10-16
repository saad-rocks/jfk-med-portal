import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, updateDoc, doc, addDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs } from "../components/ui/tabs";
import { 
  BookOpen, 
  Calculator, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Download,
  Upload,
  BarChart3,
  Target,
  Users,
  GraduationCap,
  Stethoscope,
  Microscope,
  Heart,
  Brain,
  Eye,
  Activity
} from "lucide-react";
import type { Assignment, Submission, User, Course } from "../types";

interface GradebookStudent {
  id: string;
  name: string;
  studentId: string;
  email: string;
  mdYear: string;
  gpa: number;
  assignments: AssignmentGrade[];
  overallGrade: string;
  overallPercentage: number;
  totalPoints: number;
  maxPoints: number;
  attendance: number;
  clinicalPerformance: number;
  professionalism: number;
}

interface AssignmentGrade {
  assignmentId: string;
  title: string;
  type: string;
  points: number;
  maxPoints: number;
  percentage: number;
  weight: number;
  status: 'graded' | 'submitted' | 'not-submitted' | 'overdue';
  submittedAt?: number;
  gradedAt?: number | null;
  feedback?: string | null;
}

interface GradebookStats {
  totalStudents: number;
  averageGPA: number;
  averageGrade: number;
  passingRate: number;
  topPerformers: number;
  needsAttention: number;
}

export default function Gradebook() {
  const { courseId } = useParams<{ courseId: string }>();
  const { role, loading: roleLoading } = useRole();
  const [students, setStudents] = useState<GradebookStudent[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'gpa' | 'grade' | 'attendance'>('grade');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (courseId) {
      fetchGradebookData();
      
      // Add a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 10000); // 10 seconds timeout
      
      return () => clearTimeout(timeoutId);
    } else {
      setLoading(false);
    }
  }, [courseId]);

  const fetchGradebookData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      if (courseId) {
        try {
          const courseDoc = await getDoc(doc(db, 'courses', courseId));
          if (courseDoc.exists()) {
            const courseData = { ...courseDoc.data(), id: courseDoc.id } as Course;
            setCourse(courseData);
          } else {
          }
        } catch (error) {
        }
      }

      // Fetch assignments
      let assignmentsData: Assignment[] = [];
      try {
        const assignmentsQuery = query(collection(db, 'assignments'), where('courseId', '==', courseId));
        const assignmentsSnapshot = await getDocs(assignmentsQuery);
        assignmentsData = assignmentsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Assignment));
        setAssignments(assignmentsData);
        if (assignmentsData.length > 0) {
        }
      } catch (error) {
        setAssignments([]);
      }

      // Fetch enrollments and students
      let studentIds: string[] = [];
      try {
        const enrollmentsQuery = query(collection(db, 'enrollments'), where('courseId', '==', courseId));
        const enrollmentsSnapshot = await getDocs(enrollmentsQuery);
        
        studentIds = enrollmentsSnapshot.docs.map(doc => doc.data().studentId);
      } catch (error) {
        setStudents([]);
        return;
      }
      
      // Fetch student details
      if (studentIds.length === 0) {
        setStudents([]);
        return;
      }
      
      let studentsSnapshot;
      try {
        // Since studentIds contains the uid values (like 'student-001'), we can query by uid
        const studentsQuery = query(collection(db, 'users'), where('uid', 'in', studentIds));
        studentsSnapshot = await getDocs(studentsQuery);
        if (studentsSnapshot.docs.length > 0) {
        }
      } catch (error) {
        setStudents([]);
        return;
      }
      
      // Fetch submissions for all students
      let submissions: Submission[] = [];
      try {
        const submissionsQuery = query(collection(db, 'submissions'), where('courseId', '==', courseId));
        const submissionsSnapshot = await getDocs(submissionsQuery);
        submissions = submissionsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Submission));
        if (submissions.length > 0) {
        } else {
          // Let's check what submissions exist in the database
          const allSubmissionsQuery = query(collection(db, 'submissions'));
          const allSubmissionsSnapshot = await getDocs(allSubmissionsQuery);
          const allSubmissions = allSubmissionsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Submission));
        }
      } catch (error) {
        submissions = [];
      }

      // Build gradebook data
      const gradebookStudents: GradebookStudent[] = studentsSnapshot.docs.map(studentDoc => {
        const studentData = studentDoc.data() as User;
        
        // Ensure student has required fields
        if (!studentData.uid || !studentData.name || !studentData.email) {
          return null;
        }
        
        // Use the student's uid field to match with submissions (since both use the same values like 'student-001')
        const studentSubmissions = submissions.filter(sub => sub.studentId === studentData.uid);
        if (studentSubmissions.length > 0) {
        }
        
        const assignmentGrades: AssignmentGrade[] = assignmentsData.map(assignment => {
          const submission = studentSubmissions.find(sub => sub.assignmentId === assignment.id);
          
          // Ensure assignment has required fields
          if (!assignment.id || !assignment.title || !assignment.type || !assignment.maxPoints || !assignment.weight) {
            return null;
          }
          
          if (submission && submission.grade && submission.grade.points !== null) {
            return {
              assignmentId: assignment.id,
              title: assignment.title,
              type: assignment.type,
              points: submission.grade.points!,
              maxPoints: assignment.maxPoints,
              percentage: (submission.grade.points! / assignment.maxPoints) * 100,
              weight: assignment.weight,
              status: 'graded',
              submittedAt: submission.submittedAt,
              gradedAt: submission.grade.gradedAt,
              feedback: submission.grade.feedback
            };
          } else if (submission) {
            return {
              assignmentId: assignment.id,
              title: assignment.title,
              type: assignment.type,
              points: 0,
              maxPoints: assignment.maxPoints,
              percentage: 0,
              weight: assignment.weight,
              status: 'submitted'
            };
          } else {
            const now = Date.now();
            const isOverdue = assignment.dueAt < now;
            return {
              assignmentId: assignment.id,
              title: assignment.title,
              type: assignment.type,
              points: 0,
              maxPoints: assignment.maxPoints,
              percentage: 0,
              weight: assignment.weight,
              status: isOverdue ? 'overdue' : 'not-submitted'
            };
          }
        }).filter(Boolean) as AssignmentGrade[];

        const totalPoints = assignmentGrades.reduce((sum, grade) => sum + grade.points, 0);
        const maxPoints = assignmentGrades.reduce((sum, grade) => sum + grade.maxPoints, 0);
        const overallPercentage = maxPoints > 0 ? (totalPoints / maxPoints) * 100 : 0;
        
        // Calculate weighted grade
        const weightedGrade = assignmentGrades.reduce((sum, grade) => {
          if (grade.status === 'graded') {
            return sum + (grade.percentage * grade.weight / 100);
          }
          return sum;
        }, 0);

        // Mock clinical performance and professionalism scores (in real app, these would come from separate assessments)
        const clinicalPerformance = Math.floor(Math.random() * 30) + 70; // 70-100
        const professionalism = Math.floor(Math.random() * 20) + 80; // 80-100
        const attendance = Math.floor(Math.random() * 15) + 85; // 85-100

        const gradebookStudentData = {
          id: studentDoc.id, // Firestore document ID for internal use
          name: studentData.name,
          studentId: studentData.uid, // Use uid as studentId (like 'student-001')
          email: studentData.email,
          mdYear: studentData.mdYear || 'N/A',
          gpa: studentData.gpa || 0,
          assignments: assignmentGrades,
          overallGrade: getLetterGrade(weightedGrade),
          overallPercentage: weightedGrade,
          totalPoints,
          maxPoints,
          attendance,
          clinicalPerformance,
          professionalism
        };
        
        
        return gradebookStudentData;
      }).filter(Boolean) as GradebookStudent[];

      setStudents(gradebookStudents);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getLetterGrade = (percentage: number): string => {
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
  };

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800 border-green-200';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'graded': return 'bg-green-100 text-green-800 border-green-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'hw': return <BookOpen className="w-4 h-4" />;
      case 'midterm': return <Calculator className="w-4 h-4" />;
      case 'final': return <GraduationCap className="w-4 h-4" />;

      case 'presentation': return <Microscope className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'gpa':
          aValue = a.gpa;
          bValue = b.gpa;
          break;
        case 'grade':
          aValue = a.overallPercentage;
          bValue = b.overallPercentage;
          break;
        case 'attendance':
          aValue = a.attendance;
          bValue = b.attendance;
          break;
        default:
          aValue = a.overallPercentage;
          bValue = b.overallPercentage;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [students, searchQuery, sortBy, sortOrder]);

  const gradebookStats: GradebookStats = useMemo(() => {
    if (students.length === 0) return {
      totalStudents: 0,
      averageGPA: 0,
      averageGrade: 0,
      passingRate: 0,
      topPerformers: 0,
      needsAttention: 0
    };

    const totalStudents = students.length;
    const averageGPA = students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents;
    const averageGrade = students.reduce((sum, s) => sum + s.overallPercentage, 0) / totalStudents;
    const passingRate = (students.filter(s => s.overallPercentage >= 70).length / totalStudents) * 100;
    const topPerformers = students.filter(s => s.overallPercentage >= 90).length;
    const needsAttention = students.filter(s => s.overallPercentage < 70).length;

    return {
      totalStudents,
      averageGPA,
      averageGrade,
      passingRate,
      topPerformers,
      needsAttention
    };
  }, [students]);

  const exportGradebook = () => {
    const csvContent = [
      ['Student ID', 'Name', 'Email', 'MD Year', 'GPA', 'Overall Grade', 'Overall %', 'Total Points', 'Max Points', 'Attendance', 'Clinical Performance', 'Professionalism'],
      ...filteredAndSortedStudents.map(student => [
        student.studentId,
        student.name,
        student.email,
        student.mdYear,
        student.gpa.toString(),
        student.overallGrade,
        student.overallPercentage.toFixed(1),
        student.totalPoints.toString(),
        student.maxPoints.toString(),
        student.attendance.toString(),
        student.clinicalPerformance.toString(),
        student.professionalism.toString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gradebook-${course?.code || 'course'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading user role...</span>
        </div>
      </div>
    );
  }

  if (role !== 'teacher' && role !== 'admin') {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
          <p className="text-red-700">Only teachers and administrators can access the gradebook.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading gradebook...</span>
        </div>
      </div>
    );
  }

  if (!courseId) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800">No Course Selected</h3>
          <p className="text-yellow-700">Please select a course to view its gradebook.</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Course Not Found</h3>
          <p className="text-red-700">The requested course could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gradebook</h1>
          <p className="text-gray-600 mt-2">
            {course?.title} - {course?.code} • {course?.semester}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportGradebook}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Import Grades
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{gradebookStats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">{gradebookStats.averageGrade.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Passing Rate</p>
                <p className="text-2xl font-bold text-gray-900">{gradebookStats.passingRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-gray-900">{gradebookStats.needsAttention}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search students by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="grade">Sort by Grade</option>
              <option value="name">Sort by Name</option>
              <option value="gpa">Sort by GPA</option>
              <option value="attendance">Sort by Attendance</option>
            </select>
            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Gradebook Tabs */}
      <Tabs tabs={[
        {
          key: 'overview',
          label: 'Overview',
          content: (
            <div className="space-y-4">
              {filteredAndSortedStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-blue-600">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">ID: {student.studentId} • {student.mdYear}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-lg px-3 py-1 ${getGradeColor(student.overallGrade)}`}>
                          {student.overallGrade}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{student.overallPercentage.toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{student.gpa.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">GPA</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{student.attendance}%</div>
                        <div className="text-sm text-gray-600">Attendance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{student.clinicalPerformance}%</div>
                        <div className="text-sm text-gray-600">Clinical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{student.professionalism}%</div>
                        <div className="text-sm text-gray-600">Professional</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {student.assignments.filter(a => a.status === 'graded').length} of {student.assignments.length} assignments graded
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                      >
                        {selectedStudent === student.id ? 'Hide Details' : 'View Details'}
                      </Button>
                    </div>

                    {/* Assignment Details */}
                    {selectedStudent === student.id && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-3">Assignment Details</h4>
                        <div className="grid gap-2">
                          {student.assignments.map((assignment) => (
                            <div key={assignment.assignmentId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                {getAssignmentTypeIcon(assignment.type)}
                                <div>
                                  <p className="font-medium text-gray-900">{assignment.title}</p>
                                  <p className="text-sm text-gray-600">{assignment.type} • Weight: {assignment.weight}%</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={getStatusColor(assignment.status)}>
                                  {assignment.status.replace('-', ' ')}
                                </Badge>
                                {assignment.status === 'graded' && (
                                  <div className="text-right">
                                    <p className="font-medium">{assignment.points}/{assignment.maxPoints}</p>
                                    <p className="text-sm text-gray-600">{assignment.percentage.toFixed(1)}%</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        },
        {
          key: 'assignments',
          label: 'Assignment Analysis',
          content: (
            <div className="space-y-6">
              {assignments.map((assignment) => {
                const assignmentGrades = students.map(student => {
                  const grade = student.assignments.find(a => a.assignmentId === assignment.id);
                  return grade || null;
                }).filter(Boolean);

                const gradedCount = assignmentGrades.filter(g => g?.status === 'graded').length;
                const averageScore = assignmentGrades
                  .filter(g => g?.status === 'graded')
                  .reduce((sum, g) => sum + (g?.percentage || 0), 0) / Math.max(gradedCount, 1);

                return (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        {getAssignmentTypeIcon(assignment.type)}
                        <div>
                          <div>{assignment.title}</div>
                          <div className="text-sm font-normal text-gray-600">
                            {assignment.type} • {assignment.maxPoints} points • {assignment.weight}% weight
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{gradedCount}</div>
                          <div className="text-sm text-gray-600">Graded</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{averageScore.toFixed(1)}%</div>
                          <div className="text-sm text-gray-600">Average Score</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {((gradedCount / students.length) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">Completion Rate</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {assignmentGrades.map((grade, index) => {
                          if (!grade) return null;
                          const student = students[index];
                          return (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{student.name}</span>
                                <Badge className={getStatusColor(grade.status)}>
                                  {grade.status.replace('-', ' ')}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3">
                                {grade.status === 'graded' ? (
                                  <>
                                    <span className="font-medium">{grade.points}/{grade.maxPoints}</span>
                                    <Badge className={getGradeColor(getLetterGrade(grade.percentage))}>
                                      {grade.percentage.toFixed(1)}%
                                    </Badge>
                                  </>
                                ) : (
                                  <span className="text-gray-500">Not submitted</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )
        },
        {
          key: 'analytics',
          label: 'Analytics',
          content: (
            <div className="space-y-6">
              {/* Performance Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Grade Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {['A', 'B', 'C', 'D', 'F'].map((grade) => {
                      const count = students.filter(s => s.overallGrade.startsWith(grade)).length;
                      const percentage = (count / students.length) * 100;
                      return (
                        <div key={grade} className="text-center">
                          <div className={`text-2xl font-bold ${getGradeColor(grade).split(' ')[1]}`}>
                            {count}
                          </div>
                          <div className="text-sm text-gray-600">{grade}</div>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Clinical Performance vs Academic Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Clinical vs Academic Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-32 text-sm font-medium">{student.name}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-gray-600">Academic:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${student.overallPercentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{student.overallPercentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">Clinical:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${student.clinicalPerformance}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{student.clinicalPerformance}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Attendance Correlation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Attendance & Performance Correlation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {students.filter(s => s.attendance >= 90 && s.overallPercentage >= 80).length}
                      </div>
                      <div className="text-sm text-gray-600">High Attendance + High Performance</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {students.filter(s => s.attendance < 90 && s.overallPercentage >= 80).length}
                      </div>
                      <div className="text-sm text-gray-600">Low Attendance + High Performance</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {students.filter(s => s.attendance < 90 && s.overallPercentage < 80).length}
                      </div>
                      <div className="text-sm text-gray-600">Low Attendance + Low Performance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        }
      ]} />
    </div>
  );
}


