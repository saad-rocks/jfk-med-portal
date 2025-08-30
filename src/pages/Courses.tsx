import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCourse, listCourses, updateCourse, deleteCourse } from "../lib/courses";
import type { CourseInput } from "../types";
import { createEnrollment, listEnrollmentsForStudent, deleteEnrollment, listEnrollments, type EnrollmentInput, type Enrollment } from "../lib/enrollments";
import { useToast } from "../hooks/useToast";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { X, Plus, BookOpen, Users, User as UserIcon, FileText, Edit2, Trash2, CheckCircle, UserPlus, UserMinus, UserCheck, Search, ExternalLink } from "lucide-react";
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


  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSelectCourseModal, setShowSelectCourseModal] = useState(false);
  const [showAssignInstructorModal, setShowAssignInstructorModal] = useState(false);
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
    capacity: 0,
    instructor: "",
    description: "",
  });
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [teachers, setTeachers] = useState<Array<UserProfile>>([]);
  const [teachersLoading, setTeachersLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

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

  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);
        setError(null);

        // Debug information
        console.log('🔍 Loading courses - Debug Info:', {
          userEmail: user?.email,
          userRole: role,
          userMdYear: mdYear,
          userUid: user?.uid
        });


        // Load courses first
        const items = await listCourses();
        console.log('📚 Loaded courses:', items.length);
        setCourses(items);

        // Load teachers for instructor dropdown
        setTeachersLoading(true);
        const allUsers = await getAllUsers();
        console.log('👥 All users in system:', allUsers.length);
        const teacherUsers = allUsers.filter(user => user.role === 'teacher' && user.status === 'active');
        setTeachers(teacherUsers);
        setTeachersLoading(false);

        // Load enrollments for students - this is critical for the loading state
        if (role === 'student' && user?.email) {
          console.log('🎓 Looking for student profile for:', user.email);
          // Get the user's Firestore document ID first
          const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
          console.log('👤 Found student profile:', currentUser);

          if (currentUser?.id) {
            console.log('📋 Loading enrollments for student ID:', currentUser.id);
            const studentEnrollments = await listEnrollmentsForStudent(currentUser.id);
            console.log('📚 Student enrollments loaded:', studentEnrollments.length);
            setEnrollments(studentEnrollments);
          } else {
            console.log('⚠️ No student profile found for email:', user.email);
            setEnrollments([]);
          }
        } else if (role === 'student') {
          console.log('⚠️ Student role but no email available');
          setEnrollments([]);
        } else {
          console.log('ℹ️ Not a student role, skipping enrollment loading');
        }

        // Load teacher assignments for teachers
        if (role === 'teacher' && user?.email) {
          const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());

          if (currentUser?.id) {
            setTeacherId(currentUser.id);
            const teacherAssignments = await getTeacherAssignments(currentUser.id);
            setTeacherCourses(teacherAssignments);
          } else {
            setTeacherCourses([]);
          }
        } else if (role === 'teacher') {
          setTeacherCourses([]);
        }

        // Only set loading to false after ALL data is loaded
        // Add a small delay to ensure state updates are processed
        setTimeout(() => {
          setInitialLoading(false);
        }, 100);

      } catch (e: unknown) {
        const error = e as Error;
        console.error('❌ Error loading courses:', error);
        setError(error?.message ?? "Failed to load courses");
        setTeachersLoading(false);
        // Even on error, set loading to false to prevent infinite loading
        setInitialLoading(false);
      }
    })();
  }, [role, user?.uid, user?.email]);

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
      setForm({ code: "", title: "", credits: 0, semester: "MD-1", capacity: 0, instructor: "", description: "" });
      setCourseInstructor("");
      setCourseDescription("");
      setShowCreateModal(false);
      push({ variant: 'success', title: 'Course created', description: `${form.code} — ${form.title}` });
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message ?? "Failed to create course");
      push({ variant: 'error', title: 'Failed to create course', description: error?.message });
    }
  }

  function handleOpenCreateModal() {
    setShowCreateModal(true);
  }

  function handleCloseCreateModal() {
    setShowCreateModal(false);
    // Reset form
    setForm({ code: "", title: "", credits: 0, semester: "MD-1", capacity: 0, instructor: "", description: "" });
    setCourseInstructor("");
    setCourseDescription("");
  }

  function handleEditCourse(course: Course) {
    setEditingCourse(course);
    setForm({
      code: course.code,
      title: course.title,
      credits: course.credits,
      semester: course.semester,
      capacity: course.capacity,
      instructor: course.instructor,
      description: course.description,
    });
    setCourseInstructor(course.instructor);
    setCourseDescription(course.description);
    setShowEditModal(true);
  }

  function handleCloseEditModal() {
    setShowEditModal(false);
    setEditingCourse(null);
    // Reset form
    setForm({ code: "", title: "", credits: 0, semester: "MD-1", capacity: 0, instructor: "", description: "" });
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
      push({ variant: 'success', title: 'Course updated', description: `${form.code} — ${form.title}` });
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
      console.log("🎓 Enrolling user:", user.email, "with UID:", user.uid);
      
      // First, get the user's Firestore document ID
      const allUsers = await getAllUsers();
      const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());
      
      if (!currentUser?.id) {
        throw new Error("User profile not found in database");
      }
      
      console.log("📋 Found user document ID:", currentUser.id);
      
      const enrollmentData: EnrollmentInput = {
        studentId: currentUser.id, // Use Firestore document ID instead of Firebase Auth UID
        courseId: courseId,
        semesterId: 'current', // You might want to use actual session ID
        status: 'enrolled'
      };
      
      console.log("📝 Creating enrollment with data:", enrollmentData);
      await createEnrollment(enrollmentData);
      
      // Refresh enrollments using the Firestore document ID
      const studentEnrollments = await listEnrollmentsForStudent(currentUser.id);
      console.log("📋 Student enrollments after enrollment:", studentEnrollments);
      setEnrollments(studentEnrollments);
      
      push({ variant: 'success', title: 'Enrolled successfully', description: 'You have been enrolled in this course' });
    } catch (e: unknown) {
      const error = e as Error;
      console.error("❌ Enrollment error:", error);
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
        }
      }
      
      push({ variant: 'success', title: 'Unenrolled successfully', description: 'You have been unenrolled from this course' });
    } catch (e: unknown) {
      const error = e as Error;
      setError(error?.message ?? "Failed to unenroll from course");
      push({ variant: 'error', title: 'Failed to unenroll', description: error?.message });
    }
  }

  // Helper functions for student view
  const isEnrolledInCourse = (courseId: string) => {
    return enrollments.some(enrollment => enrollment.courseId === courseId && enrollment.status === 'enrolled');
  };

  const getEnrollmentId = (courseId: string) => {
    const enrollment = enrollments.find(e => e.courseId === courseId && e.status === 'enrolled');
    return enrollment?.id;
  };

  const getEnrolledCourses = () => {
    return courses.filter(course => course.id && isEnrolledInCourse(course.id));
  };

  const getCoursesForCurrentMD = () => {
    if (!mdYear) return courses;
    return courses.filter(course => course.semester === mdYear);
  };

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

    // Course detail modal functions
  function handleViewCourseDetails(course: Course) {
    if (!course.id) {
      console.log('❌ Course has no ID:', course);
      return;
    }
    console.log('🚀 Navigating to course details:', course.id, course.code, course.title);
    navigate(`/courses/${course.id}`);
  }

  async function handleOpenCourseDetail(course: Course) {
    if (!course.id) return;
    
    setSelectedCourse(course);
    setShowDetailModal(true);
    setEnrollmentLoading(true);
    setStudentSearchQuery(""); // Reset search query
    
    try {
      // Fetch all students first
      const allUsers = await getAllUsers();
      const students = allUsers.filter(user => user.role === 'student');
      console.log("👥 All students in system:", students.map(s => ({ id: s.id, name: s.name, email: s.email })));
      
      // Fetch course enrollments
      const enrollments = await listEnrollments({ courseId: course.id });
      const activeEnrollments = enrollments.filter(e => e.status === 'enrolled');
      console.log("📚 Active enrollments for course:", activeEnrollments);
      
      // Enhance enrollments with student details
      const enrollmentsWithStudentDetails = activeEnrollments.map(enrollment => {
        console.log("🔍 Looking for student with ID:", enrollment.studentId);
        const student = students.find(s => s.id === enrollment.studentId);
        console.log("👤 Found student:", student?.name || student?.email || 'Unknown Student');
        
        return {
          ...enrollment,
          studentName: student?.name || student?.email || 'Unknown Student',
          studentEmail: student?.email || '',
          studentMdYear: student?.mdYear || 'MD-1'
        };
      });
      
      setCourseEnrollments(enrollmentsWithStudentDetails);
      
      // Filter out already enrolled students
      const enrolledStudentIds = activeEnrollments.map(e => e.studentId);
      const availableStudentsList = students.filter(student => 
        student.id && !enrolledStudentIds.includes(student.id) && 
        student.mdYear === course.semester
      );
      setAvailableStudents(availableStudentsList);
    } catch (error) {
      console.error('Failed to load course details:', error);
      push({ variant: 'error', title: 'Error', description: 'Failed to load course details' });
    } finally {
      setEnrollmentLoading(false);
    }
  }

  function handleCloseDetailModal() {
    setShowDetailModal(false);
    setSelectedCourse(null);
    setCourseEnrollments([]);
    setAvailableStudents([]);
  }

  function handleOpenAssignInstructorModal() {
    setShowAssignInstructorModal(true);
    setSelectedInstructor(selectedCourse?.instructor || "");
  }

  function handleCloseAssignInstructorModal() {
    setShowAssignInstructorModal(false);
    setSelectedInstructor("");
  }

  async function handleAssignInstructor() {
    if (!selectedCourse || !selectedInstructor || !selectedCourse.id) return;
    
    setAssignInstructorLoading(true);
    try {
      // Find the teacher user by email
      const teacherUser = teachers.find(t => t.email === selectedInstructor);
      if (!teacherUser || !teacherUser.id) {
        throw new Error("Selected teacher not found or has no valid ID");
      }

      // Assign teacher to course using the admin function
      await assignTeacherToCourse(teacherUser.id, selectedInstructor, selectedCourse.id);
      
      // Refresh courses to show updated instructor
      const updatedCourses = await listCourses();
      setCourses(updatedCourses);
      
      // Update the selected course in the detail modal
      const updatedCourse = updatedCourses.find(c => c.id === selectedCourse.id);
      if (updatedCourse) {
        setSelectedCourse(updatedCourse);
      }
      
      push({ 
        variant: 'success', 
        title: 'Instructor Assigned', 
        description: `${selectedInstructor} has been assigned to ${selectedCourse.code}` 
      });
      
      handleCloseAssignInstructorModal();
    } catch (error: unknown) {
      const err = error as Error;
      push({ 
        variant: 'error', 
        title: 'Assignment Failed', 
        description: err?.message || 'Failed to assign instructor to course' 
      });
    } finally {
      setAssignInstructorLoading(false);
    }
  }

  async function handleRemoveInstructor() {
    if (!selectedCourse || !selectedCourse.id) return;
    
    if (!confirm('Are you sure you want to remove the current instructor from this course?')) {
      return;
    }
    
    setAssignInstructorLoading(true);
    try {
      // Remove teacher assignment using the admin function
      await adminRemoveTeacherAssignment(selectedCourse.id);
      
      // Refresh courses to show updated instructor
      const updatedCourses = await listCourses();
      setCourses(updatedCourses);
      
      // Update the selected course in the detail modal
      const updatedCourse = updatedCourses.find(c => c.id === selectedCourse.id);
      if (updatedCourse) {
        setSelectedCourse(updatedCourse);
      }
      
      push({ 
        variant: 'success', 
        title: 'Instructor Removed', 
        description: `Instructor has been removed from ${selectedCourse.code}` 
      });
      
      handleCloseAssignInstructorModal();
    } catch (error: unknown) {
      const err = error as Error;
      push({ 
        variant: 'error', 
        title: 'Removal Failed', 
        description: err?.message || 'Failed to remove instructor from course' 
      });
    } finally {
      setAssignInstructorLoading(false);
    }
  }

  async function handleEnrollStudent(studentId: string) {
    if (!selectedCourse || !selectedCourse.id) return;
    
    try {
      const enrollmentData: EnrollmentInput = {
        studentId: studentId,
        courseId: selectedCourse.id,
        semesterId: 'current',
        status: 'enrolled'
      };
      
      await createEnrollment(enrollmentData);
      
      // Refresh enrollments and available students with student details
      const allUsers = await getAllUsers();
      const students = allUsers.filter(user => user.role === 'student');
      
      const enrollments = await listEnrollments({ courseId: selectedCourse.id });
      const activeEnrollments = enrollments.filter(e => e.status === 'enrolled');
      
      // Enhance enrollments with student details
      const enrollmentsWithStudentDetails = activeEnrollments.map(enrollment => {
        const student = students.find(s => s.id === enrollment.studentId);
        return {
          ...enrollment,
          studentName: student?.name || student?.email || 'Unknown Student',
          studentEmail: student?.email || '',
          studentMdYear: student?.mdYear || 'MD-1'
        };
      });
      
      setCourseEnrollments(enrollmentsWithStudentDetails);
      
      const enrolledStudentIds = activeEnrollments.map(e => e.studentId);
      const availableStudentsList = students.filter(student => 
        student.id && !enrolledStudentIds.includes(student.id) && 
        student.mdYear === selectedCourse.semester
      );
      setAvailableStudents(availableStudentsList);
      
      push({ variant: 'success', title: 'Student Enrolled', description: 'Student has been successfully enrolled' });
    } catch (error: unknown) {
      const err = error as Error;
      push({ variant: 'error', title: 'Enrollment Failed', description: err?.message || 'Failed to enroll student' });
    }
  }

  async function handleUnenrollStudent(enrollmentId: string) {
    if (!confirm('Are you sure you want to unenroll this student from the course?')) {
      return;
    }
    
    try {
      await deleteEnrollment(enrollmentId);
      
      // Refresh enrollments and available students with student details
      if (selectedCourse && selectedCourse.id) {
        const allUsers = await getAllUsers();
        const students = allUsers.filter(user => user.role === 'student');
        
        const enrollments = await listEnrollments({ courseId: selectedCourse.id });
        const activeEnrollments = enrollments.filter(e => e.status === 'enrolled');
        
        // Enhance enrollments with student details
        const enrollmentsWithStudentDetails = activeEnrollments.map(enrollment => {
          const student = students.find(s => s.id === enrollment.studentId);
          return {
            ...enrollment,
            studentName: student?.name || student?.email || 'Unknown Student',
            studentEmail: student?.email || '',
            studentMdYear: student?.mdYear || 'MD-1'
          };
        });
        
        setCourseEnrollments(enrollmentsWithStudentDetails);
        
        const enrolledStudentIds = activeEnrollments.map(e => e.studentId);
        const availableStudentsList = students.filter(student => 
          student.id && !enrolledStudentIds.includes(student.id) && 
          student.mdYear === selectedCourse.semester
        );
        setAvailableStudents(availableStudentsList);
      }
      
      push({ variant: 'success', title: 'Student Unenrolled', description: 'Student has been successfully unenrolled' });
    } catch (error: unknown) {
      const err = error as Error;
      push({ variant: 'error', title: 'Unenrollment Failed', description: err?.message || 'Failed to unenroll student' });
    }
  }

  // Course selection functions for teachers
  async function handleOpenSelectCourseModal() {
    console.log('🔍 Opening course selection modal with:', { role, userEmail: user?.email, teacherId });

    // Check if teacher ID is set
    if (role === 'teacher' && user?.email) {
      try {
        // If teacherId is not set, try to find it
        if (!teacherId) {
          console.log('📋 Fetching all users to find teacher...');
          const allUsers = await getAllUsers();
          const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());

          if (currentUser?.id) {
            console.log('✅ Setting teacher ID:', currentUser.id);
            setTeacherId(currentUser.id);
            const teacherAssignments = await getTeacherAssignments(currentUser.id);
            setTeacherCourses(teacherAssignments);
            console.log('📚 Teacher assignments loaded:', teacherAssignments);
          } else {
            console.log('⚠️ Teacher profile not found - attempting to create one');

            // Try to create teacher profile automatically if it doesn't exist
            try {
              const { httpsCallable } = await import('firebase/functions');
              const { functions } = await import('../firebase');
              const createProfileFn = httpsCallable(functions, 'createUserProfile');

              const result = await createProfileFn({
                name: user.displayName || user.email?.split('@')[0] || 'Teacher',
                role: 'teacher'
              });

              const data = result.data as { ok: boolean; profileId?: string; existing?: boolean };

              if (data.ok && data.profileId) {
                console.log('✅ Teacher profile created:', data.profileId);
                setTeacherId(data.profileId);
                const teacherAssignments = await getTeacherAssignments(data.profileId);
                setTeacherCourses(teacherAssignments);

                push({
                  variant: 'success',
                  title: 'Profile Created',
                  description: 'Your teacher profile has been created automatically.'
                });
              } else {
                throw new Error('Failed to create teacher profile');
              }
            } catch (createError: any) {
              console.error('❌ Failed to create teacher profile:', createError);
              push({
                variant: 'error',
                title: 'Profile Setup Required',
                description: 'Your teacher profile could not be created. Please complete your profile setup first.'
              });
              navigate('/profile-setup');
              return;
            }
          }
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error('❌ Error loading teacher data:', err);
        push({ variant: 'error', title: 'Error', description: err?.message || 'Failed to load teacher data' });
        return;
      }
    } else {
      console.log('❌ Missing required data:', { role, userEmail: user?.email });
      push({ variant: 'error', title: 'Error', description: 'Missing user data. Please try logging in again.' });
      return;
    }

    console.log('🚀 Opening modal...');
    setShowSelectCourseModal(true);
    setCourseSelectionQuery("");
  }

  function handleCloseSelectCourseModal() {
    setShowSelectCourseModal(false);
    setCourseSelectionQuery("");
  }

  async function handleSelectCourseToTeach(course: Course) {
    console.log('🔍 handleSelectCourseToTeach called with:', { course, teacherId, role, userEmail: user?.email });

    // Get the current teacher ID (either from state or by looking it up)
    let currentTeacherId = teacherId;
    if (!currentTeacherId && role === 'teacher' && user?.email) {
      console.log('❌ Teacher ID not found, attempting to set it...');
      try {
        const allUsers = await getAllUsers();
        const currentUser = allUsers.find(u => u.email?.toLowerCase() === user.email?.toLowerCase());

        if (currentUser?.id) {
          console.log('✅ Found teacher ID:', currentUser.id);
          currentTeacherId = currentUser.id;
          setTeacherId(currentUser.id);
        } else {
          console.log('⚠️ Teacher profile not found - attempting to create one');

          // Try to create teacher profile automatically if it doesn't exist
          try {
            const { httpsCallable } = await import('firebase/functions');
            const { functions } = await import('../firebase');
            const createProfileFn = httpsCallable(functions, 'createUserProfile');

            const result = await createProfileFn({
              name: user.displayName || user.email?.split('@')[0] || 'Teacher',
              role: 'teacher'
            });

            const data = result.data as { ok: boolean; profileId?: string; existing?: boolean };

            if (data.ok && data.profileId) {
              console.log('✅ Teacher profile created:', data.profileId);
              currentTeacherId = data.profileId;
              setTeacherId(data.profileId);

              push({
                variant: 'success',
                title: 'Profile Created',
                description: 'Your teacher profile has been created automatically.'
              });
            } else {
              throw new Error('Failed to create teacher profile');
            }
          } catch (createError: any) {
            console.error('❌ Failed to create teacher profile:', createError);
            push({
              variant: 'error',
              title: 'Profile Setup Required',
              description: 'Your teacher profile could not be created. Please complete your profile setup first.'
            });
            navigate('/profile-setup');
            return;
          }
        }
      } catch (error: unknown) {
        const err = error as Error;
        console.error('❌ Error loading teacher data:', err);
        push({ variant: 'error', title: 'Error', description: err?.message || 'Failed to load teacher data' });
        return;
      }
    }
    
    if (!currentTeacherId) {
      console.log('❌ Still no teacher ID found');
      push({ variant: 'error', title: 'Error', description: 'Teacher ID not found. Please try again.' });
      return;
    }

    if (isTeacherAssignedToCourse(course.id)) {
      // Remove course from teacher's assigned courses
      const assignment = teacherCourses.find(a => a.courseId === course.id);
      if (assignment) {
        try {
          await removeTeacherAssignment(assignment.id);
          setTeacherCourses(prev => prev.filter(a => a.courseId !== course.id));
          
          // Refresh courses to show updated instructor
          console.log('🔄 Refreshing courses after removal...');
          const updatedCourses = await listCourses();
          console.log('📋 Updated courses after removal:', updatedCourses.map(c => ({ id: c.id, code: c.code, instructor: c.instructor })));
          setCourses(updatedCourses);
          
          push({ variant: 'success', title: 'Course Removed', description: `You are no longer teaching ${course.code}` });
        } catch (error: unknown) {
          const err = error as Error;
          push({ variant: 'error', title: 'Error', description: err?.message || 'Failed to remove course assignment' });
        }
      }
    } else {
      // Check if course is available for assignment
      try {
        const isAvailable = await isCourseAvailableForAssignment(course.id);
        if (!isAvailable) {
          push({ variant: 'error', title: 'Course Unavailable', description: 'This course already has an instructor assigned' });
          return;
        }
        
        console.log('📝 Creating teacher assignment with ID:', currentTeacherId);
        
        const assignmentData = {
          teacherId: currentTeacherId,
          teacherEmail: user?.email || '',
          courseId: course.id,
          courseCode: course.code,
          courseTitle: course.title,
          semester: course.semester
        };
        
        console.log('📋 Assignment data:', assignmentData);
        await createTeacherAssignment(assignmentData);
        
        // Refresh teacher assignments and courses
        const updatedAssignments = await getTeacherAssignments(currentTeacherId);
        setTeacherCourses(updatedAssignments);
        
        // Refresh courses to show updated instructor
        console.log('🔄 Refreshing courses after assignment...');
        const updatedCourses = await listCourses();
        console.log('📋 Updated courses:', updatedCourses.map(c => ({ id: c.id, code: c.code, instructor: c.instructor })));
        setCourses(updatedCourses);
        
        push({ variant: 'success', title: 'Course Selected', description: `You are now teaching ${course.code}` });
      } catch (error: unknown) {
        const err = error as Error;
        push({ variant: 'error', title: 'Error', description: err?.message || 'Failed to assign course' });
      }
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
             <PageHeader
         title="Courses"
         breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Courses' }]}
                   actions={
            <PageActions>
              {role === 'teacher' && (
                <Button 
                  variant="outline" 
                  onClick={handleOpenSelectCourseModal}
                  className="flex items-center gap-2"
                >
                  <BookOpen size={16} />
                  Select Courses to Teach
                </Button>
              )}
              {canCreate && (
                <Button 
                  variant="primary" 
                  onClick={handleOpenCreateModal}
                  className="flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Course
                </Button>
              )}
            </PageActions>
          }
       />

       

             {/* Student-specific tabs */}
       {role === 'student' && (
         <div className="mb-6">
           <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
             <button
               onClick={() => setActiveTab('enrolled')}
               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                 activeTab === 'enrolled'
                   ? 'bg-white text-blue-600 shadow-sm'
                   : 'text-slate-600 hover:text-slate-900'
               }`}
             >
               <CheckCircle size={16} className="inline mr-2" />
               My Enrolled Courses ({getEnrolledCourses().length})
             </button>
             <button
               onClick={() => setActiveTab('available')}
               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                 activeTab === 'available'
                   ? 'bg-white text-blue-600 shadow-sm'
                   : 'text-slate-600 hover:text-slate-900'
               }`}
             >
               <BookOpen size={16} className="inline mr-2" />
               Available Courses ({getCoursesForCurrentMD().filter(course => !isEnrolledInCourse(course.id)).length})
             </button>
           </div>
         </div>
       )}

       <div className="mb-6 flex items-center gap-2">
         <div className="relative flex-1">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
             <BookOpen size={18} className="text-slate-400" />
           </div>
           <input
             value={query}
             onChange={(e) => setQuery(e.target.value)}
             placeholder={role === 'student' ? "Search your courses..." : "Search courses by code or title..."}
             className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300/80 text-slate-700 placeholder-slate-400"
           />
         </div>
       </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50/80 text-red-700 border border-red-200/50 shadow-soft backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500"></div>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}



      {/* Course Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-glow max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Create New Course</h2>
                    <p className="text-sm text-slate-600">Add a new course to the curriculum</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseCreateModal}
                  className="p-2 hover:bg-slate-100/80 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Course Code and Title */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Course Code *
                    </label>
                    <Input
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="e.g., ANAT101"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Course Name *
                    </label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g., Human Anatomy"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Credit Hours and Instructor */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Credit Hours *
                    </label>
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={form.credits}
                      onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
                      placeholder="e.g., 4"
                      required
                      className="h-11"
                    />
                  </div>
                                       <div className="space-y-2">
                       <label className="block text-sm font-semibold text-slate-700">
                         Course Instructor *
                       </label>
                       {teachersLoading ? (
                         <div className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 flex items-center bg-white/60 backdrop-blur-sm">
                           <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                           <span className="text-slate-500">Loading teachers...</span>
                         </div>
                       ) : (
                         <div className="relative">
                           <select
                             value={courseInstructor}
                             onChange={(e) => setCourseInstructor(e.target.value)}
                             required
                             className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 focus:border-blue-400 focus:outline-none transition-all duration-300 hover:border-slate-300/80 bg-white/60 backdrop-blur-sm text-slate-700 appearance-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-700 [&>option]:py-2"
                             style={{ 
                               WebkitAppearance: 'none', 
                               MozAppearance: 'none',
                               appearance: 'none',
                               backgroundImage: 'none',
                               background: 'rgba(255, 255, 255, 0.6)',
                               backdropFilter: 'blur(8px)',
                               border: '2px solid rgb(226 232 240)',
                               borderRadius: '12px',
                               padding: '12px',
                               fontSize: '14px',
                               color: 'rgb(51 65 85)',
                               cursor: 'pointer'
                             }}
                           >
                          <option value="" className="text-slate-500">Select an instructor</option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.email} className="text-slate-700">
                              {teacher.name} ({teacher.email})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Semester and Capacity */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Semester *
                    </label>
                    <select
                      className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 focus:border-blue-400 focus:outline-none transition-colors"
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    >
                      {SEMESTERS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Student Capacity *
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                      placeholder="e.g., 50"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Course Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Course Description *
                  </label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Provide a detailed description of the course content, objectives, and learning outcomes..."
                    required
                    rows={4}
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-3 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseCreateModal}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-6"
                  >
                    Create Course
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Edit Course</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseEditModal}
                  className="h-8 w-8 p-0"
                >
                  <X size={20} />
                </Button>
              </div>

              <form onSubmit={handleUpdateCourse} className="space-y-6">
                {/* Course Code and Title */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Course Code *
                    </label>
                    <Input
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      placeholder="e.g., ANAT101"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Course Title *
                    </label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g., Human Anatomy"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Credits and Instructor */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Credits *
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={form.credits}
                      onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
                      placeholder="e.g., 4"
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Instructor *
                    </label>
                    {teachersLoading ? (
                      <div className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 flex items-center bg-white/60 backdrop-blur-sm">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                        <span className="text-slate-500">Loading teachers...</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <select
                          value={courseInstructor}
                          onChange={(e) => setCourseInstructor(e.target.value)}
                          required
                          className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 focus:border-blue-400 focus:outline-none transition-all duration-300 hover:border-slate-300/80 bg-white/60 backdrop-blur-sm text-slate-700 appearance-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-700 [&>option]:py-2"
                          style={{ 
                            WebkitAppearance: 'none', 
                            MozAppearance: 'none',
                            appearance: 'none',
                            backgroundImage: 'none',
                            background: 'rgba(255, 255, 255, 0.6)',
                            backdropFilter: 'blur(8px)',
                            border: '2px solid rgb(226 232 240)',
                            borderRadius: '12px',
                            padding: '12px',
                            fontSize: '14px',
                            color: 'rgb(51 65 85)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="" className="text-slate-500">Select an instructor</option>
                          {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.email} className="text-slate-700">
                              {teacher.name} ({teacher.email})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Semester and Capacity */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Semester *
                    </label>
                    <select
                      className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 focus:border-blue-400 focus:outline-none transition-colors"
                      value={form.semester}
                      onChange={(e) => setForm({ ...form, semester: e.target.value })}
                    >
                      {SEMESTERS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Student Capacity *
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={form.capacity}
                      onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                      placeholder="e.g., 50"
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Course Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Course Description *
                  </label>
                  <textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Provide a detailed description of the course content, objectives, and learning outcomes..."
                    required
                    rows={4}
                    className="w-full border-2 border-slate-200 rounded-xl px-3 py-3 focus:border-blue-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseEditModal}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="px-6"
                  >
                    Update Course
                  </Button>
                </div>
              </form>
            </div>
          </div>
                 </div>
       )}

       {/* Course Detail Modal */}
       {showDetailModal && selectedCourse && (
         <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl shadow-glow max-w-6xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl">
                     <BookOpen size={20} className="text-blue-600" />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-slate-800">
                       {selectedCourse.code} — {selectedCourse.title}
                     </h2>
                     <p className="text-sm text-slate-600">Course Details & Enrollment Management</p>
                   </div>
                 </div>
                 <button
                   onClick={handleCloseDetailModal}
                   className="p-2 hover:bg-slate-100/80 rounded-xl transition-colors"
                 >
                   <X size={20} className="text-slate-500" />
                 </button>
               </div>

                               {enrollmentLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl mb-4">
                      <BookOpen size={32} className="text-blue-600 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Loading Course Details...</h3>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Course Information - Show for all roles */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <BookOpen size={18} />
                        Course Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-slate-600">Code:</span>
                            <Badge variant="default" className="bg-blue-100 text-blue-700">
                              {selectedCourse.code}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-slate-600">Title:</span>
                            <span>{selectedCourse.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-slate-600">Semester:</span>
                            <Badge variant="default" className="bg-green-100 text-green-700">
                              {selectedCourse.semester}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-slate-600">Credits:</span>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                              {selectedCourse.credits} Credits
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-slate-600">Capacity:</span>
                            <span>{selectedCourse.capacity} students</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-slate-600">Instructor:</span>
                            <span>{selectedCourse.instructor || 'TBD'}</span>
                            {role === 'admin' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleOpenAssignInstructorModal}
                                className="ml-2 h-6 px-2 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                              >
                                <Edit2 size={12} className="mr-1" />
                                Assign
                              </Button>
                            )}
                          </div>
                          {selectedCourse.description && (
                            <div className="space-y-2">
                              <span className="font-medium text-slate-600 text-sm">Description:</span>
                              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                {selectedCourse.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                                         {/* Admin and Teacher sections */}
                     {(role === 'admin' || (role === 'teacher' && isTeacherAssignedToCourse(selectedCourse.id))) && (
                      <>
                        {/* Enrollment Statistics */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Users size={18} />
                            Enrollment Statistics
                          </h3>
                          <div className="grid md:grid-cols-3 gap-3">
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <UserCheck size={20} className="text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-600">Enrolled Students</p>
                                  <p className="text-2xl font-bold text-blue-600">{courseEnrollments.length}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <UserPlus size={20} className="text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-600">Available Students</p>
                                  <p className="text-2xl font-bold text-green-600">{availableStudents.length}</p>
                                </div>
                              
                              </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                  <Users size={20} className="text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-600">Enrollment Rate</p>
                                  <p className="text-2xl font-bold text-orange-600">
                                    {selectedCourse.capacity > 0 ? Math.round((courseEnrollments.length / selectedCourse.capacity) * 100) : 0}%
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enrolled Students */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <UserCheck size={18} />
                            Enrolled Students ({courseEnrollments.length})
                          </h3>
                          {courseEnrollments.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 rounded-xl">
                              <UserMinus size={32} className="text-slate-400 mx-auto mb-2" />
                              <p className="text-slate-600">No students enrolled in this course yet.</p>
                            </div>
                          ) : (
                            <div className="grid gap-3">
                              {courseEnrollments.map((enrollment) => (
                                <div key={enrollment.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full flex items-center justify-center">
                                      <UserIcon size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-800">
                                        {enrollment.studentName}
                                      </p>
                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span>{enrollment.studentEmail}</span>
                                        <Badge variant="secondary" className="text-xs">
                                          {enrollment.studentMdYear}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleUnenrollStudent(enrollment.id)}
                                    className="h-8 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                  >
                                    <UserMinus size={14} className="mr-1" />
                                    Remove
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Available Students for Enrollment */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                              <UserPlus size={18} />
                              Available Students for Enrollment ({filteredAvailableStudents.length})
                            </h3>
                          </div>
                          
                          {/* Search bar for available students */}
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <UserIcon size={18} className="text-slate-400" />
                            </div>
                            <input
                              value={studentSearchQuery}
                              onChange={(e) => setStudentSearchQuery(e.target.value)}
                              placeholder="Search students by name, email, or MD year..."
                              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300/80 text-slate-700 placeholder-slate-400"
                            />
                          </div>
                          {filteredAvailableStudents.length === 0 ? (
                            <div className="text-center py-8 bg-slate-50 rounded-xl">
                              {studentSearchQuery ? (
                                <>
                                  <UserCheck size={32} className="text-slate-400 mx-auto mb-2" />
                                  <p className="text-slate-600">No students found matching your search.</p>
                                </>
                              ) : (
                                <>
                                  <UserCheck size={32} className="text-slate-400 mx-auto mb-2" />
                                  <p className="text-slate-600">No available students for this course.</p>
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="grid gap-3">
                              {filteredAvailableStudents.map((student) => (
                                <div key={student.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                                      <UserIcon size={20} className="text-green-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium text-slate-800">
                                        {student.name || student.email}
                                      </p>
                                      <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <span>{student.email}</span>
                                        <Badge variant="secondary" className="text-xs">
                                          {student.mdYear || 'MD-1'}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => student.id && handleEnrollStudent(student.id)}
                                    className="h-8 px-3 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                  >
                                    <UserPlus size={14} className="mr-1" />
                                    Enroll
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
             </div>
           </div>
         </div>
       )}

                      {/* Determine which courses to show based on role and active tab */}
        {(() => {
          // Show loading state while initial data is being fetched
          if (initialLoading) {
            return (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl mb-4">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">Loading courses...</h3>
                <p className="text-slate-600">Please wait while we fetch your course information.</p>
              </div>
            );
          }

          let coursesToShow = courses;
          
          if (role === 'student') {
            if (activeTab === 'enrolled') {
              coursesToShow = getEnrolledCourses();
            } else if (activeTab === 'available') {
              coursesToShow = getCoursesForCurrentMD().filter(course => !isEnrolledInCourse(course.id));
            }
          } else if (role === 'teacher') {
            // For teachers, only show courses they are assigned to teach
            const assignedCourseIds = teacherCourses.map(assignment => assignment.courseId);
            coursesToShow = courses.filter(course => assignedCourseIds.includes(course.id));
          }
          
          const filteredCourses = coursesToShow.filter(c => 
            !query || (c.title?.toLowerCase().includes(query.toLowerCase()) || c.code?.toLowerCase().includes(query.toLowerCase()))
          );
         
         if (filteredCourses.length === 0) {
           return (
             <div className="text-center py-12">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl mb-4">
                 <BookOpen size={32} className="text-blue-600" />
               </div>
                               <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {role === 'student' 
                    ? activeTab === 'enrolled' 
                      ? 'No Enrolled Courses' 
                      : 'No Available Courses'
                    : role === 'teacher'
                    ? 'No Assigned Courses'
                    : 'No Courses Available'
                  }
                </h3>
                <p className="text-slate-600 mb-6">
                  {role === 'student'
                    ? activeTab === 'enrolled'
                      ? 'You are not enrolled in any courses yet.'
                      : `No courses available for ${mdYear || 'your current semester'}.`
                    : role === 'teacher'
                    ? 'You are not assigned to teach any courses yet. Use the "Select Courses to Teach" button to choose your courses.'
                    : 'Get started by creating your first course'
                  }
                </p>
               {canCreate && role !== 'student' && (
                 <Button 
                   variant="primary" 
                   onClick={handleOpenCreateModal}
                   className="flex items-center gap-2"
                 >
                   <Plus size={16} />
                   Create First Course
                 </Button>
               )}
             </div>
           );
         }
         
         return (
                       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((c) => (
             <Card key={c.id} className="hover:shadow-glow transition-all duration-300 interactive">
              <CardHeader className="pb-3">
                                 <div className="flex items-start justify-between">
                   <div className="flex-1">
                                           <CardTitle className="text-lg leading-tight mb-2">
                        {c.code} — {c.title}
                      </CardTitle>
                                           <div className="flex items-center gap-2 mb-3">
                        <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200">
                          {c.semester}
                        </Badge>
                        <Badge variant="secondary" className="text-xs bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200">
                          {c.credits} Credits
                        </Badge>
                        {role === 'teacher' && isTeacherAssignedToCourse(c.id) && (
                          <Badge variant="default" className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                            Teaching
                          </Badge>
                        )}
                      </div>
                   </div>
                   
                 </div>
                                   {/* Navigation and Quick Actions */}
                                   <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                                     {/* View Details Button */}
                                     <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => handleViewCourseDetails(c)}
                                       className="h-9 px-3 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                       title="View course details"
                                     >
                                       <ExternalLink size={16} className="mr-1" />
                                       View Details
                                     </Button>
                                     
                                     {/* Quick Actions Button */}
                                     <Button
                                       variant="outline"
                                       size="sm"
                                       onClick={() => handleOpenCourseDetail(c)}
                                       className="h-9 px-3 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                                       title="Quick actions"
                                     >
                                       <BookOpen size={16} className="mr-1" />
                                       Quick Actions
                                     </Button>
                                   </div>
                                   
                                   {/* Action buttons row */}
                                   <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                                         {/* Admin and Teacher buttons */}
                     {(role === 'admin' || (role === 'teacher' && c.ownerId === user?.uid)) && (
                       <>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={(e) => { e.stopPropagation(); handleEditCourse(c); }}
                           className="h-9 px-3 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                           title="Edit course"
                         >
                           <Edit2 size={16} className="mr-1" />
                           Edit
                         </Button>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={(e) => { e.stopPropagation(); handleDeleteCourse(c.id); }}
                           className="h-9 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                           title="Delete course"
                         >
                           <Trash2 size={16} className="mr-1" />
                           Delete
                         </Button>
                       </>
                     )}
                     
                     {/* Admin-only: Quick Assign/Remove Instructor button */}
                     {role === 'admin' && (
                       <div className="flex gap-1">
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={(e) => { 
                             e.stopPropagation(); 
                             setSelectedCourse(c);
                             handleOpenAssignInstructorModal();
                           }}
                           className="h-9 px-3 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                           title="Assign instructor"
                         >
                           <UserIcon size={16} className="mr-1" />
                           Assign
                         </Button>
                         {c.instructor && (
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={(e) => { 
                               e.stopPropagation(); 
                               setSelectedCourse(c);
                               handleRemoveInstructor();
                             }}
                             className="h-9 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                             title="Remove instructor"
                           >
                             <UserIcon size={16} className="mr-1" />
                             Remove
                           </Button>
                         )}
                       </div>
                     )}
                    
                                         {/* Student enrollment buttons */}
                     {role === 'student' && (
                       <>
                         {isEnrolledInCourse(c.id) ? (
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={(e) => { e.stopPropagation(); handleUnenrollFromCourse(getEnrollmentId(c.id)!); }}
                             className="h-9 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                             title="Unenroll from course"
                           >
                             <CheckCircle size={16} className="mr-1" />
                             Enrolled
                           </Button>
                         ) : (
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={(e) => { e.stopPropagation(); handleEnrollInCourse(c.id); }}
                             className="h-9 px-3 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                             title="Enroll in course"
                           >
                             <UserPlus size={16} className="mr-1" />
                             Enroll
                           </Button>
                         )}
                       </>
                     )}
                  </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users size={14} />
                  <span>Capacity: {c.capacity} students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <UserIcon size={14} />
                  <span>Instructor: {c.instructor || 'TBD'}</span>
                </div>
                {c.description && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <FileText size={14} className="mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">{c.description}</p>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Created by: {String(c.ownerId || "").slice(0, 8)}…</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                             </CardContent>
             </Card>
           ))}
         </div>
               );
      })()}

      {/* Course Selection Modal for Teachers */}
      {showSelectCourseModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-glow max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                    <BookOpen size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Select Courses to Teach</h2>
                    <p className="text-sm text-slate-600">Choose which courses you want to teach this academic session</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseSelectCourseModal}
                  className="p-2 hover:bg-slate-100/80 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    value={courseSelectionQuery}
                    onChange={(e) => setCourseSelectionQuery(e.target.value)}
                    placeholder="Search courses by code, title, or semester..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-2xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 focus:bg-white transition-all duration-300 hover:border-slate-300/80 text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Course List */}
              <div className="space-y-4">
                {filteredCoursesForSelection.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600">No courses found matching your search.</p>
                  </div>
                ) : (
                  filteredCoursesForSelection.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl flex items-center justify-center">
                          <BookOpen size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">
                            {course.code} — {course.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="default" className="text-xs bg-blue-100 text-blue-700">
                              {course.semester}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                              {course.credits} Credits
                            </Badge>
                            <span className="text-sm text-slate-600">
                              Capacity: {course.capacity} students
                            </span>
                          </div>
                          {course.description && (
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={isTeacherAssignedToCourse(course.id) ? "outline" : "primary"}
                        size="sm"
                        onClick={() => handleSelectCourseToTeach(course)}
                        className={isTeacherAssignedToCourse(course.id) 
                          ? "hover:bg-red-50 hover:text-red-600 hover:border-red-300" 
                          : "hover:bg-green-50 hover:text-green-600"
                        }
                      >
                        {isTeacherAssignedToCourse(course.id) ? (
                          <>
                            <UserMinus size={16} className="mr-1" />
                            Remove
                          </>
                        ) : (
                          <>
                            <UserPlus size={16} className="mr-1" />
                            Select
                          </>
                        )}
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {/* Summary */}
              {teacherCourses.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Your Teaching Assignment</h3>
                  <p className="text-sm text-green-700 mb-3">
                    You are currently assigned to teach {teacherCourses.length} course{teacherCourses.length !== 1 ? 's' : ''}:
                  </p>
                                     <div className="space-y-1">
                     {teacherCourses.map((assignment) => (
                       <div key={assignment.id} className="flex items-center gap-2 text-sm text-green-700">
                         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                         <span>{assignment.courseCode} — {assignment.courseTitle}</span>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign Instructor Modal */}
      {showAssignInstructorModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-glow max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
                    <UserIcon size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Assign Instructor</h2>
                    <p className="text-sm text-slate-600">
                      Assign an instructor to {selectedCourse.code} — {selectedCourse.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseAssignInstructorModal}
                  className="p-2 hover:bg-slate-100/80 rounded-xl transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Current Instructor */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Current Instructor
                  </label>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-700">
                      {selectedCourse.instructor || 'No instructor assigned'}
                    </span>
                    {selectedCourse.instructor && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveInstructor}
                        disabled={assignInstructorLoading}
                        className="ml-3 h-6 px-2 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                {/* Instructor Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Select New Instructor *
                  </label>
                  {teachersLoading ? (
                    <div className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 flex items-center bg-white/60 backdrop-blur-sm">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                      <span className="text-slate-500">Loading teachers...</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedInstructor}
                        onChange={(e) => setSelectedInstructor(e.target.value)}
                        required
                        className="w-full h-11 border-2 border-slate-200 rounded-xl px-3 focus:border-purple-400 focus:outline-none transition-all duration-300 hover:border-slate-300/80 bg-white/60 backdrop-blur-sm text-slate-700 appearance-none cursor-pointer [&>option]:bg-white [&>option]:text-slate-700 [&>option]:py-2"
                      >
                        <option value="" className="text-slate-500">Select an instructor</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.email} className="text-slate-700">
                            {teacher.name} ({teacher.email})
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseAssignInstructorModal}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleAssignInstructor}
                    disabled={!selectedInstructor || assignInstructorLoading}
                    className="px-6"
                  >
                    {assignInstructorLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Assigning...
                      </>
                    ) : (
                      'Assign Instructor'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


