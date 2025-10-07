import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse, listCourses } from "../lib/courses";
import { updateCourse, deleteCourse } from "../lib/coursesSecure";
import type { CourseInput } from "../types";
import { createEnrollment, listEnrollmentsForStudent, deleteEnrollment, listEnrollments, getEnrollmentsWithStudentDetails, type EnrollmentInput, type Enrollment } from "../lib/enrollments";
import { useToast } from "../hooks/useToast";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { X, Plus, BookOpen, Users, User as UserIcon, FileText, Edit2, Trash2, CheckCircle, UserPlus, UserMinus, UserCheck, Search, ExternalLink, Clock, GraduationCap, Calendar, ChevronRight } from "lucide-react";
import { useRole } from "../hooks/useRole";
import { getAllUsers, type UserProfile } from "../lib/users";
import {
  createTeacherAssignment,
  getTeacherAssignments,
  removeTeacherAssignment,
  isCourseAvailableForAssignment,
  assignTeacherToCourse,
  adminRemoveTeacherAssignment,
  type TeacherAssignment
} from "../lib/teacherAssignments";
import type { Course } from "../types";

// Extended enrollment type with student details
type EnrollmentWithStudentDetails = Enrollment & { 
  id: string;
  studentName: string;
  studentEmail: string;
  studentMdYear: string;
};

