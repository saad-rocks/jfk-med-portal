import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { listAssignments } from "../lib/assignments";
import { getTeacherAssignments } from "../lib/teacherAssignments";
import { getAllUsers } from "../lib/users";
import { getSubmissionForStudent, listSubmissions } from "../lib/submissions";
import { listCourses } from "../lib/courses";
// Assignment modals moved to routed pages
import type { Assignment, Submission, Course, User } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
// // import { MedicalModal } from "../components/ui/medical-modal";
import { Plus, FileText, Calendar, Users, BookOpen, X, Target, Award, Clock, AlertTriangle, Bell, CheckCircle, TrendingUp, AlertCircle, Filter, Eye, Upload, GraduationCap, User as UserIcon, Edit, ClipboardCheck } from "lucide-react";

interface EnrichedAssignment extends Assignment {
  id: string;
  submission?: Submission | null;
  course?: Course;
  instructor?: User;
  // Teacher-specific fields
  submissionCount?: number;
  needsGradingCount?: number;
  totalEnrolled?: number;
}

export default function Assignments() {
  const navigate = useNavigate();
  const { role, user } = useRole();
  const [assignments, setAssignments] = useState<EnrichedAssignment[]>([]);
  const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Filtering and search - role-specific filter types
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'overdue' | 'past' | 'submitted' | 'graded' | 'needsGrading' | 'active'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    if (!user) return;

    try {
      if (role === 'teacher') {
        // For teachers, get their Firestore document ID first
        const allUsers = await getAllUsers();
        const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
        
        if (!currentUser?.id) {
          setTeacherCourses([]);
          setAssignments([]);
          setLoading(false);
          return;
        }

        // Get teacher assignments using the Firestore document ID
        const teacherAssignments = await getTeacherAssignments(currentUser.id);
        setTeacherCourses(teacherAssignments);

        // Get all assignments for teacher's courses with submission data
        const allAssignments: EnrichedAssignment[] = [];
        const allCourses = await listCourses();

        for (const course of teacherAssignments) {
          const courseAssignments = await listAssignments(course.courseId);

          // Get course data
          const courseData = allCourses.find(c => c.id === course.courseId);

          // Get enrolled student count for the course
          const enrollmentsQuery = query(
            collection(db, "enrollments"),
            where("courseId", "==", course.courseId),
            where("status", "==", "enrolled")
          );
          const enrollmentsSnap = await getDocs(enrollmentsQuery);
          const totalEnrolled = enrollmentsSnap.size;

          // Enrich with course data and submission counts
          for (const assignment of courseAssignments) {
            // Get all submissions for this assignment
            const submissions = await listSubmissions(assignment.id!);
            const needsGrading = submissions.filter(s => !s.grade?.gradedAt).length;

            const enrichedAssignment: EnrichedAssignment = {
              ...assignment,
              id: assignment.id!,
              course: courseData,
              submissionCount: submissions.length,
              needsGradingCount: needsGrading,
              totalEnrolled
            };
            allAssignments.push(enrichedAssignment);
          }
        }
        setAssignments(allAssignments);
      } else if (role === 'student') {
        // For students, get their Firestore document ID first
        const studentUsers = await getAllUsers();
        const currentUser = studentUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());

        if (!currentUser?.id) {
          setAssignments([]);
          setLoading(false);
          return;
        }

        // Get courses they're enrolled in and assignments
        const enrollmentsQuery = query(
          collection(db, "enrollments"),
          where("studentId", "==", currentUser.id),
          where("status", "==", "enrolled")
        );
        const enrollmentsSnap = await getDocs(enrollmentsQuery);
        const enrolledCourseIds = enrollmentsSnap.docs.map(doc => doc.data().courseId);


        // Get assignments for all enrolled courses with enriched data
        const allAssignments: EnrichedAssignment[] = [];
        const allCourses = await listCourses();

        for (const courseId of enrolledCourseIds) {
          const courseAssignments = await listAssignments(courseId);

          // Get course data
          const courseData = allCourses.find(c => c.id === courseId);

          // Get instructor data from studentUsers (which contains UserProfile type)
          let instructorData: User | undefined;
          if (courseData?.instructor) {
            const instructorProfile = studentUsers.find(u => u.name === courseData.instructor);
            // Convert UserProfile to User type if needed
            if (instructorProfile) {
              instructorData = {
                id: instructorProfile.id,
                uid: instructorProfile.uid,
                name: instructorProfile.name,
                email: instructorProfile.email,
                role: instructorProfile.role,
                status: instructorProfile.status,
                createdAt: typeof instructorProfile.createdAt === 'number'
                  ? instructorProfile.createdAt
                  : instructorProfile.createdAt instanceof Date
                  ? instructorProfile.createdAt.getTime()
                  : Date.now()
              } as User;
            }
          }

          // Enrich each assignment with submission status, course, and instructor data
          for (const assignment of courseAssignments) {
            // IMPORTANT: Use user.uid (Firebase Auth UID) not currentUser.id (Firestore doc ID)
            // because submissions are saved with user.uid
            const submission = await getSubmissionForStudent(assignment.id!, user.uid);

            const enrichedAssignment: EnrichedAssignment = {
              ...assignment,
              id: assignment.id!,
              submission: submission || undefined, // Ensure null becomes undefined
              course: courseData,
              instructor: instructorData
            };
            allAssignments.push(enrichedAssignment);
          }
        }
        setAssignments(allAssignments);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, user]);

  // Refetch data when user navigates back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [role, user]);

  // Filter and sort assignments - role-specific logic
  const filteredAssignments = assignments.filter(assignment => {
    const now = new Date();
    const dueDate = new Date(assignment.dueAt);
    const isOverdue = dueDate < now;
    const isDueSoon = !isOverdue && (dueDate.getTime() - now.getTime()) <= (3 * 24 * 60 * 60 * 1000); // 3 days

    // Student-specific checks
    const isSubmitted = !!assignment.submission;
    const isGraded = assignment.submission?.grade?.gradedAt != null;

    // Teacher-specific checks
    const hasNeedsGrading = (assignment.needsGradingCount ?? 0) > 0;
    const isPastDue = dueDate < now;
    const isActive = dueDate >= now;

    // Filter by type - role-specific
    if (role === 'teacher') {
      switch (filterType) {
        case 'needsGrading':
          if (!hasNeedsGrading) return false;
          break;
        case 'active':
          if (!isActive) return false;
          break;
        case 'past':
          if (!isPastDue) return false;
          break;
        case 'upcoming':
          if (!isDueSoon || !isActive) return false;
          break;
        default: // 'all'
          break;
      }
    } else {
      // Student filters
      switch (filterType) {
        case 'upcoming':
          if (isOverdue || isSubmitted) return false;
          break;
        case 'overdue':
          if (!isOverdue || isSubmitted) return false;
          break;
        case 'past':
          if (!isOverdue && !isSubmitted && !isGraded) return false;
          break;
        case 'submitted':
          if (!isSubmitted || isGraded) return false;
          break;
        case 'graded':
          if (!isGraded) return false;
          break;
        default: // 'all'
          break;
      }
    }

    // Search filter
    if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !assignment.instructions.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort by due date, but prioritize overdue assignments
    const now = new Date();
    const aDue = new Date(a.dueAt);
    const bDue = new Date(b.dueAt);
    const aOverdue = aDue < now;
    const bOverdue = bDue < now;

    // For teachers, prioritize by needs grading
    if (role === 'teacher') {
      const aNeedsGrading = (a.needsGradingCount ?? 0) > 0;
      const bNeedsGrading = (b.needsGradingCount ?? 0) > 0;

      if (aNeedsGrading && !bNeedsGrading) return -1;
      if (!aNeedsGrading && bNeedsGrading) return 1;
    }

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    return aDue.getTime() - bDue.getTime();
  });

  // Statistics - role-specific
  const getAssignmentStats = () => {
    const now = new Date();

    if (role === 'teacher') {
      const stats = {
        total: assignments.length,
        needsGrading: 0,
        totalSubmissions: 0,
        active: 0,
        pastDue: 0,
        upcoming: 0
      };

      assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueAt);
        const isDueSoon = (dueDate.getTime() - now.getTime()) <= (7 * 24 * 60 * 60 * 1000) && dueDate >= now;

        stats.needsGrading += assignment.needsGradingCount ?? 0;
        stats.totalSubmissions += assignment.submissionCount ?? 0;

        if (dueDate >= now) {
          stats.active++;
        } else {
          stats.pastDue++;
        }

        if (isDueSoon) {
          stats.upcoming++;
        }
      });

      return stats;
    } else {
      // Student stats
      const stats = {
        total: assignments.length,
        upcoming: 0,
        overdue: 0,
        completed: 0,
        submitted: 0,
        graded: 0
      };

      assignments.forEach(assignment => {
        const dueDate = new Date(assignment.dueAt);
        const isSubmitted = !!assignment.submission;
        const isGraded = assignment.submission?.grade?.gradedAt != null;

        // Count graded assignments
        if (isGraded) {
          stats.graded++;
          stats.completed++;
        }
        // Count submitted but not graded
        else if (isSubmitted) {
          stats.submitted++;
          stats.completed++;
        }
        // Count overdue and not submitted
        else if (dueDate < now) {
          stats.overdue++;
        }
        // Count upcoming (due within 7 days and not submitted)
        else if ((dueDate.getTime() - now.getTime()) <= (7 * 24 * 60 * 60 * 1000)) {
          stats.upcoming++;
        }
      });

      return stats;
    }
  };

  const stats = getAssignmentStats() as any; // Type union makes accessing properties complex, using any for stats

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'hw': return 'bg-medical-100 text-medical-700 border-medical-200';
      case 'quiz': return 'bg-vital-100 text-vital-700 border-vital-200';
      case 'midterm': return 'bg-alert-100 text-alert-700 border-alert-200';
      case 'final': return 'bg-critical-100 text-critical-700 border-critical-200';

      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getAssignmentTypeLabel = (type: string) => {
    switch (type) {
      case 'hw': return 'Homework';
      case 'quiz': return 'Quiz';
      case 'midterm': return 'Midterm';
      case 'final': return 'Final';

      default: return type;
    }
  };

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'hw': return BookOpen;
      case 'quiz': return Target;
      case 'midterm': return Award;
      case 'final': return Award;

      default: return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-medical-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-600 text-lg">Loading assignments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {role === 'teacher' ? '📋 Assignment Hub' : '📚 My Assignment Center'}
          </h1>
          <p className="text-slate-600 mt-2">
            {role === 'teacher'
              ? 'Manage assignments across all your courses'
              : 'Track and submit assignments from all your courses'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <TrendingUp size={14} className="mr-1" />
            {stats.total} Total
          </Badge>
          {role === 'teacher' && (
            <Button
              className="flex items-center gap-2 bg-medical-600 hover:bg-medical-700"
              onClick={() => navigate("/assignments/new")}
            >
              <Plus size={16} />
              Create Assignment
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats Dashboard - Role-Specific */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {role === 'teacher' ? (
          <>
            {/* Teacher Stats */}
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Needs Grading</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.needsGrading}</p>
                  </div>
                  <ClipboardCheck className="h-8 w-8 text-orange-500" />
                </div>
                {stats.needsGrading > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => setFilterType('needsGrading')}
                  >
                    Review Submissions
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalSubmissions}</p>
                  </div>
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Across all assignments
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full border-green-200 text-green-600 hover:bg-green-50"
                  onClick={() => setFilterType('active')}
                >
                  View Active
                </Button>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-slate-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Past Due</p>
                    <p className="text-2xl font-bold text-slate-600">{stats.pastDue}</p>
                  </div>
                  <FileText className="h-8 w-8 text-slate-500" />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full border-slate-200 text-slate-600 hover:bg-slate-50"
                  onClick={() => setFilterType('past')}
                >
                  View Past Due
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Student Stats */}
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                {stats.overdue > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => setFilterType('overdue')}
                  >
                    View Overdue
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Due Soon</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.upcoming}</p>
                  </div>
                  <Bell className="h-8 w-8 text-yellow-500" />
                </div>
                {stats.upcoming > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                    onClick={() => setFilterType('upcoming')}
                  >
                    View Upcoming
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Submitted</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
                  </div>
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => setFilterType('submitted')}
                >
                  View Submitted
                </Button>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Graded</p>
                    <p className="text-2xl font-bold text-green-600">{stats.graded}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full border-green-200 text-green-600 hover:bg-green-50"
                  onClick={() => setFilterType('graded')}
                >
                  View Graded
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Quick Filters - Role-Specific */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filterType === 'all' && !searchQuery ? 'primary' : 'outline'}
          size="sm"
          onClick={() => {
            setFilterType('all');
            setSearchQuery('');
          }}
          className="flex items-center gap-1"
        >
          <FileText size={14} />
          All Assignments ({stats.total})
        </Button>

        {role === 'teacher' ? (
          <>
            <Button
              variant={filterType === 'needsGrading' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('needsGrading')}
              className="flex items-center gap-1 bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              <ClipboardCheck size={14} />
              Needs Grading ({stats.needsGrading})
            </Button>

            <Button
              variant={filterType === 'active' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('active')}
              className="flex items-center gap-1"
            >
              <CheckCircle size={14} />
              Active ({stats.active})
            </Button>

            <Button
              variant={filterType === 'past' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('past')}
              className="flex items-center gap-1"
            >
              <FileText size={14} />
              Past Due ({stats.pastDue})
            </Button>

            <Button
              variant={filterType === 'upcoming' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('upcoming')}
              className="flex items-center gap-1"
            >
              <Bell size={14} />
              Due Soon ({stats.upcoming})
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={filterType === 'upcoming' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('upcoming')}
              className="flex items-center gap-1"
            >
              <Bell size={14} />
              Due Soon ({stats.upcoming})
            </Button>

            <Button
              variant={filterType === 'overdue' ? 'danger' : 'outline'}
              size="sm"
              onClick={() => setFilterType('overdue')}
              className="flex items-center gap-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              <AlertTriangle size={14} />
              Overdue ({stats.overdue})
            </Button>

            <Button
              variant={filterType === 'submitted' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('submitted')}
              className="flex items-center gap-1"
            >
              <Upload size={14} />
              Submitted ({stats.submitted})
            </Button>

            <Button
              variant={filterType === 'graded' ? 'success' : 'outline'}
              size="sm"
              onClick={() => setFilterType('graded')}
              className="flex items-center gap-1"
            >
              <CheckCircle size={14} />
              Graded ({stats.graded})
            </Button>
          </>
        )}
      </div>

      {/* Teacher Course Overview */}
      {role === 'teacher' && teacherCourses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <BookOpen size={20} className="text-medical-600" />
            Your Teaching Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-all duration-200 border border-slate-200/60 bg-white/95">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-medical-100 to-health-100 rounded-xl">
                        <BookOpen size={20} className="text-medical-600" />
                      </div>
                      <span className="text-lg font-bold text-slate-800">{course.courseCode}</span>
                    </div>
                    <Badge variant="outline" className="bg-slate-50/80 border-slate-200/60 text-slate-700">
                      {course.semester}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">{course.courseTitle}</h3>
                    <p className="text-sm text-slate-600">Course ID: {course.courseId}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link to={`/courses/${course.courseId}/assignments/teacher`}>
                      <Button variant="outline" size="sm" className="w-full bg-white/80 border-slate-200/60 hover:bg-slate-50/80">
                        <FileText size={14} className="mr-2" />
                        View Assignments
                      </Button>
                    </Link>
                    <Link to={`/courses/${course.courseId}/assignments/teacher`}>
                      <Button size="sm" className="w-full bg-medical-600 hover:bg-medical-700">
                        <Plus size={14} className="mr-2" />
                        Add Assignment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <FileText size={20} className="text-medical-600" />
            {filterType === 'all' ? 'All Assignments' :
             filterType === 'upcoming' ? '📅 Upcoming Assignments' :
             filterType === 'overdue' ? '🚨 Overdue Assignments' :
             '✅ Past Assignments'} ({filteredAssignments.length})
          </h2>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
            />
            <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {assignments.length === 0 ? (
          <Card className="border border-slate-200/60 bg-white/95">
            <CardContent className="py-16 text-center">
              <div className="p-4 bg-slate-50/80 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FileText size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                {role === 'teacher' ? 'No assignments created yet' : 'No assignments available'}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                {role === 'teacher'
                  ? 'Start by creating your first assignment for a course using the button above.'
                  : 'Your instructors haven\'t posted any assignments yet.'
                }
              </p>
              {role === 'teacher' && teacherCourses.length === 0 && (
                <div className="mt-4 p-3 bg-critical-50/80 border border-critical-200/60 rounded-lg">
                  <p className="text-sm text-critical-700">
                    You need to be assigned to courses first. Contact an administrator.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAssignments.map((assignment) => {
              const IconComponent = getAssignmentTypeIcon(assignment.type);
              const now = new Date();
              const dueDate = new Date(assignment.dueAt);
              // Only mark as overdue if no submission exists
              const isOverdue = dueDate < now && !assignment.submission;
              const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isDueSoon = !isOverdue && daysUntilDue <= 3 && !assignment.submission;

              return (
                <Card key={assignment.id} className={`hover:shadow-lg transition-all duration-200 border-2 ${
                  isOverdue ? 'border-red-300 bg-red-50/50 shadow-red-100' :
                  isDueSoon ? 'border-yellow-300 bg-yellow-50/50 shadow-yellow-100' :
                  'border-slate-200 bg-white/95 hover:border-medical-300'
                }`}>
                  <CardContent className="p-6">
                    {/* Priority Alert for Overdue */}
                    {isOverdue && (
                      <div className="flex items-center gap-2 mb-4 p-2 bg-red-100 border border-red-200 rounded-lg">
                        <AlertTriangle size={16} className="text-red-600" />
                        <span className="text-sm font-medium text-red-800">⚠️ Overdue by {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}</span>
                      </div>
                    )}

                    {/* Due Soon Alert */}
                    {isDueSoon && !isOverdue && (
                      <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-100 border border-yellow-200 rounded-lg">
                        <Bell size={16} className="text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">
                          {daysUntilDue === 0 ? '⏰ Due today!' :
                           daysUntilDue === 1 ? '⏰ Due tomorrow!' :
                           `⏰ Due in ${daysUntilDue} days`}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-gradient-to-r from-medical-100 to-health-100 rounded-lg">
                            <IconComponent size={24} className="text-medical-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 leading-tight">
                              {assignment.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge className={`${getAssignmentTypeColor(assignment.type)} border font-medium`}>
                                {getAssignmentTypeLabel(assignment.type)}
                              </Badge>
                              {assignment.submission && (
                                <Badge className={`border ${
                                  assignment.submission.grade.gradedAt
                                    ? 'bg-green-100 text-green-700 border-green-200'
                                    : 'bg-blue-100 text-blue-700 border-blue-200'
                                }`}>
                                  {assignment.submission.grade.gradedAt ? (
                                    <>
                                      <CheckCircle size={12} className="mr-1" />
                                      Graded
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={12} className="mr-1" />
                                      Submitted
                                    </>
                                  )}
                                </Badge>
                              )}
                              <Badge className={`border ${
                                isOverdue ? 'bg-red-500 text-white' :
                                isDueSoon ? 'bg-yellow-500 text-white' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {isOverdue ? 'Overdue' :
                                 isDueSoon ? 'Due Soon' :
                                 'On Track'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 mb-4 leading-relaxed">{assignment.instructions}</p>

                        {/* Role-Specific Info Panels */}
                        {role === 'teacher' ? (
                          /* Teacher: Show submission statistics */
                          <div className="mb-4 grid grid-cols-2 gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 text-sm">
                                <Upload size={16} className="text-blue-600" />
                                <div>
                                  <span className="font-semibold text-blue-800">
                                    {assignment.submissionCount ?? 0} / {assignment.totalEnrolled ?? 0}
                                  </span>
                                  <p className="text-xs text-blue-600">Submissions Received</p>
                                </div>
                              </div>
                            </div>

                            <div className={`p-3 rounded-lg border ${
                              (assignment.needsGradingCount ?? 0) > 0
                                ? 'bg-orange-50 border-orange-200'
                                : 'bg-green-50 border-green-200'
                            }`}>
                              <div className="flex items-center gap-2 text-sm">
                                {(assignment.needsGradingCount ?? 0) > 0 ? (
                                  <>
                                    <ClipboardCheck size={16} className="text-orange-600" />
                                    <div>
                                      <span className="font-semibold text-orange-800">
                                        {assignment.needsGradingCount} Need Grading
                                      </span>
                                      <p className="text-xs text-orange-600">Pending Review</p>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle size={16} className="text-green-600" />
                                    <div>
                                      <span className="font-semibold text-green-800">All Graded</span>
                                      <p className="text-xs text-green-600">Up to date</p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            {assignment.course && (
                              <div className="col-span-2 flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                                <GraduationCap size={16} className="text-blue-600" />
                                <span className="font-medium text-slate-800">{assignment.course.code}</span>
                                <span className="text-slate-600">- {assignment.course.title}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Student: Show course/instructor and submission status */
                          <>
                            {(assignment.course || assignment.instructor) && (
                              <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                                {assignment.course && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <GraduationCap size={16} className="text-blue-600" />
                                    <span className="font-medium text-slate-800">{assignment.course.code}</span>
                                    <span className="text-slate-600">- {assignment.course.title}</span>
                                  </div>
                                )}
                                {assignment.instructor && (
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <UserIcon size={16} className="text-slate-500" />
                                    <span>Instructor: <span className="font-medium text-slate-800">{assignment.instructor.name}</span></span>
                                  </div>
                                )}
                              </div>
                            )}

                            {assignment.submission && (
                              <div className={`mb-4 p-3 rounded-lg border ${
                                assignment.submission.grade.gradedAt
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-blue-50 border-blue-200'
                              }`}>
                                <div className="flex items-center gap-2 text-sm">
                                  {assignment.submission.grade.gradedAt ? (
                                    <>
                                      <CheckCircle size={16} className="text-green-600" />
                                      <span className="font-medium text-green-800">
                                        Graded: {assignment.submission.grade.points}/{assignment.maxPoints} points
                                      </span>
                                      {assignment.submission.grade.feedback && (
                                        <span className="text-green-700">• {assignment.submission.grade.feedback}</span>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={16} className="text-blue-600" />
                                      <span className="font-medium text-blue-800">
                                        Submitted on {new Date(assignment.submission.submittedAt).toLocaleDateString()}
                                      </span>
                                      <span className="text-blue-700">• Pending review</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={16} className="text-medical-500" />
                            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                              Due: {new Date(assignment.dueAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Award size={16} className="text-alert-500" />
                            <span>{assignment.maxPoints} points</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Target size={16} className="text-vital-500" />
                            <span>Weight: {assignment.weight}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 ml-6">
                        {/* Primary Action Button - Role-Specific */}
                        {role === 'student' ? (
                          <Button
                            className={`flex items-center gap-2 font-medium ${
                              assignment.submission
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : isOverdue
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : isDueSoon
                                ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                            onClick={() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              navigate(`/assignments/${assignment.id}/submit`);
                            }}
                          >
                            {assignment.submission ? (
                              <>
                                <Eye size={16} />
                                View Submission
                              </>
                            ) : isOverdue ? (
                              <>
                                <AlertTriangle size={16} />
                                Submit Now
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                Submit Assignment
                              </>
                            )}
                          </Button>
                        ) : (
                          /* Teacher Actions */
                          <div className="flex flex-col gap-2">
                            <Button
                              className={`flex items-center gap-2 font-medium ${
                                (assignment.needsGradingCount ?? 0) > 0
                                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                  : 'bg-medical-600 hover:bg-medical-700 text-white'
                              }`}
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                navigate(`/courses/${assignment.courseId}/assignments/teacher`);
                              }}
                            >
                              {(assignment.needsGradingCount ?? 0) > 0 ? (
                                <>
                                  <ClipboardCheck size={16} />
                                  Grade Submissions ({assignment.needsGradingCount})
                                </>
                              ) : (
                                <>
                                  <Users size={16} />
                                  View Submissions ({assignment.submissionCount})
                                </>
                              )}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 text-slate-700 border-slate-200 hover:bg-slate-50"
                              onClick={() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                navigate(`/assignments/${assignment.id}/edit`);
                              }}
                            >
                              <Edit size={14} />
                              Edit Assignment
                            </Button>
                          </div>
                        )}

                        {/* Secondary Actions / Status */}
                        {role === 'student' && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                            {isOverdue ? (
                              <>
                                <AlertCircle size={12} className="text-red-600" />
                                Overdue
                              </>
                            ) : isDueSoon ? (
                              <>
                                <Bell size={12} className="text-yellow-600" />
                                Due Soon
                              </>
                            ) : (
                              <>
                                <CheckCircle size={12} className="text-green-600" />
                                Active
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}

      {/* Edit Assignment Modal */}

      {/* Assignment Submission Modal */}
    </div>
  );
}










