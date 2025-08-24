import { useEffect, useMemo, useState } from "react";
import { createCourse, listCourses, updateCourse, deleteCourse, type CourseInput } from "../lib/courses";
import { createEnrollment, listEnrollmentsForStudent, deleteEnrollment, listEnrollments, type EnrollmentInput } from "../lib/enrollments";
import { useToast } from "../components/ui/toast";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { X, Plus, BookOpen, Users, Clock, GraduationCap, User as UserIcon, FileText, Edit2, Trash2, CheckCircle, UserPlus, Eye, UserMinus, UserCheck } from "lucide-react";
import { useRole } from "../hooks/useRole";
import { getAllUsers } from "../lib/users";

const SEMESTERS = Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`);

export default function Courses() {
  const { push } = useToast();
  const { user, role, mdYear, loading } = useRole();
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Array<any>>([]);
  const [enrollments, setEnrollments] = useState<Array<any>>([]);
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'enrolled' | 'available'>('enrolled');



  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [courseEnrollments, setCourseEnrollments] = useState<Array<any>>([]);
  const [availableStudents, setAvailableStudents] = useState<Array<any>>([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
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

  const canCreate = useMemo(() => role === "admin" || role === "teacher", [role]);

  useEffect(() => {
    (async () => {
      try {
        const items = await listCourses();
        setCourses(items);
        
        // Load enrollments for students
        if (role === 'student' && user?.uid) {
          const studentEnrollments = await listEnrollmentsForStudent(user.uid);
          setEnrollments(studentEnrollments);
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load courses");
      }
    })();
  }, [role, user?.uid]);

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
    } catch (e: any) {
      setError(e?.message ?? "Failed to create course");
      push({ variant: 'error', title: 'Failed to create course', description: e?.message });
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

  function handleEditCourse(course: any) {
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
    } catch (e: any) {
      setError(e?.message ?? "Failed to update course");
      push({ variant: 'error', title: 'Failed to update course', description: e?.message });
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
    } catch (e: any) {
      setError(e?.message ?? "Failed to delete course");
      push({ variant: 'error', title: 'Failed to delete course', description: e?.message });
    }
  }

  // Enrollment functions for students
  async function handleEnrollInCourse(courseId: string) {
    if (!user?.uid) return;
    
    try {
      const enrollmentData: EnrollmentInput = {
        studentId: user.uid,
        courseId: courseId,
        semesterId: 'current', // You might want to use actual session ID
        status: 'enrolled'
      };
      
      await createEnrollment(enrollmentData);
      
      // Refresh enrollments
      const studentEnrollments = await listEnrollmentsForStudent(user.uid);
      setEnrollments(studentEnrollments);
      
      push({ variant: 'success', title: 'Enrolled successfully', description: 'You have been enrolled in this course' });
    } catch (e: any) {
      setError(e?.message ?? "Failed to enroll in course");
      push({ variant: 'error', title: 'Failed to enroll', description: e?.message });
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
        const studentEnrollments = await listEnrollmentsForStudent(user.uid);
        setEnrollments(studentEnrollments);
      }
      
      push({ variant: 'success', title: 'Unenrolled successfully', description: 'You have been unenrolled from this course' });
    } catch (e: any) {
      setError(e?.message ?? "Failed to unenroll from course");
      push({ variant: 'error', title: 'Failed to unenroll', description: e?.message });
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
    return courses.filter(course => isEnrolledInCourse(course.id));
  };

  const getAvailableCourses = () => {
    return courses.filter(course => !isEnrolledInCourse(course.id));
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
  async function handleOpenCourseDetail(course: any) {
    setSelectedCourse(course);
    setShowDetailModal(true);
    setEnrollmentLoading(true);
    setStudentSearchQuery(""); // Reset search query
    
    try {
      // Fetch all students first
      const allUsers = await getAllUsers();
      const students = allUsers.filter(user => user.role === 'student');
      
      // Fetch course enrollments
      const enrollments = await listEnrollments({ courseId: course.id });
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

  async function handleEnrollStudent(studentId: string) {
    if (!selectedCourse) return;
    
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
    } catch (error: any) {
      push({ variant: 'error', title: 'Enrollment Failed', description: error?.message || 'Failed to enroll student' });
    }
  }

  async function handleUnenrollStudent(enrollmentId: string) {
    if (!confirm('Are you sure you want to unenroll this student from the course?')) {
      return;
    }
    
    try {
      await deleteEnrollment(enrollmentId);
      
      // Refresh enrollments and available students with student details
      if (selectedCourse) {
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
    } catch (error: any) {
      push({ variant: 'error', title: 'Unenrollment Failed', description: error?.message || 'Failed to unenroll student' });
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
             <PageHeader
         title="Courses"
         breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Courses' }]}
         actions={
           <PageActions>
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
               My Enrolled Courses
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
               Available Courses ({mdYear || 'All'})
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
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
                    <Input
                      value={courseInstructor}
                      onChange={(e) => setCourseInstructor(e.target.value)}
                      placeholder="e.g., Dr. Sarah Johnson"
                      required
                      className="h-11"
                    />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
                    <Input
                      value={courseInstructor}
                      onChange={(e) => setCourseInstructor(e.target.value)}
                      placeholder="e.g., Dr. Sarah Johnson"
                      required
                      className="h-11"
                    />
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
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                   className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
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
                   {/* Course Information */}
                   <div className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                       <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                         <BookOpen size={18} />
                         Course Information
                       </h3>
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
                         <div className="flex items-center gap-2 text-sm">
                           <span className="font-medium text-slate-600">Capacity:</span>
                           <span>{selectedCourse.capacity} students</span>
                         </div>
                         <div className="flex items-center gap-2 text-sm">
                           <span className="font-medium text-slate-600">Instructor:</span>
                           <span>{selectedCourse.instructor || 'TBD'}</span>
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

                     <div className="space-y-4">
                       <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                         <Users size={18} />
                         Enrollment Statistics
                       </h3>
                       <div className="space-y-3">
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
                               onClick={() => handleEnrollStudent(student.id)}
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
                 </div>
               )}
             </div>
           </div>
         </div>
       )}

              {/* Determine which courses to show based on role and active tab */}
       {(() => {
         let coursesToShow = courses;
         
         if (role === 'student') {
           if (activeTab === 'enrolled') {
             coursesToShow = getEnrolledCourses();
           } else if (activeTab === 'available') {
             coursesToShow = getCoursesForCurrentMD().filter(course => !isEnrolledInCourse(course.id));
           }
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
                   : 'No Courses Available'
                 }
               </h3>
               <p className="text-slate-600 mb-6">
                 {role === 'student'
                   ? activeTab === 'enrolled'
                     ? 'You are not enrolled in any courses yet.'
                     : `No courses available for ${mdYear || 'your current semester'}.`
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
             <Card key={c.id} className="hover:shadow-glow transition-all duration-300 interactive cursor-pointer" onClick={() => handleOpenCourseDetail(c)}>
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
                     </div>
                   </div>
                   
                 </div>
                                   {/* Action buttons row */}
                  <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
                                         {/* Admin buttons */}
                     {role === 'admin' && (
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
    </div>
  );
}


