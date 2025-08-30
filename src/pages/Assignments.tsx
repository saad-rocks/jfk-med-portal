import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useRole } from "../hooks/useRole";
import { listAssignments } from "../lib/assignments";
import { getTeacherAssignments } from "../lib/teacherAssignments";
import { getAllUsers } from "../lib/users";
import CreateAssignment from "../components/CreateAssignment";
import EditAssignment from "../components/EditAssignment";
import AssignmentSubmission from "../components/AssignmentSubmission";
import type { Assignment } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Plus, FileText, Calendar, Users, BookOpen, X, Target, Award, Clock, AlertTriangle, Bell, CheckCircle, TrendingUp, AlertCircle, Filter, Eye, Upload } from "lucide-react";

export default function Assignments() {
  const { role, user } = useRole();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Filtering and search
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'overdue' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    if (!user) return;

    try {
      if (role === 'teacher') {
        // For teachers, get their Firestore document ID first
        const allUsers = await getAllUsers();
        const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
        
        if (!currentUser?.id) {
          console.error("❌ Teacher profile not found in database for email:", user.email);
          setTeacherCourses([]);
          setAssignments([]);
          setLoading(false);
          return;
        }

        // Get teacher assignments using the Firestore document ID
        console.log("🔍 Getting teacher assignments for Firestore ID:", currentUser.id);
        const teacherAssignments = await getTeacherAssignments(currentUser.id);
        console.log("📚 Teacher assignments found:", teacherAssignments);
        setTeacherCourses(teacherAssignments);

        // Get all assignments for teacher's courses
        const allAssignments: Assignment[] = [];
        for (const course of teacherAssignments) {
          console.log("🔍 Getting assignments for course:", course.courseId);
          const courseAssignments = await listAssignments(course.courseId);
          console.log("📝 Course assignments found:", courseAssignments);
          allAssignments.push(...courseAssignments);
        }
        console.log("📋 Total assignments found:", allAssignments);
        setAssignments(allAssignments);
      } else if (role === 'student') {
        // For students, get their Firestore document ID first
        const allUsers = await getAllUsers();
        const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
        
        if (!currentUser?.id) {
          console.error("❌ Student profile not found in database for email:", user.email);
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

        console.log("🔍 Student enrolled in courses:", enrolledCourseIds);

        // Get assignments for all enrolled courses
        const allAssignments: Assignment[] = [];
        for (const courseId of enrolledCourseIds) {
          console.log("🔍 Getting assignments for course:", courseId);
          const courseAssignments = await listAssignments(courseId);
          console.log("📝 Course assignments found:", courseAssignments);
          allAssignments.push(...courseAssignments);
        }
        console.log("📋 Total student assignments found:", allAssignments);
        setAssignments(allAssignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, user]);

  // Filter and sort assignments
  const filteredAssignments = assignments.filter(assignment => {
    const now = new Date();
    const dueDate = new Date(assignment.dueAt);
    const isOverdue = dueDate < now;
    const isDueSoon = !isOverdue && (dueDate.getTime() - now.getTime()) <= (3 * 24 * 60 * 60 * 1000); // 3 days

    // Filter by type
    switch (filterType) {
      case 'upcoming':
        if (isOverdue) return false;
        break;
      case 'overdue':
        if (!isOverdue) return false;
        break;
      case 'past':
        if (!isOverdue) return false;
        break;
      default: // 'all'
        break;
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

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    return aDue.getTime() - bDue.getTime();
  });

  // Statistics
  const getAssignmentStats = () => {
    const now = new Date();
    const stats = {
      total: assignments.length,
      upcoming: 0,
      overdue: 0,
      completed: 0
    };

    assignments.forEach(assignment => {
      const dueDate = new Date(assignment.dueAt);
      if (dueDate < now) {
        stats.overdue++;
      } else if ((dueDate.getTime() - now.getTime()) <= (7 * 24 * 60 * 60 * 1000)) { // 7 days
        stats.upcoming++;
      }
    });

    return stats;
  };

  const stats = getAssignmentStats();

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
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} />
              Create Assignment
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">All Assignments</p>
                <p className="text-2xl font-bold text-green-600">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full border-green-200 text-green-600 hover:bg-green-50"
              onClick={() => setFilterType('all')}
            >
              View All
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total - stats.overdue - stats.upcoming}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 w-full border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => setFilterType('past')}
            >
              View Completed
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Filters */}
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
          variant={filterType === 'past' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilterType('past')}
          className="flex items-center gap-1"
        >
          <CheckCircle size={14} />
          Past Due ({stats.total - stats.overdue - stats.upcoming})
        </Button>
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
              const isOverdue = dueDate < now;
              const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              const isDueSoon = !isOverdue && daysUntilDue <= 3;

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
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={`${getAssignmentTypeColor(assignment.type)} border font-medium`}>
                                {getAssignmentTypeLabel(assignment.type)}
                              </Badge>
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
                        {/* Primary Action Button */}
                        {role === 'student' ? (
                          <Button
                            className={`flex items-center gap-2 font-medium ${
                              isOverdue ? 'bg-red-600 hover:bg-red-700 text-white' :
                              isDueSoon ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                              'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowSubmissionModal(true);
                            }}
                          >
                            {isOverdue ? (
                              <>
                                <AlertTriangle size={16} />
                                Submit Now
                              </>
                            ) : (
                              <>
                                <Upload size={16} />
                                View & Submit
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            className="flex items-center gap-2 font-medium bg-medical-600 hover:bg-medical-700 text-white"
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowEditModal(true);
                            }}
                          >
                            <Eye size={16} />
                            Edit Assignment
                          </Button>
                        )}

                        {/* Secondary Actions */}
                        <div className="flex gap-2">
                          {role === 'teacher' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Users size={14} />
                              View Submissions
                            </Button>
                          )}

                          {/* Status Indicator */}
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
                        </div>
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
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
            >
              <X size={20} />
            </button>
            <CreateAssignment
              onSuccess={() => {
                setShowCreateModal(false);
                fetchData(); // Refresh the assignments list
              }}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {showEditModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedAssignment(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
            >
              <X size={20} />
            </button>
            <EditAssignment
              assignment={selectedAssignment}
              onSuccess={() => {
                setShowEditModal(false);
                setSelectedAssignment(null);
                fetchData(); // Refresh the assignments list
              }}
              onCancel={() => {
                setShowEditModal(false);
                setSelectedAssignment(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {showSubmissionModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowSubmissionModal(false);
                setSelectedAssignment(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
            >
              <X size={20} />
            </button>
            <AssignmentSubmission
              assignment={selectedAssignment}
              onSuccess={() => {
                setShowSubmissionModal(false);
                setSelectedAssignment(null);
                fetchData(); // Refresh the assignments list
              }}
              onCancel={() => {
                setShowSubmissionModal(false);
                setSelectedAssignment(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
