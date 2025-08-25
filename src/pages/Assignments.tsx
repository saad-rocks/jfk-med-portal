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
import { Plus, FileText, Calendar, Users, BookOpen, X, Target, Award, Clock } from "lucide-react";

export default function Assignments() {
  const { role, user } = useRole();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

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

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'hw': return 'bg-medical-100 text-medical-700 border-medical-200';
      case 'quiz': return 'bg-vital-100 text-vital-700 border-vital-200';
      case 'midterm': return 'bg-alert-100 text-alert-700 border-alert-200';
      case 'final': return 'bg-critical-100 text-critical-700 border-critical-200';
      case 'osce': return 'bg-health-100 text-health-700 border-health-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getAssignmentTypeLabel = (type: string) => {
    switch (type) {
      case 'hw': return 'Homework';
      case 'quiz': return 'Quiz';
      case 'midterm': return 'Midterm';
      case 'final': return 'Final';
      case 'osce': return 'OSCE';
      default: return type;
    }
  };

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'hw': return BookOpen;
      case 'quiz': return Target;
      case 'midterm': return Award;
      case 'final': return Award;
      case 'osce': return Target;
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {role === 'teacher' ? 'Manage Assignments' : 'My Assignments'}
          </h1>
          <p className="text-slate-600 mt-2">
            {role === 'teacher'
              ? 'Create and manage assignments for your courses'
              : 'View and submit your course assignments'
            }
          </p>
        </div>
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
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <FileText size={20} className="text-medical-600" />
          {role === 'teacher' ? 'All Course Assignments' : 'Upcoming Assignments'}
        </h2>

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
            {assignments.map((assignment) => {
              const IconComponent = getAssignmentTypeIcon(assignment.type);
              return (
                <Card key={assignment.id} className="hover:shadow-lg transition-all duration-200 border border-slate-200/60 bg-white/95">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-r from-medical-100 to-health-100 rounded-lg">
                            <IconComponent size={20} className="text-medical-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-800">
                              {assignment.title}
                            </h3>
                            <Badge className={`${getAssignmentTypeColor(assignment.type)} border`}>
                              {getAssignmentTypeLabel(assignment.type)}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-slate-600 mb-4 leading-relaxed">{assignment.instructions}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Calendar size={16} className="text-medical-500" />
                            <span>Due: {new Date(assignment.dueAt).toLocaleDateString()}</span>
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
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {role === 'student' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/80 border-slate-200/60 hover:bg-slate-50/80"
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setShowSubmissionModal(true);
                            }}
                          >
                            View & Submit
                          </Button>
                        ) : (
                                                   <>
                           <Button 
                             variant="outline" 
                             size="sm" 
                             className="bg-white/80 border-slate-200/60 hover:bg-slate-50/80"
                             onClick={() => {
                               setSelectedAssignment(assignment);
                               setShowEditModal(true);
                             }}
                           >
                             Edit
                           </Button>
                           <Button variant="outline" size="sm" className="bg-white/80 border-slate-200/60 hover:bg-slate-50/80">
                             View Submissions
                           </Button>
                         </>
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