const SEMESTERS = Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`);

export default function Courses() {
  const { push } = useToast();
  const { user, role, mdYear } = useRole();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Array<Course & { id: string }>>([]);
  const [enrollments, setEnrollments] = useState<Array<Enrollment & { id: string }>>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled');


            const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseEnrollments, setCourseEnrollments] = useState<Array<EnrollmentWithStudentDetails>>([]);
  const [availableStudents, setAvailableStudents] = useState<Array<UserProfile>>([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [teacherCourses, setTeacherCourses] = useState<Array<TeacherAssignment & { id: string }>>([]);
  const [courseSelectionQuery, setCourseSelectionQuery] = useState("");
  const [teacherId, setTeacherId] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [assignInstructorLoading, setAssignInstructorLoading] = useState(false);
  const [form, setForm] = useState<CourseInput>({
    code: "",
    title: "",
    credits: 0,
    semester: "MD-1",
    instructor: "",
    description: "",
  });
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [teachers, setTeachers] = useState<Array<UserProfile>>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [courseEnrollmentCounts, setCourseEnrollmentCounts] = useState<Record<string, number>>({});

  const canCreate = useMemo(() => role === "admin" || role === "teacher", [role]);
  
  // Helper function to check if teacher is assigned to teach a course
  const isTeacherAssignedToCourse = (courseId: string) => {
    return teacherCourses.some(assignment => assignment.courseId === courseId);
  };
  
  // Filter courses for teacher selection
  const filteredCoursesForSelection = useMemo(() => {
    if (!courseSelectionQuery.trim()) return courses;
    
    const query = courseSelectionQuery.toLowerCase();
    return courses.filter(course => 
      (course.title || '').toLowerCase().includes(query) ||
      (course.code || '').toLowerCase().includes(query) ||
      (course.semester || '').toLowerCase().includes(query)
    );
  }, [courses, courseSelectionQuery]);

  // Load enrollment counts for courses
  const loadEnrollmentCounts = useCallback(async (courseList: Array<Course & { id: string }>) => {
    const counts: Record<string, number> = {};

    await Promise.all(
      courseList.map(async (course) => {
        try {
          const enrollments = await listEnrollments({ courseId: course.id });
          const activeEnrollments = enrollments.filter(e => e.status === 'enrolled');
          counts[course.id] = activeEnrollments.length;
        } catch (error) {
          console.error(`Error loading enrollments for course ${course.id}:`, error);
          counts[course.id] = 0;
        }
      })
    );

    setCourseEnrollmentCounts(counts);
  }, []);

  // Load courses first - most critical data
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setInitialLoading(true);
        setError(null);
        const items = await listCourses();
        setCourses(items);

        // Load enrollment counts after courses are loaded
        if (items.length > 0) {
          await loadEnrollmentCounts(items);
        }
      } catch (e: unknown) {
        const error = e as Error;
        console.error('? Error loading courses:', error);
        setError(error?.message ?? "Failed to load courses");
      } finally {
        setInitialLoading(false);
      }
    };

    loadCourses();
  }, [loadEnrollmentCounts]);

  // Load teachers separately for dropdown
  useEffect(() => {
    const loadTeachers = async () => {
      if (!canCreate) return; // Only load if user can create courses

      try {
        setTeachersLoading(true);
        const allUsers = await getAllUsers();
        const teacherUsers = allUsers.filter(user => user.role === 'teacher' && user.status === 'active');
        setTeachers(teacherUsers);
      } catch (error) {
        console.error('Error loading teachers:', error);
      } finally {
        setTeachersLoading(false);
      }
    };

    loadTeachers();
  }, [canCreate]);

  // Load student enrollments separately
  useEffect(() => {
    const loadStudentEnrollments = async () => {
      if (role !== 'student' || !user?.email) return;

      try {
        const allUsers = await getAllUsers();
        const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());

        if (currentUser?.id) {
          const studentEnrollments = await listEnrollmentsForStudent(currentUser.id);
          setEnrollments(studentEnrollments);
        }
      } catch (error) {
        console.error('Error loading student enrollments:', error);
        setEnrollments([]);
      }
    };

    loadStudentEnrollments();
  }, [role, user?.email]);

  // Load teacher assignments separately
  useEffect(() => {
    const loadTeacherAssignments = async () => {
      if (role !== 'teacher' || !user?.email) return;

      try {
        const allUsers = await getAllUsers();
        const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());

        if (currentUser?.id) {
          setTeacherId(currentUser.id);
          const teacherAssignments = await getTeacherAssignments(currentUser.id);
          setTeacherCourses(teacherAssignments);
        }
      } catch (error) {
        console.error('Error loading teacher assignments:', error);
        setTeacherCourses([]);
      }
    };

    loadTeacherAssignments();
  }, [role, user?.email]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const courseData = {
        ...form,
        instructor: courseInstructor,
        description: courseDescription,
      };
      await createCourse(courseData);
      const items = await listCourses();
      setCourses(items);
      // Reset form
      setForm({ code: "", title: "", credits: 0, semester: "MD-1", instructor: "", description: "" });
      setCourseInstructor("");
      setCourseDescription("");
      
      push({ variant: 'success', title: 'Course created', description: `${form.code} � ${form.title}` });
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message ?? "Failed to create course");
      push({ variant: 'error', title: 'Failed to create course', description: error?.message });
    }
  }

  function handleOpenCreateModal() {
    // Scroll to top when opening modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate("/courses/new");
  }

  function handleCloseCreateModal() {
    
    // Reset form
    setForm({ code: "", title: "", credits: 0, semester: "MD-1", instructor: "", description: "" });
    setCourseInstructor("");
    setCourseDescription("");
  }

  function handleEditCourse(course: Course) {
    // Scroll to top when opening modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingCourse(course);
    setForm({
      code: course.code,
      title: course.title,
      credits: course.credits,
      semester: course.semester,
      instructor: course.instructor,
      description: course.description,
    });
    setCourseInstructor(course.instructor);
    setCourseDescription(course.description);
    
  }

  function handleCloseEditModal() {
    
    setEditingCourse(null);
    // Reset form
    setForm({ code: "", title: "", credits: 0, semester: "MD-1", instructor: "", description: "" });
    setCourseInstructor("");
    setCourseDescription("");
  }

  async function handleUpdateCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCourse) return;
    
    setError(null);
    try {
      const courseData = {
        ...form,
        instructor: courseInstructor,
        description: courseDescription,
      };
      await updateCourse(editingCourse.id, courseData);
      const items = await listCourses();
      setCourses(items);
      handleCloseEditModal();
      push({ variant: 'success', title: 'Course updated', description: `${form.code} � ${form.title}` });
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message ?? "Failed to update course");
      push({ variant: 'error', title: 'Failed to update course', description: error?.message });
    }
  }

  async function handleDeleteCourse(courseId: string) {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteCourse(courseId);
      const items = await listCourses();
      setCourses(items);
      push({ variant: 'success', title: 'Course deleted', description: 'Course has been successfully deleted' });
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message ?? "Failed to delete course");
      push({ variant: 'error', title: 'Failed to delete course', description: error?.message });
    }
  }

  // Enrollment functions for students
  async function handleEnrollInCourse(courseId: string) {
    if (!user?.uid) return;
    
    try {
      console.log("?? Enrolling user:", user.email, "with UID:", user.uid);
      
      // First, get the user's Firestore document ID
      const allUsers = await getAllUsers();
      const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
      
      if (!currentUser?.id) {
        throw new Error("User profile not found in database");
      }
      
      console.log("?? Found user document ID:", currentUser.id);
      
      const enrollmentData: EnrollmentInput = {
        studentId: currentUser.id, // Use Firestore document ID instead of Firebase Auth UID
        courseId: courseId,
        semesterId: 'current', // You might want to use actual session ID
        status: 'enrolled'
      };
      
      console.log("?? Creating enrollment with data:", enrollmentData);
      await createEnrollment(enrollmentData);
      
      // Refresh enrollments using the Firestore document ID
      const studentEnrollments = await listEnrollmentsForStudent(currentUser.id);
      console.log("?? Student enrollments after enrollment:", studentEnrollments);
      setEnrollments(studentEnrollments);

      // Refresh enrollment counts
      await loadEnrollmentCounts(courses);

      push({ variant: 'success', title: 'Enrolled successfully', description: 'You have been enrolled in this course' });
    } catch (e: unknown) {
      const error = e as Error;
      console.error("? Enrollment error:", error);
      setError(error?.message ?? "Failed to enroll in course");
      push({ variant: 'error', title: 'Failed to enroll', description: error?.message });
    }
  }

  async function handleUnenrollFromCourse(enrollmentId: string) {
    if (!confirm('Are you sure you want to unenroll from this course?')) {
      return;
    }
    
    try {
      await deleteEnrollment(enrollmentId);
      
      // Refresh enrollments
      if (user?.uid) {
        // Get the user's Firestore document ID first
        const allUsers = await getAllUsers();
        const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
        
        if (currentUser?.id) {
          const studentEnrollments = await listEnrollmentsForStudent(currentUser.id);
          setEnrollments(studentEnrollments);

          // Refresh enrollment counts
          await loadEnrollmentCounts(courses);
        }
      }

      push({ variant: 'success', title: 'Unenrolled successfully', description: 'You have been unenrolled from this course' });
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message ?? "Failed to unenroll from course");
      push({ variant: 'error', title: 'Failed to unenroll', description: error?.message });
    }
  }

  // Helper functions for student view - memoized for performance
  const isEnrolledInCourse = useCallback((courseId: string) => {
    return enrollments.some(enrollment => enrollment.courseId === courseId && enrollment.status === 'enrolled');
  }, [enrollments]);

  const getEnrollmentId = useCallback((courseId: string) => {
    const enrollment = enrollments.find(e => e.courseId === courseId && e.status === 'enrolled');
    return enrollment?.id;
  }, [enrollments]);

  const getEnrolledCourses = useMemo(() => {
    return courses.filter(course => course.id && isEnrolledInCourse(course.id));
  }, [courses, isEnrolledInCourse]);

  const getCoursesForCurrentMD = useMemo(() => {
    if (!mdYear) return courses;
    return courses.filter(course => course.semester === mdYear);
  }, [courses, mdYear]);

  // Filter available students based on search query
  const filteredAvailableStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return availableStudents;
    
    const query = studentSearchQuery.toLowerCase();
    return availableStudents.filter(student => 
      (student.name || '').toLowerCase().includes(query) ||
      (student.email || '').toLowerCase().includes(query) ||
      (student.mdYear || '').toLowerCase().includes(query)
    );
  }, [availableStudents, studentSearchQuery]);
  const availableCoursesForStudent = useMemo(() => {
    if (role !== 'student') return [];
    return getCoursesForCurrentMD.filter(course => !isEnrolledInCourse(course.id));
  }, [role, getCoursesForCurrentMD, isEnrolledInCourse]);

  const coursesToShow = useMemo(() => {
    if (role === 'student') {
      return activeTab === 'enrolled' ? getEnrolledCourses : availableCoursesForStudent;
    }

    if (role === 'teacher') {
      const assignedCourseIds = teacherCourses.map(assignment => assignment.courseId);
      return courses.filter(course => assignedCourseIds.includes(course.id));
    }

    return courses;
  }, [role, activeTab, getEnrolledCourses, availableCoursesForStudent, teacherCourses, courses]);

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return coursesToShow;
    }

    return coursesToShow.filter(course => {
      const title = (course.title || '').toLowerCase();
      const code = (course.code || '').toLowerCase();
      return title.includes(normalizedQuery) || code.includes(normalizedQuery);
    });
  }, [coursesToShow, query]);

  const availableCoursesCount = availableCoursesForStudent.length;

  // For students: auto-switch to available tab if nothing enrolled
  useEffect(() => {
    if (role === 'student') {
      if (activeTab === 'enrolled' && getEnrolledCourses.length === 0 && availableCoursesForStudent.length > 0) {
        setActiveTab('available');
      }
    }
  }, [role, activeTab, getEnrolledCourses.length, availableCoursesForStudent.length]);

    // Course detail modal functions
  function handleViewCourseDetails(course: Course) {
    // Prevent navigation for students who are not enrolled in the course
    if (role === 'student' && course.id && !isEnrolledInCourse(course.id)) {
      return;
    }
    if (!course.id) {
      console.log('? Course has no ID:', course);
      return;
    }
    console.log('?? Navigating to course details:', course.id, course.code, course.title);
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/courses/${course.id}`);
  }

  async function handleOpenCourseDetail(course: Course) {
    if (!course.id) return;
    navigate(`/courses/${course.id}/enrollments`);
  }


  















  // Render
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
        <div className="flex items-center gap-3">
          {role === 'teacher' && (
            <Button
              variant="outline"
              onClick={() => navigate('/courses/teach')}
              className="flex items-center gap-2 border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 transition-all duration-200"
            >
              <BookOpen size={16} /> Select Courses to Teach
            </Button>
          )}
          {canCreate && (
            <Button
              variant="primary"
              onClick={() => navigate('/courses/new')}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-lg shadow-sky-500/25 border-0"
            >
              <Plus size={16} /> New Course
            </Button>
          )}
        </div>
      </div>

      {/* Student tabs to toggle Enrolled vs Available */}
      {role === 'student' && (
        <div className="mb-6">
          <div className="flex space-x-1 bg-gradient-to-r from-slate-50 to-slate-100 p-1.5 rounded-xl border border-slate-200/60 shadow-sm">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'enrolled'
                  ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25 transform scale-[1.02]'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-white/70 active:scale-95'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4" />
                My Enrolled Courses ({getEnrolledCourses.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'available'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25 transform scale-[1.02]'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-white/70 active:scale-95'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4" />
                Available Courses ({availableCoursesCount})
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={role === 'student' ? 'Search your courses...' : 'Search courses by code or title...'}
          className="w-full pl-3 pr-4 py-3 border-2 border-slate-200 rounded-2xl bg-white/85 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-colors duration-200 hover:border-slate-300/80 text-slate-700 placeholder-slate-400"
        />
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50/90 text-red-700 border border-red-200/60 shadow-soft">{error}</div>
      )}

      {initialLoading ? (
        /* Loading state */
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-32 animate-pulse">
              <CardContent className="p-6 h-full">
                <div className="flex items-center space-x-6 h-full">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-8 bg-slate-200 rounded w-20"></div>
                    <div className="h-8 bg-slate-200 rounded w-16"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        /* Empty state */
        <Card className="py-12">
          <CardContent className="text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              {query ? "No courses found" : role === 'student' && activeTab === 'enrolled' ? "No enrolled courses" : "No courses available"}
            </h3>
            <p className="text-slate-500 mb-4">
              {query
                ? "Try adjusting your search terms"
                : role === 'student' && activeTab === 'enrolled'
                  ? "You haven't enrolled in any courses yet"
                  : "There are no courses available at the moment"
              }
            </p>
            {role === 'student' && activeTab === 'enrolled' && availableCoursesForStudent.length > 0 && (
              <Button
                onClick={() => setActiveTab('available')}
                variant="primary"
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 border-0"
              >
                Browse Available Courses
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Course cards */
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const enrollmentCount = courseEnrollmentCounts[course.id] || 0;
            const isEnrolled = isEnrolledInCourse(course.id);
            const canEnroll = role === 'student' && !isEnrolled;
            const canUnenroll = role === 'student' && isEnrolled;

            // Generate a color based on the course title for variety
            const getGradientColor = (title: string) => {
              const colors = [
                'from-blue-500 to-blue-600',
                'from-green-500 to-green-600',
                'from-purple-500 to-purple-600',
                'from-red-500 to-red-600',
                'from-orange-500 to-orange-600',
                'from-teal-500 to-teal-600',
                'from-pink-500 to-pink-600',
                'from-indigo-500 to-indigo-600',
              ];
              const index = title.charCodeAt(0) % colors.length;
              return colors[index];
            };

            return (
              <Card
                key={course.id}
                className="group hover:shadow-xl hover:shadow-sky-500/10 hover:border-sky-200 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => handleViewCourseDetails(course)}
              >
                <CardContent className="p-0">
                  <div className="flex items-center">
                    {/* Course Icon */}
                    <div className={`w-20 h-20 flex items-center justify-center bg-gradient-to-br ${getGradientColor(course.title)} text-white`}>
                      <span className="text-2xl font-bold">
                        {course.title.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-4">
                          {/* Title and Code */}
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                              {course.title}
                            </h3>
                            <Badge variant="outline" className="text-xs font-medium">
                              {course.code}
                            </Badge>
                          </div>

                          {/* Description */}
                          {course.description && (
                            <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                              {course.description}
                            </p>
                          )}

                          {/* Course Details */}
                          <div className="flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{course.semester}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.credits} {course.credits === 1 ? 'credit' : 'credits'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{enrollmentCount} {enrollmentCount === 1 ? 'student' : 'students'}</span>
                            </div>
                            {course.instructor && (
                              <div className="flex items-center gap-1">
                                <GraduationCap className="h-4 w-4" />
                                <span>{course.instructor}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-col items-end gap-3">
                          {/* Enrollment Status */}
                          {role === 'student' && (
                            <div className="flex items-center gap-2">
                              {isEnrolled ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Enrolled
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-slate-600">
                                  Available
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {/* Student Actions */}
                            {canEnroll && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEnrollInCourse(course.id);
                                }}
                                className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-lg shadow-sky-500/25"
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                Enroll
                              </Button>
                            )}

                            {canUnenroll && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const id = getEnrollmentId(course.id);
                                  if (id) handleUnenrollFromCourse(id);
                                }}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <UserMinus className="h-4 w-4 mr-1" />
                                Unenroll
                              </Button>
                            )}

                            {/* Admin/Teacher Actions */}
                            {(role === 'admin' || role === 'teacher') && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/courses/${course.id}/edit`);
                                  }}
                                  className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                                >
                                  <Edit2 className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              </>
                            )}

                            {role === 'admin' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/courses/${course.id}/assign-instructor`);
                                }}
                                className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800"
                              >
                                <UserCheck className="h-4 w-4 mr-1" />
                                Instructor
                              </Button>
                            )}

                            {/* View Details Arrow */}
                            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <ChevronRight className="h-5 w-5 text-sky-400" />
                            </div>
                          </div>
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
  );
}
