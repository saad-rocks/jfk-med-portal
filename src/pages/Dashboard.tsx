import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PageHeader } from "../components/layout/PageHeader";
import { useRole } from "../hooks/useRole";
import { listCourses } from "../lib/courses";
import { listEnrollmentsForStudent, listEnrollments, type Enrollment } from "../lib/enrollments";
import { getUserStats, getAllUsers, type UserProfile } from "../lib/users";
import { getTeacherAssignments, type TeacherAssignment } from "../lib/teacherAssignments";
import { listAssignments } from "../lib/assignments";
import { 
  getCurrentSessionFromDB, 
  getNextSession, 
  getAllSessions, 
  getSessionDisplayName, 
  getSessionStatus, 
  getSessionProgress,
  initializeDefaultSessions,
  type Session 
} from "../lib/sessions";
import type { Course, Assignment } from "../types";

// Dashboard Component
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Bell, 
  CheckCircle,
  AlertTriangle,
  Heart,
  Activity,
  FileText,
  GraduationCap,
  Stethoscope,
  ClipboardList,
  Award,
  Target,
  BarChart3,
  Settings
} from "lucide-react";

function Dashboard() {
  const { user, role, mdYear, loading } = useRole();
  const navigate = useNavigate();
  
  // Debug: Log navigation function
  console.log('🔧 Dashboard - navigate function:', typeof navigate);

  // Handle potential null/undefined values gracefully
  const safeUser = user || null;
  const safeRole = role || 'student';
  const safeMdYear = mdYear || undefined;
  const [courses, setCourses] = useState<Array<Course & { id: string }>>([]);
  const [enrollments, setEnrollments] = useState<Array<Enrollment & { id: string }>>([]);
  const [courseEnrollments, setCourseEnrollments] = useState<{[courseId: string]: number}>({});
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);
  const [teacherAssignments, setTeacherAssignments] = useState<Array<TeacherAssignment & { id: string }>>([]);
  const [studentAssignments, setStudentAssignments] = useState<Array<Assignment & { id: string }>>([]);
  const [teacherStats, setTeacherStats] = useState<{
    assignedCourses: number;
    totalStudents: number;
    averageEnrollment: number;
  } | null>(null);
  const [userStats, setUserStats] = useState<{
    totalUsers: number;
    students: number;
    teachers: number;
    admins: number;
    activeUsers: number;
  } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [nextSession, setNextSession] = useState<Session | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [expandedSession, setExpandedSession] = useState<'current' | 'next' | null>(null);

  // Combined useEffect to handle all data fetching in the correct order
  useEffect(() => {
    const fetchAllData = async () => {
      if (!loading) {
        try {
          // Fetch courses for all roles
          console.log('📚 Fetching courses...');
          const fetchedCourses = await listCourses();
          setCourses(fetchedCourses);
          console.log('📚 Courses fetched:', fetchedCourses.length);
          
          // Fetch enrollments for students
          if (safeRole === 'student' && safeUser?.email) {
            console.log('📊 Fetching student enrollments...');
            try {
              // First, get the user's Firestore document ID
              const allUsers = await getAllUsers();
              const currentUser = allUsers.find(u => u.email?.toLowerCase() === safeUser.email?.toLowerCase());
              
              if (currentUser?.id) {
                console.log('📋 Found student document ID:', currentUser.id);
                const studentEnrollments = await listEnrollmentsForStudent(currentUser.id);
                setEnrollments(studentEnrollments);
                console.log('📊 Student enrollments fetched:', studentEnrollments.length);
                
                // Fetch assignments for enrolled courses
                if (studentEnrollments.length > 0) {
                  console.log('📝 Fetching assignments for enrolled courses...');
                  const enrolledCourseIds = studentEnrollments.map(e => e.courseId);
                  const allAssignments: Array<Assignment & { id: string }> = [];
                  
                  for (const courseId of enrolledCourseIds) {
                    try {
                      const courseAssignments = await listAssignments(courseId);
                      allAssignments.push(...courseAssignments);
                    } catch (error) {
                      console.error(`❌ Error fetching assignments for course ${courseId}:`, error);
                    }
                  }
                  
                  setStudentAssignments(allAssignments);
                  console.log('📝 Student assignments fetched:', allAssignments.length);
                }
              } else {
                console.error('❌ Student profile not found in database for email:', safeUser.email);
              }
            } catch (error) {
              console.error('❌ Error fetching student enrollments:', error);
            }
          }
          
          // Fetch course enrollments for admin role
          if (safeRole === 'admin') {
            console.log('🔧 Fetching course enrollments for admin...');
            const enrollmentCounts: {[courseId: string]: number} = {};
            for (const course of fetchedCourses) {
              console.log(`🔧 Fetching enrollments for course: ${course.code} (${course.id})`);
              const courseEnrollments = await listEnrollments({ courseId: course.id });
              const activeEnrollments = courseEnrollments.filter(e => e.status === 'enrolled');
              enrollmentCounts[course.id] = activeEnrollments.length;
              console.log(`🔧 Course ${course.code}: ${activeEnrollments.length} enrolled students`);
            }
            console.log('🔧 Final enrollment counts:', enrollmentCounts);
            setCourseEnrollments(enrollmentCounts);
          }
          
        } catch (error) {
          console.error('❌ Error in general data fetch:', error);
        } finally {
          setCoursesLoading(false);
          setEnrollmentsLoading(false);
        }
      }
    };
    
    fetchAllData();
  }, [loading, safeRole, safeUser?.email]);

  // Special useEffect for teacher data fetching
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!loading && safeRole === 'teacher' && safeUser?.email) {
        try {
          console.log('🎓 Starting comprehensive data fetch for teacher...');
          
          // Step 1: Fetch all users to find teacher
          console.log('👥 Step 1: Fetching users to find teacher...');
          const allUsers = await getAllUsers();
          const teacherUser = allUsers.find((u: UserProfile) => u.email?.toLowerCase() === safeUser.email?.toLowerCase());
          
          if (!teacherUser?.id) {
            console.error('❌ Teacher user not found in database for email:', safeUser.email);
            return;
          }
          console.log('🔍 Teacher user found:', teacherUser);
          
          // Step 2: Fetch teacher assignments
          console.log('📋 Step 2: Fetching teacher assignments...');
          const assignments = await getTeacherAssignments(teacherUser.id);
          setTeacherAssignments(assignments);
          console.log('📋 Teacher assignments:', assignments);
          
          // Step 3: Fetch course enrollments for assigned courses
          console.log('📊 Step 3: Fetching course enrollments...');
          const assignedCourseIds = assignments.map(a => a.courseId);
          const assignedCourses = courses.filter(c => assignedCourseIds.includes(c.id));
          console.log('🎯 Assigned courses:', assignedCourses);
          
          const enrollmentCounts: {[courseId: string]: number} = {};
          const uniqueStudentIds = new Set<string>();
          let totalEnrollments = 0;
          
          for (const course of assignedCourses) {
            console.log(`📊 Fetching enrollments for course: ${course.code} (${course.id})`);
            try {
              const courseEnrollments = await listEnrollments({ courseId: course.id });
              console.log(`📊 Raw enrollments for ${course.code}:`, courseEnrollments);
              
              const activeEnrollments = courseEnrollments.filter(e => e.status === 'enrolled');
              enrollmentCounts[course.id] = activeEnrollments.length;
              totalEnrollments += activeEnrollments.length;
              
              console.log(`📊 Course ${course.code}: ${activeEnrollments.length} enrolled students`);
              console.log(`📊 Active enrollments:`, activeEnrollments);
              
              // Add each student ID to the set (duplicates are automatically ignored)
              activeEnrollments.forEach(enrollment => {
                uniqueStudentIds.add(enrollment.studentId);
                console.log(`👤 Added student ID: ${enrollment.studentId}`);
              });
            } catch (error) {
              console.error(`❌ Error fetching enrollments for course ${course.code}:`, error);
              enrollmentCounts[course.id] = 0;
            }
          }
          
          // Step 4: Set course enrollments (for consistency with admin view)
          setCourseEnrollments(enrollmentCounts);
          
          // Step 5: Calculate and set teacher stats
          console.log('📊 Step 5: Calculating teacher stats...');
          const totalStudents = uniqueStudentIds.size;
          console.log('👥 Unique student IDs:', Array.from(uniqueStudentIds));
          console.log('📊 Total enrollments across all courses:', totalEnrollments);
          console.log('👥 Total unique students:', totalStudents);
          
          const averageEnrollment = assignedCourses.length > 0 ? Math.round(totalStudents / assignedCourses.length) : 0;
          
          const stats = {
            assignedCourses: assignedCourses.length,
            totalStudents,
            averageEnrollment
          };
          
          console.log('📊 Final teacher stats:', stats);
          setTeacherStats(stats);
          
        } catch (error) {
          console.error('❌ Error in teacher data fetch:', error);
        }
      }
    };
    
    fetchTeacherData();
  }, [loading, safeRole, safeUser?.email, courses]);

  // Fetch user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const stats = await getUserStats();
        setUserStats(stats);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
        // Set default values on error
        setUserStats({
          totalUsers: 0,
          students: 0,
          teachers: 0,
          admins: 0,
          activeUsers: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Initialize default sessions for current year if none exist
        await initializeDefaultSessions();
        
        // Get all sessions
        const allSessions = await getAllSessions();
        
        // Get current session
        const current = await getCurrentSessionFromDB();
        setCurrentSession(current);
        
        // Get next session
        const next = getNextSession(allSessions);
        setNextSession(next);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setSessionsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  // Dashboard is ready to render

  const welcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = safeUser?.displayName || safeUser?.email?.split('@')[0] || 'there';
  
  const getMDYearDisplay = () => {
    if (safeRole !== 'student' || !safeMdYear) return '';

    const yearNames = {
      'MD-1': 'First Year',
      'MD-2': 'Second Year',
      'MD-3': 'Third Year',
      'MD-4': 'Fourth Year',
      'MD-5': 'Fifth Year',
      'MD-6': 'Sixth Year',
      'MD-7': 'Seventh Year',
      'MD-8': 'Eighth Year',
      'MD-9': 'Ninth Year',
      'MD-10': 'Tenth Year',
      'MD-11': 'Eleventh Year'
    };

    return yearNames[safeMdYear] || 'Medical Student';
  };

  const getMDYearDescription = () => {
    const descriptions = {
      'MD-1': 'Building your foundation in basic sciences and clinical skills.',
      'MD-2': 'Advancing through systems-based learning and patient interactions.',
      'MD-3': 'Gaining hands-on clinical experience in core rotations.',
      'MD-4': 'Preparing for residency with electives and specialty rotations.',
      'MD-5': 'Advanced clinical training and specialized rotations.',
      'MD-6': 'Specialized clinical practice and advanced procedures.',
      'MD-7': 'Advanced medical practice and leadership development.',
      'MD-8': 'Specialized medical expertise and advanced training.',
      'MD-9': 'Advanced clinical practice and specialized skills.',
      'MD-10': 'Expert-level medical practice and specialization.',
      'MD-11': 'Mastery of medical practice and advanced expertise.'
    };

    return safeMdYear ? descriptions[safeMdYear] : 'Continue your journey to becoming an exceptional physician.';
  };

  // Helper functions for course display
  const isEnrolledInCourse = (courseId: string) => {
    return enrollments.some(enrollment => enrollment.courseId === courseId && enrollment.status === 'enrolled');
  };

  const getEnrolledCourses = () => {
    return courses.filter(course => isEnrolledInCourse(course.id));
  };

  const getCoursesToDisplay = () => {
    if (safeRole === 'student') {
      return getEnrolledCourses();
    } else if (safeRole === 'teacher') {
      // For teachers, show only their assigned courses
      const assignedCourseIds = teacherAssignments.map(a => a.courseId);
      return courses.filter(course => assignedCourseIds.includes(course.id));
    }
    return courses;
  };

  const getEnrollmentCount = (courseId: string) => {
    const count = courseEnrollments[courseId] || 0;
    console.log(`🔧 getEnrollmentCount for course ${courseId}: ${count}`);
    return count;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${welcomeMessage()}, ${userName}!`}
        breadcrumb={[{ label: 'Dashboard' }]}
      />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-teal-500 text-white border-0 rounded-3xl shadow-glow p-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        
        <div className="relative flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">Welcome to JFK Medical Portal</h2>
              {safeRole === 'student' && safeMdYear && (
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm shadow-soft">
                  {safeMdYear} Student
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              {safeRole === 'student' && safeMdYear && (
                <h3 className="text-lg font-semibold text-white/90 drop-shadow-sm">
                  {getMDYearDisplay()} Medical Student
                </h3>
              )}
              <p className="text-white/80 max-w-lg leading-relaxed">
                {safeRole === 'student' ? getMDYearDescription() :
                 safeRole === 'teacher' ? "Shape the future of medicine through education." :
                 safeRole === 'admin' ? "Manage and oversee the medical education program." :
                 "Your gateway to medical education excellence."}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex flex-col items-center gap-4">
            {safeRole === 'student' && safeMdYear && (
              <div className="text-center">
                <div className="text-4xl font-bold text-white drop-shadow-lg">{safeMdYear}</div>
                <div className="text-xs text-white/70 font-medium uppercase tracking-wider">Current Year</div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                <Stethoscope size={28} className="text-white/90" />
              </div>
              <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm pulse-vital">
                <Heart size={20} className="text-red-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Information - Updated with click-to-expand functionality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Session Card */}
        <Card 
          className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
            expandedSession === 'current' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setExpandedSession(expandedSession === 'current' ? null : 'current')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Current Academic Session
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Active
                </Badge>
                <div className={`transform transition-transform duration-300 ${
                  expandedSession === 'current' ? 'rotate-180' : ''
                }`}>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2 text-gray-600">Loading session info...</span>
              </div>
            ) : currentSession ? (
              <div className="space-y-3">
                
                {/* Compact View (Default) */}
                {expandedSession !== 'current' ? (
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {getSessionDisplayName(currentSession)}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {currentSession.startDate instanceof Date 
                          ? currentSession.startDate.toLocaleDateString()
                          : currentSession.startDate.toDate().toLocaleDateString()}
                        {' - '}
                        {currentSession.endDate instanceof Date 
                          ? currentSession.endDate.toLocaleDateString()
                          : currentSession.endDate.toDate().toLocaleDateString()}
                      </span>
                      <span className="font-medium">{getSessionProgress(currentSession)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getSessionProgress(currentSession)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Click to expand for more details</p>
                  </div>
                ) : (
                  /* Expanded View */
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {getSessionDisplayName(currentSession)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {currentSession.description || 'Current academic session'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">
                          {currentSession.startDate instanceof Date 
                            ? currentSession.startDate.toLocaleDateString()
                            : currentSession.startDate.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">
                          {currentSession.endDate instanceof Date 
                            ? currentSession.endDate.toLocaleDateString()
                            : currentSession.endDate.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Session Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Session Progress</span>
                        <span className="font-medium">{getSessionProgress(currentSession)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getSessionProgress(currentSession)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Session Status */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {getSessionStatus(currentSession)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No current session found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Session Card */}
        <Card 
          className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${
            expandedSession === 'next' ? 'ring-2 ring-orange-500' : ''
          }`}
          onClick={() => setExpandedSession(expandedSession === 'next' ? null : 'next')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Next Session
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                  Upcoming
                </Badge>
                <div className={`transform transition-transform duration-300 ${
                  expandedSession === 'next' ? 'rotate-180' : ''
                }`}>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2 text-gray-600">Loading session info...</span>
              </div>
            ) : nextSession ? (
              <div className="space-y-3">
                
                {/* Compact View (Default) */}
                {expandedSession !== 'next' ? (
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {getSessionDisplayName(nextSession)}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>
                        {nextSession.startDate instanceof Date 
                          ? nextSession.startDate.toLocaleDateString()
                          : nextSession.startDate.toDate().toLocaleDateString()}
                        {' - '}
                        {nextSession.endDate instanceof Date 
                          ? nextSession.endDate.toLocaleDateString()
                          : nextSession.endDate.toDate().toLocaleDateString()}
                      </span>
                      <span className="font-medium">
                        {(() => {
                          const startDate = nextSession.startDate instanceof Date 
                            ? nextSession.startDate 
                            : nextSession.startDate.toDate();
                          const daysUntil = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                          return daysUntil > 0 ? `${daysUntil} days` : 'Starting soon';
                        })()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Click to expand for more details</p>
                  </div>
                ) : (
                  /* Expanded View */
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {getSessionDisplayName(nextSession)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {nextSession.description || 'Upcoming academic session'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Start Date:</span>
                        <span className="font-medium">
                          {nextSession.startDate instanceof Date 
                            ? nextSession.startDate.toLocaleDateString()
                            : nextSession.startDate.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">End Date:</span>
                        <span className="font-medium">
                          {nextSession.endDate instanceof Date 
                            ? nextSession.endDate.toLocaleDateString()
                            : nextSession.endDate.toDate().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Days until next session */}
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {(() => {
                            const startDate = nextSession.startDate instanceof Date 
                              ? nextSession.startDate 
                              : nextSession.startDate.toDate();
                            const daysUntil = Math.ceil((startDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                            return daysUntil > 0 ? daysUntil : 0;
                          })()}
                        </div>
                        <div className="text-sm text-orange-700">Days until next session</div>
                      </div>
                    </div>
                    
                    {/* Session Status */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Status:</span>
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          {getSessionStatus(nextSession)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No upcoming sessions</p>
                <p className="text-sm text-gray-500 mt-1">All sessions have been scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Courses Section */}
      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" />
              {safeRole === 'student' ? 'My Enrolled Courses' : 
               safeRole === 'teacher' ? 'My Assigned Courses' : 'Active Courses'} ({getCoursesToDisplay().length})
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Browse Courses button clicked! Navigating to /courses');
                console.log('🔧 Navigation function type:', typeof navigate);
                try {
                  navigate('/courses');
                  console.log('🔧 Navigation called successfully');
                } catch (error) {
                  console.error('🔧 Navigation error:', error);
                }
              }}
            >
              <BookOpen size={16} />
              {safeRole === 'student' ? 'Browse Courses' : 
               safeRole === 'teacher' ? 'Manage Courses' : 'All Courses'}
            </Button>
          </CardHeader>
          <CardContent>
            {(coursesLoading || (safeRole === 'student' && enrollmentsLoading)) ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-600">Loading courses...</span>
                </div>
              </div>
            ) : getCoursesToDisplay().length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  <BookOpen size={32} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {safeRole === 'student' ? 'No Enrolled Courses' : 
                   safeRole === 'teacher' ? 'No Assigned Courses' : 'No Courses Available'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {safeRole === 'student' 
                    ? 'You are not enrolled in any courses yet. Visit the Courses page to enroll in available courses.'
                    : safeRole === 'teacher'
                    ? 'You are not assigned to any courses yet. Visit the Courses page to select courses to teach.'
                    : 'No courses have been created yet.'
                  }
                </p>
                                                 <Button 
                  variant="primary" 
                  className="flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Browse Courses button clicked! Navigating to /courses');
                    console.log('🔧 Navigation function type:', typeof navigate);
                    try {
                      navigate('/courses');
                      console.log('🔧 Navigation called successfully');
                    } catch (error) {
                      console.error('🔧 Navigation error:', error);
                    }
                  }}
                  data-testid="browse-courses-button"
                >
                  <BookOpen size={16} />
                  {safeRole === 'student' ? 'Browse Courses' : 
                   safeRole === 'teacher' ? 'Select Courses to Teach' : 'Create First Course'}
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getCoursesToDisplay().slice(0, 6).map((course) => (
                                     <div 
                     key={course.id} 
                     className="p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group relative"
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       console.log('Course card clicked! Navigating to /courses');
                       navigate('/courses');
                     }}
                   >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {course.code} — {course.title}
                          </h4>
                          {safeRole === 'admin' && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-2 py-1 shadow-sm">
                              {getEnrollmentCount(course.id)} enrolled
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200">
                            {course.semester}
                          </Badge>
                          <Badge variant="secondary" className="text-xs bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200">
                            {course.credits} Credits
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>
                          {safeRole === 'admin' 
                            ? `Capacity: ${course.capacity} students (${getEnrollmentCount(course.id)} enrolled)`
                            : `Capacity: ${course.capacity} students`
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope size={14} />
                        <span>Instructor: {course.instructor || 'TBD'}</span>
                      </div>
                      {course.description && (
                        <div className="flex items-start gap-2">
                          <FileText size={14} className="mt-0.5 flex-shrink-0" />
                          <p className="line-clamp-2 text-xs">{course.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-1">
                          <span>ID: {String(course.ownerId || "").slice(0, 8)}…</span>
                          <svg 
                            className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {getCoursesToDisplay().length > 6 && (
              <div className="mt-6 text-center">
                                 <Button 
                   variant="outline" 
                   className="flex items-center gap-2"
                   onClick={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     navigate('/courses');
                   }}
                 >
                  <BookOpen size={16} />
                  {safeRole === 'student' ? 'View All Enrolled Courses' : 
                   safeRole === 'teacher' ? 'View All Assigned Courses' : 'View All Courses'} ({getCoursesToDisplay().length})
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Student Assignments Section */}
      {safeRole === 'student' && studentAssignments.length > 0 && (
        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} className="text-medical-600" />
                Active Assignments ({studentAssignments.length})
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
                onClick={() => navigate('/assignments')}
              >
                <FileText size={16} />
                View All Assignments
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {studentAssignments.slice(0, 6).map((assignment) => {
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

                  const IconComponent = getAssignmentTypeIcon(assignment.type);
                  const isOverdue = new Date(assignment.dueAt) < new Date();

                  return (
                    <div 
                      key={assignment.id} 
                      className={`p-4 border rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group relative ${
                        isOverdue 
                          ? 'border-critical-200 bg-critical-50/50 hover:border-critical-300' 
                          : 'border-slate-200 hover:border-medical-300 hover:bg-medical-50/50'
                      }`}
                      onClick={() => navigate('/assignments')}
                    >
                      {isOverdue && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-critical-500 text-white text-xs">
                            Overdue
                          </Badge>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="p-2 bg-gradient-to-r from-medical-100 to-health-100 rounded-lg">
                              <IconComponent size={16} className="text-medical-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 line-clamp-2">
                              {assignment.title}
                            </h4>
                          </div>
                          <Badge className={`${getAssignmentTypeColor(assignment.type)} border text-xs`}>
                            {getAssignmentTypeLabel(assignment.type)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span className={isOverdue ? 'text-critical-600 font-medium' : ''}>
                            Due: {new Date(assignment.dueAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award size={14} />
                          <span>{assignment.maxPoints} points</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target size={14} />
                          <span>Weight: {assignment.weight}%</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Course: {assignment.courseId}</span>
                          <div className="flex items-center gap-1">
                            <span>Click to view</span>
                            <svg 
                              className="w-3 h-3 text-gray-400 group-hover:text-medical-500 transition-colors" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {studentAssignments.length > 6 && (
                <div className="mt-6 text-center">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => navigate('/assignments')}
                  >
                    <FileText size={16} />
                    View All Assignments ({studentAssignments.length})
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
           <CardContent className="p-4">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-sm font-medium text-gray-600">
                   {safeRole === 'student' ? 'Enrolled Courses' : 'Active Courses'}
                 </p>
                                   <div className="text-2xl font-bold text-gray-900">
                    {(coursesLoading || (safeRole === 'student' && enrollmentsLoading)) ? (
                      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      getCoursesToDisplay().length
                    )}
                  </div>
               </div>
               <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                 <BookOpen size={20} className="text-blue-600" />
               </div>
             </div>
           </CardContent>
         </Card>

        {safeRole === 'admin' ? (
          <>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                                         <div className="text-2xl font-bold text-gray-900">
                       {statsLoading ? (
                         <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                       ) : (
                         userStats?.students || 0
                       )}
                     </div>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Faculty Members</p>
                                         <div className="text-2xl font-bold text-blue-600">
                       {statsLoading ? (
                         <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                       ) : (
                         userStats?.teachers || 0
                       )}
                     </div>
                  </div>
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope size={20} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Health</p>
                                         <div className="text-2xl font-bold text-green-600">100%</div>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Activity size={20} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : safeRole === 'teacher' ? (
          <>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assigned Courses</p>
                                         <div className="text-2xl font-bold text-blue-600">
                       {teacherStats?.assignedCourses || 0}
                     </div>
                  </div>
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                                         <div className="text-2xl font-bold text-green-600">
                       {teacherStats?.totalStudents || 0}
                     </div>
                  </div>
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Enrollment</p>
                                         <div className="text-2xl font-bold text-purple-600">
                       {teacherStats?.averageEnrollment || 0}
                     </div>
                  </div>
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp size={20} className="text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
      <>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments Due</p>
                                 <div className="text-2xl font-bold text-gray-900">3</div>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                <ClipboardList size={20} className="text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                                 <div className="text-2xl font-bold text-green-600">92%</div>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance</p>
                                 <div className="text-2xl font-bold text-blue-600">98%</div>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </>
    )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Primary Content */}
        <div className="lg:col-span-2 space-y-6">
          {safeRole === 'admin' ? (
            <>
              {/* System Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-600" />
                    System Overview
                  </CardTitle>
                  <Button variant="ghost" size="sm">View Details</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Database Performance</p>
                        <p className="text-sm text-gray-600">All systems operational • Response time: 45ms</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">Excellent</p>
                        <p className="text-xs text-gray-500">99.9% uptime</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">User Authentication</p>
                        <p className="text-sm text-gray-600">
                          {statsLoading ? 'Loading user data...' : 
                           `${userStats?.activeUsers || 0} active users • ${userStats?.teachers || 0} faculty members`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">Active</p>
                        <p className="text-xs text-gray-500">No issues</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                      <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Course Management</p>
                        <p className="text-sm text-gray-600">{courses.length} active courses • All updated</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-orange-600">Updated</p>
                        <p className="text-xs text-gray-500">Last sync: 2 min ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent System Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={20} className="text-green-600" />
                    Recent System Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New Course Created</p>
                        <p className="text-xs text-gray-500">ANAT101 - Human Anatomy • 2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New Student Registration</p>
                        <p className="text-xs text-gray-500">John Doe (MD-1) • Yesterday</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Stethoscope size={16} className="text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Faculty Account Updated</p>
                        <p className="text-xs text-gray-500">Dr. Sarah Johnson profile • 2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : safeRole === 'teacher' ? (
            <>
              {/* Teaching Overview */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope size={20} className="text-blue-600" />
                    Teaching Overview
                  </CardTitle>
                  <Button variant="ghost" size="sm">View Details</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Course Assignments</p>
                        <p className="text-sm text-gray-600">
                          {teacherStats?.assignedCourses || 0} courses assigned • {teacherStats?.totalStudents || 0} total students
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">Active</p>
                        <p className="text-xs text-gray-500">Current session</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Student Engagement</p>
                        <p className="text-sm text-gray-600">
                          Average enrollment: {teacherStats?.averageEnrollment || 0} students per course
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">Good</p>
                        <p className="text-xs text-gray-500">Balanced load</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                      <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Teaching Performance</p>
                        <p className="text-sm text-gray-600">All courses active • No pending assignments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-purple-600">Excellent</p>
                        <p className="text-xs text-gray-500">On track</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Teaching Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={20} className="text-green-600" />
                    Recent Teaching Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Course Assignment Updated</p>
                        <p className="text-xs text-gray-500">ANAT101 - Human Anatomy • 2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">New Student Enrollment</p>
                        <p className="text-xs text-gray-500">John Doe enrolled in your course • Yesterday</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Teaching Excellence</p>
                        <p className="text-xs text-gray-500">High student satisfaction rating • 2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Upcoming Schedule */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar size={20} className="text-blue-600" />
                    Today's Schedule
                  </CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Anatomy Lecture - Cardiovascular System</p>
                        <p className="text-sm text-gray-600">Dr. Sarah Johnson • Room 201</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600">9:00 AM</p>
                        <p className="text-xs text-gray-500">1h 30m</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Clinical Skills Lab</p>
                        <p className="text-sm text-gray-600">Prof. Michael Chen • Lab A</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">2:00 PM</p>
                        <p className="text-xs text-gray-500">2h</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                      <div className="h-2 w-2 bg-orange-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">OSCE Practice Session</p>
                        <p className="text-sm text-gray-600">Various Stations • Clinical Center</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-orange-600">4:30 PM</p>
                        <p className="text-xs text-gray-500">1h</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity size={20} className="text-green-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Physiology Quiz Completed</p>
                        <p className="text-xs text-gray-500">Score: 94% • 2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Case Study Submitted</p>
                        <p className="text-xs text-gray-500">Cardiology Case #3 • Yesterday</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award size={16} className="text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Achievement Unlocked</p>
                        <p className="text-xs text-gray-500">"Perfect Attendance" badge earned • 2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Right Column - Secondary Content */}
        <div className="space-y-6">
          {/* MD Year Progress Card - Only for students */}
          {safeRole === 'student' && safeMdYear && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <GraduationCap size={20} />
                  {safeMdYear} Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Academic Year</span>
                    <Badge variant="default">{safeMdYear}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Year Progress</span>
                      <span className="font-medium">
                        {safeMdYear === 'MD-1' ? '72%' : 
                         safeMdYear === 'MD-2' ? '85%' : 
                         safeMdYear === 'MD-3' ? '45%' : '92%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: safeMdYear === 'MD-1' ? '72%' : 
                                 safeMdYear === 'MD-2' ? '85%' : 
                                 safeMdYear === 'MD-3' ? '45%' : '92%'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {safeMdYear === 'MD-1' && 'Focus: Basic Sciences & Fundamentals'}
                    {safeMdYear === 'MD-2' && 'Focus: Pathophysiology & Clinical Skills'}
                    {safeMdYear === 'MD-3' && 'Focus: Core Clinical Rotations'}
                    {safeMdYear === 'MD-4' && 'Focus: Electives & Residency Prep'}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {safeRole === 'admin' ? (
            <>
              {/* System Alerts */}
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={20} />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Database Online</p>
                        <p className="text-xs text-gray-500">All systems operational</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Backup Complete</p>
                        <p className="text-xs text-gray-500">Last backup: 2 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} className="text-purple-600" />
                    Admin Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Users size={16} />
                      Manage Users
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <BookOpen size={16} />
                      Course Management
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <BarChart3 size={16} />
                      System Reports
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Settings size={16} />
                      System Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : safeRole === 'teacher' ? (
            <>
              {/* Teaching Status */}
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <Stethoscope size={20} />
                    Teaching Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Active Courses</p>
                        <p className="text-xs text-gray-500">{teacherStats?.assignedCourses || 0} courses assigned</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Student Engagement</p>
                        <p className="text-xs text-gray-500">{teacherStats?.totalStudents || 0} total students</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Teaching Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} className="text-purple-600" />
                    Teaching Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <BookOpen size={16} />
                      My Courses
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Users size={16} />
                      Manage Students
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <ClipboardList size={16} />
                      Create Assignment
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <BarChart3 size={16} />
                      View Grades
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Urgent Tasks */}
              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle size={20} />
                    Urgent Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Immunization Records</p>
                        <p className="text-xs text-gray-500">Due tomorrow</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Ethics Essay</p>
                        <p className="text-xs text-gray-500">Due in 3 days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target size={20} className="text-purple-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="justify-start gap-2"
                      onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate('/courses');
                    }}
                    >
                      <BookOpen size={16} />
                      {safeRole === 'student' ? 'Browse Courses' : 
                       safeRole === 'teacher' ? 'Manage Courses' : 'All Courses'}
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <ClipboardList size={16} />
                      Assignments
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <BarChart3 size={16} />
                      Grades
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start gap-2">
                      <Calendar size={16} />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Announcements */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className="text-blue-600" />
                Latest Announcements
              </CardTitle>
            </CardHeader>
          <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-l-blue-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">Welcome MD-1 Cohort!</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <div className="border-l-4 border-l-green-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">Lab Safety Training Schedule</p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
                <div className="border-l-4 border-l-orange-500 pl-3">
                  <p className="text-sm font-medium text-gray-900">Library Extended Hours</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
            </div>
          </CardContent>
        </Card>

          {/* Quick Actions */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target size={20} className="text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
          <CardContent>
              <div className="grid grid-cols-2 gap-2">
                                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="justify-start gap-2"
                       onClick={(e) => {
                         e.preventDefault();
                         e.stopPropagation();
                         navigate('/courses');
                       }}
                     >
                  <BookOpen size={16} />
                  {safeRole === 'student' ? 'Browse Courses' : 
                   safeRole === 'teacher' ? 'Manage Courses' : 'All Courses'}
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <ClipboardList size={16} />
                  Assignments
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <BarChart3 size={16} />
                  Grades
                </Button>
                <Button variant="outline" size="sm" className="justify-start gap-2">
                  <Calendar size={16} />
                  Schedule
                </Button>
              </div>
          </CardContent>
        </Card>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;


