import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { listAssignments } from "../lib/assignments";
import { getSubmissionForStudent } from "../lib/submissions";
// import AssignmentSubmission from "../components/AssignmentSubmission";
import type { Assignment, Submission } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs } from "../components/ui/tabs";
// import { MedicalModal } from "../components/ui/medical-modal";
import {
  FileText,
  Calendar,
  Users,
  BookOpen,
  Eye,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  Download,
  Upload,
  Award,
  Target,
  TrendingUp,
  AlertTriangle,
  CalendarDays,
  CheckSquare,
  Zap
} from "lucide-react";

type AssignmentCategory = 'all' | 'quiz' | 'hw' | 'midterm' | 'final';
type AssignmentStatus = 'all' | 'not-started' | 'in-progress' | 'submitted' | 'graded' | 'overdue';

interface AssignmentWithSubmission extends Assignment {
  submission?: Submission | null;
  status: AssignmentStatus;
  daysUntilDue: number;
  isOverdue: boolean;
  isDueSoon: boolean;
}

export default function AssignmentsStudent() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { role, user } = useRole();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsWithSubmissions, setAssignmentsWithSubmissions] = useState<AssignmentWithSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  
  // Filters and search
  const [selectedCategory, setSelectedCategory] = useState<AssignmentCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<AssignmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAssignments = async () => {
    if (!courseId) return;

    try {
      const assignmentsData = await listAssignments(courseId);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    if (!user || !courseId) return;

    try {
      const assignmentsWithSubs: AssignmentWithSubmission[] = await Promise.all(
        assignments.map(async (assignment) => {
          try {
            const submission = await getSubmissionForStudent(assignment.id!, user.uid);
            const now = Date.now();
            const daysUntilDue = Math.ceil((assignment.dueAt - now) / (1000 * 60 * 60 * 24));
            // Only mark as overdue if no submission exists
            const isOverdue = assignment.dueAt < now && !submission;
            const isDueSoon = !isOverdue && daysUntilDue <= 3 && !submission;

            let status: AssignmentStatus = 'not-started';
            if (submission) {
              if (submission.grade.gradedAt) {
                status = 'graded';
              } else {
                status = 'submitted';
              }
            } else if (isOverdue) {
              status = 'overdue';
            } else if (isDueSoon) {
              status = 'in-progress';
            }

            return {
              ...assignment,
              submission,
              status,
              daysUntilDue,
              isOverdue,
              isDueSoon
            };
          } catch (error) {
            console.error(`Error fetching submission for assignment ${assignment.id}:`, error);
            const now = Date.now();
            const daysUntilDue = Math.ceil((assignment.dueAt - now) / (1000 * 60 * 60 * 24));
            // When error occurs, assume no submission for safety
            const isOverdue = assignment.dueAt < now;
            return {
              ...assignment,
              submission: null,
              status: isOverdue ? 'overdue' as AssignmentStatus : 'not-started' as AssignmentStatus,
              daysUntilDue,
              isOverdue,
              isDueSoon: !isOverdue && daysUntilDue <= 3
            };
          }
        })
      );

      setAssignmentsWithSubmissions(assignmentsWithSubs);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [courseId]);

  useEffect(() => {
    if (assignments.length > 0) {
      fetchSubmissions();
    }
  }, [assignments, user]);

  // Statistics and quick actions
  const assignmentStats = useMemo(() => {
    const total = assignmentsWithSubmissions.length;
    const completed = assignmentsWithSubmissions.filter(a => a.status === 'graded').length;
    const submitted = assignmentsWithSubmissions.filter(a => a.status === 'submitted').length;
    const overdue = assignmentsWithSubmissions.filter(a => a.status === 'overdue').length;
    const dueSoon = assignmentsWithSubmissions.filter(a => a.isDueSoon && !a.isOverdue).length;
    const notStarted = assignmentsWithSubmissions.filter(a => a.status === 'not-started').length;

    return { total, completed, submitted, overdue, dueSoon, notStarted };
  }, [assignmentsWithSubmissions]);

  // Filter and sort assignments
  const filteredAssignments = useMemo(() => {
    let filtered = assignmentsWithSubmissions.filter(assignment => {
      // Category filter
      if (selectedCategory !== 'all' && assignment.type !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && assignment.status !== selectedStatus) {
        return false;
      }

      // Search filter
      if (searchQuery && !assignment.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });

    // Sort by priority: overdue first, then due soon, then by due date
    filtered.sort((a, b) => {
      // Priority 1: Overdue assignments
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;

      // Priority 2: Due soon assignments
      if (a.isDueSoon && !b.isDueSoon && !a.isOverdue) return -1;
      if (!a.isDueSoon && b.isDueSoon && !b.isOverdue) return 1;

      // Priority 3: Sort by due date (earliest first)
      return a.dueAt - b.dueAt;
    });

    return filtered;
  }, [assignmentsWithSubmissions, selectedCategory, selectedStatus, searchQuery]);

  // Quick filter actions
  const setQuickFilter = (status: AssignmentStatus) => {
    setSelectedStatus(status);
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'hw': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'quiz': return 'bg-green-100 text-green-700 border-green-200';
      case 'midterm': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'final': return 'bg-red-100 text-red-700 border-red-200';

      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  const getStatusColor = (status: AssignmentStatus) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'submitted': return 'bg-blue-100 text-blue-700';
      case 'graded': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: AssignmentStatus) => {
    switch (status) {
      case 'not-started': return 'Not Started';
      case 'in-progress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'graded': return 'Graded';
      case 'overdue': return 'Overdue';
      default: return 'Unknown';
    }
  };

  const getDueDateDisplay = (assignment: AssignmentWithSubmission) => {
    // If submitted or graded, show submission date instead of due date
    if (assignment.submission) {
      return `Submitted ${new Date(assignment.submission.submittedAt).toLocaleDateString()}`;
    }

    if (assignment.isOverdue) {
      const daysOverdue = Math.abs(assignment.daysUntilDue);
      return `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`;
    } else if (assignment.isDueSoon) {
      if (assignment.daysUntilDue === 0) {
        return 'Due today';
      } else if (assignment.daysUntilDue === 1) {
        return 'Due tomorrow';
      } else {
        return `Due in ${assignment.daysUntilDue} days`;
      }
    } else {
      return `Due ${new Date(assignment.dueAt).toLocaleDateString()}`;
    }
  };

  const renderAssignmentsList = (assignmentsToRender: AssignmentWithSubmission[]) => (
    <div className="space-y-4">
      {assignmentsToRender.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assignments found
            </h3>
            <p className="text-gray-600">
              {searchQuery || selectedStatus !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Your instructor hasn\'t posted any assignments for this course yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {assignmentsToRender.map((assignment) => (
            <Card
              key={assignment.id}
              className={`hover:shadow-lg transition-all duration-200 border-2 ${
                assignment.isOverdue ? 'border-red-300 bg-red-50/50 shadow-red-100' :
                assignment.isDueSoon ? 'border-yellow-300 bg-yellow-50/50 shadow-yellow-100' :
                assignment.status === 'graded' ? 'border-green-300 bg-green-50/30' :
                'border-gray-200 hover:border-blue-300'
              }`}
            >
              <CardContent className="p-6">
                {/* Priority indicator */}
                {assignment.isOverdue && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-red-100 border border-red-200 rounded-lg">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-800">⚠️ Overdue - Submit immediately!</span>
                  </div>
                )}

                {assignment.isDueSoon && !assignment.isOverdue && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-100 border border-yellow-200 rounded-lg">
                    <Bell size={16} className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">⏰ Due soon - Don't forget!</span>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {assignment.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge className={`${getAssignmentTypeColor(assignment.type)} font-medium`}>
                          {getAssignmentTypeLabel(assignment.type)}
                        </Badge>
                        <Badge className={`${getStatusColor(assignment.status)} font-medium`}>
                          {getStatusLabel(assignment.status)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{assignment.instructions}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar size={16} className="text-gray-500" />
                        <span className={assignment.isOverdue ? 'text-red-600 font-medium' : 'text-gray-700'}>
                          {getDueDateDisplay(assignment)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Target size={16} className="text-gray-500" />
                        <span className="text-gray-700">{assignment.maxPoints} points</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award size={16} className="text-gray-500" />
                        <span className="text-gray-700">{assignment.weight}% weight</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {assignment.submission ? (
                          <>
                            <Upload size={16} className="text-green-500" />
                            <span className="text-green-700 font-medium">Submitted</span>
                          </>
                        ) : (
                          <>
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-gray-700">Not submitted</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Submission Status */}
                    {assignment.submission && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle size={16} className="text-green-600" />
                          <div className="text-sm">
                            <p className="text-gray-800 font-medium">
                              Submitted on {new Date(assignment.submission.submittedAt).toLocaleDateString()}
                            </p>
                            {assignment.submission.grade.gradedAt && (
                              <p className="text-gray-600">
                                Grade: {assignment.submission.grade.points} / {assignment.maxPoints} points
                                {assignment.submission.grade.feedback && (
                                  <span className="ml-2">• {assignment.submission.grade.feedback}</span>
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Late Submission Warning */}
                    {assignment.isOverdue && !assignment.submission && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-3">
                          <AlertCircle size={16} className="text-red-600" />
                          <div className="text-sm text-red-800">
                            <p className="font-medium">This assignment is overdue</p>
                            <p>Late submissions may incur penalties. Contact your instructor if you need an extension.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Due Soon Reminder */}
                    {assignment.isDueSoon && !assignment.submission && !assignment.isOverdue && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-3">
                          <Bell size={16} className="text-yellow-600" />
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium">Assignment due soon!</p>
                            <p>Make sure to submit before the deadline to avoid late penalties.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-3 ml-6">
                    {/* Primary Action Button */}
                    <Button
                      className={`flex items-center gap-2 font-medium ${
                        assignment.isOverdue ? 'bg-red-600 hover:bg-red-700 text-white' :
                        assignment.isDueSoon ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                        assignment.submission ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                        'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                      onClick={() => {
                        // Scroll to top when opening modal
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setSelectedAssignment(assignment);
                        navigate(`/assignments/${assignment.id}/submit`);
                      }}
                    >
                      {assignment.submission ? (
                        <>
                          <Eye size={16} />
                          View Submission
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          {assignment.isOverdue ? 'Submit Now' : 'Submit Assignment'}
                        </>
                      )}
                    </Button>

                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      {assignment.submission && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                          asChild
                        >
                          <a href={assignment.submission.fileUrl} download>
                            <Download size={14} />
                            Download
                          </a>
                        </Button>
                      )}

                      {/* Quick status indicator */}
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-600">
                        {assignment.status === 'graded' ? (
                          <>
                            <CheckCircle size={12} className="text-green-600" />
                            Graded
                          </>
                        ) : assignment.status === 'submitted' ? (
                          <>
                            <Clock size={12} className="text-blue-600" />
                            Pending
                          </>
                        ) : assignment.status === 'overdue' ? (
                          <>
                            <AlertTriangle size={12} className="text-red-600" />
                            Overdue
                          </>
                        ) : (
                          <>
                            <Zap size={12} className="text-gray-600" />
                            Ready
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading assignments...</span>
        </div>
      </div>
    );
  }

  // Check if user is a student
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
          <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
          <p className="text-gray-600 mt-2">
            Track your progress and submit assignments on time
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <TrendingUp size={14} className="mr-1" />
            {assignmentStats.completed}/{assignmentStats.total} Completed
          </Badge>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{assignmentStats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            {assignmentStats.overdue > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setQuickFilter('overdue')}
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
                <p className="text-2xl font-bold text-yellow-600">{assignmentStats.dueSoon}</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
            {assignmentStats.dueSoon > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                onClick={() => setQuickFilter('in-progress')}
              >
                View Due Soon
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-blue-600">{assignmentStats.submitted}</p>
              </div>
              <Upload className="h-8 w-8 text-blue-500" />
            </div>
            {assignmentStats.submitted > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                onClick={() => setQuickFilter('submitted')}
              >
                View Submitted
              </Button>
            )}
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{assignmentStats.completed}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-green-500" />
            </div>
            {assignmentStats.completed > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full border-green-200 text-green-600 hover:bg-green-50"
                onClick={() => setQuickFilter('graded')}
              >
                View Grades
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      {assignmentStats.total > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
              <span className="text-sm text-gray-600">
                {assignmentStats.completed + assignmentStats.submitted} of {assignmentStats.total} assignments
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${((assignmentStats.completed + assignmentStats.submitted) / assignmentStats.total) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>0%</span>
              <span>{Math.round(((assignmentStats.completed + assignmentStats.submitted) / assignmentStats.total) * 100)}% Complete</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedStatus === 'all' && selectedCategory === 'all' && !searchQuery ? 'primary' : 'outline'}
          size="sm"
          onClick={() => {
            setSelectedStatus('all');
            setSelectedCategory('all');
            setSearchQuery('');
          }}
          className="flex items-center gap-1"
        >
          <FileText size={14} />
          All Assignments
        </Button>

        <Button
          variant={selectedStatus === 'not-started' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setQuickFilter('not-started')}
          className="flex items-center gap-1"
        >
          <Zap size={14} />
          To Do ({assignmentStats.notStarted})
        </Button>

        <Button
          variant={selectedStatus === 'in-progress' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setQuickFilter('in-progress')}
          className="flex items-center gap-1"
        >
          <Clock size={14} />
          Due Soon ({assignmentStats.dueSoon})
        </Button>

        <Button
          variant={selectedStatus === 'overdue' ? 'danger' : 'outline'}
          size="sm"
          onClick={() => setQuickFilter('overdue')}
          className="flex items-center gap-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        >
          <AlertTriangle size={14} />
          Overdue ({assignmentStats.overdue})
        </Button>

        <Button
          variant={selectedStatus === 'submitted' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setQuickFilter('submitted')}
          className="flex items-center gap-1"
        >
          <Upload size={14} />
          Submitted ({assignmentStats.submitted})
        </Button>

        <Button
          variant={selectedStatus === 'graded' ? 'success' : 'outline'}
          size="sm"
          onClick={() => setQuickFilter('graded')}
          className="flex items-center gap-1"
        >
          <CheckSquare size={14} />
          Completed ({assignmentStats.completed})
        </Button>
      </div>

      {/* Advanced Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by assignment name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as AssignmentStatus)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">📋 All Status</option>
              <option value="not-started">🔄 Not Started</option>
              <option value="in-progress">⏳ In Progress</option>
              <option value="submitted">📤 Submitted</option>
              <option value="graded">✅ Graded</option>
              <option value="overdue">🚨 Overdue</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AssignmentCategory)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">📚 All Types</option>
              <option value="hw">📝 Homework</option>
              <option value="quiz">🧠 Quiz</option>
              <option value="midterm">📊 Midterm</option>
              <option value="final">🎓 Final</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs tabs={[
        { key: 'all', label: 'All', content: renderAssignmentsList(filteredAssignments) },
        { key: 'quiz', label: 'Quiz', content: renderAssignmentsList(filteredAssignments.filter(a => a.type === 'quiz')) },
        { key: 'hw', label: 'Homework', content: renderAssignmentsList(filteredAssignments.filter(a => a.type === 'hw')) },
        { key: 'midterm', label: 'Midterm', content: renderAssignmentsList(filteredAssignments.filter(a => a.type === 'midterm')) },
        { key: 'final', label: 'Final', content: renderAssignmentsList(filteredAssignments.filter(a => a.type === 'final')) },

      ]} />

      {/* Assignment Submission Modal */}
    </div>
  );
}







