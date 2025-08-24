import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { createCourse, listCourses, updateCourse, deleteCourse } from "../lib/courses";
import { createEnrollment, listEnrollmentsForStudent, deleteEnrollment, listEnrollments } from "../lib/enrollments";
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
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState('enrolled');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [editingCourse, setEditingCourse] = useState(null);
    const [courseEnrollments, setCourseEnrollments] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [enrollmentLoading, setEnrollmentLoading] = useState(false);
    const [studentSearchQuery, setStudentSearchQuery] = useState("");
    const [form, setForm] = useState({
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
            }
            catch (e) {
                setError(e?.message ?? "Failed to load courses");
            }
        })();
    }, [role, user?.uid]);
    async function handleSubmit(e) {
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
        }
        catch (e) {
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
    function handleEditCourse(course) {
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
    async function handleUpdateCourse(e) {
        e.preventDefault();
        if (!editingCourse)
            return;
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
        }
        catch (e) {
            setError(e?.message ?? "Failed to update course");
            push({ variant: 'error', title: 'Failed to update course', description: e?.message });
        }
    }
    async function handleDeleteCourse(courseId) {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }
        try {
            await deleteCourse(courseId);
            const items = await listCourses();
            setCourses(items);
            push({ variant: 'success', title: 'Course deleted', description: 'Course has been successfully deleted' });
        }
        catch (e) {
            setError(e?.message ?? "Failed to delete course");
            push({ variant: 'error', title: 'Failed to delete course', description: e?.message });
        }
    }
    // Enrollment functions for students
    async function handleEnrollInCourse(courseId) {
        if (!user?.uid)
            return;
        try {
            const enrollmentData = {
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
        }
        catch (e) {
            setError(e?.message ?? "Failed to enroll in course");
            push({ variant: 'error', title: 'Failed to enroll', description: e?.message });
        }
    }
    async function handleUnenrollFromCourse(enrollmentId) {
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
        }
        catch (e) {
            setError(e?.message ?? "Failed to unenroll from course");
            push({ variant: 'error', title: 'Failed to unenroll', description: e?.message });
        }
    }
    // Helper functions for student view
    const isEnrolledInCourse = (courseId) => {
        return enrollments.some(enrollment => enrollment.courseId === courseId && enrollment.status === 'enrolled');
    };
    const getEnrollmentId = (courseId) => {
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
        if (!mdYear)
            return courses;
        return courses.filter(course => course.semester === mdYear);
    };
    // Filter available students based on search query
    const filteredAvailableStudents = useMemo(() => {
        if (!studentSearchQuery.trim())
            return availableStudents;
        const query = studentSearchQuery.toLowerCase();
        return availableStudents.filter(student => (student.name || '').toLowerCase().includes(query) ||
            (student.email || '').toLowerCase().includes(query) ||
            (student.mdYear || '').toLowerCase().includes(query));
    }, [availableStudents, studentSearchQuery]);
    // Course detail modal functions
    async function handleOpenCourseDetail(course) {
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
            const availableStudentsList = students.filter(student => student.id && !enrolledStudentIds.includes(student.id) &&
                student.mdYear === course.semester);
            setAvailableStudents(availableStudentsList);
        }
        catch (error) {
            console.error('Failed to load course details:', error);
            push({ variant: 'error', title: 'Error', description: 'Failed to load course details' });
        }
        finally {
            setEnrollmentLoading(false);
        }
    }
    function handleCloseDetailModal() {
        setShowDetailModal(false);
        setSelectedCourse(null);
        setCourseEnrollments([]);
        setAvailableStudents([]);
    }
    async function handleEnrollStudent(studentId) {
        if (!selectedCourse)
            return;
        try {
            const enrollmentData = {
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
            const availableStudentsList = students.filter(student => student.id && !enrolledStudentIds.includes(student.id) &&
                student.mdYear === selectedCourse.semester);
            setAvailableStudents(availableStudentsList);
            push({ variant: 'success', title: 'Student Enrolled', description: 'Student has been successfully enrolled' });
        }
        catch (error) {
            push({ variant: 'error', title: 'Enrollment Failed', description: error?.message || 'Failed to enroll student' });
        }
    }
    async function handleUnenrollStudent(enrollmentId) {
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
                const availableStudentsList = students.filter(student => student.id && !enrolledStudentIds.includes(student.id) &&
                    student.mdYear === selectedCourse.semester);
                setAvailableStudents(availableStudentsList);
            }
            push({ variant: 'success', title: 'Student Unenrolled', description: 'Student has been successfully unenrolled' });
        }
        catch (error) {
            push({ variant: 'error', title: 'Unenrollment Failed', description: error?.message || 'Failed to unenroll student' });
        }
    }
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx(PageHeader, { title: "Courses", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Courses' }], actions: _jsx(PageActions, { children: canCreate && (_jsxs(Button, { variant: "primary", onClick: handleOpenCreateModal, className: "flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), "New Course"] })) }) }), role === 'student' && (_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex space-x-1 bg-slate-100 p-1 rounded-lg", children: [_jsxs("button", { onClick: () => setActiveTab('enrolled'), className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'enrolled'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'}`, children: [_jsx(CheckCircle, { size: 16, className: "inline mr-2" }), "My Enrolled Courses"] }), _jsxs("button", { onClick: () => setActiveTab('available'), className: `flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'available'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'}`, children: [_jsx(BookOpen, { size: 16, className: "inline mr-2" }), "Available Courses (", mdYear || 'All', ")"] })] }) })), _jsx("div", { className: "mb-6 flex items-center gap-2", children: _jsxs("div", { className: "relative flex-1", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(BookOpen, { size: 18, className: "text-slate-400" }) }), _jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: role === 'student' ? "Search your courses..." : "Search courses by code or title...", className: "w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300/80 text-slate-700 placeholder-slate-400" })] }) }), error && (_jsx("div", { className: "mb-6 p-4 rounded-2xl bg-red-50/80 text-red-700 border border-red-200/50 shadow-soft backdrop-blur-sm", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500" }), _jsx("span", { className: "font-medium", children: error })] }) })), showCreateModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: _jsx("div", { className: "bg-white rounded-3xl shadow-glow max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl", children: _jsx(BookOpen, { size: 20, className: "text-blue-600" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-800", children: "Create New Course" }), _jsx("p", { className: "text-sm text-slate-600", children: "Add a new course to the curriculum" })] })] }), _jsx("button", { onClick: handleCloseCreateModal, className: "p-2 hover:bg-slate-100 rounded-xl transition-colors", children: _jsx(X, { size: 20, className: "text-slate-500" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Code *" }), _jsx(Input, { value: form.code, onChange: (e) => setForm({ ...form, code: e.target.value }), placeholder: "e.g., ANAT101", required: true, className: "h-11" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Name *" }), _jsx(Input, { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), placeholder: "e.g., Human Anatomy", required: true, className: "h-11" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Credit Hours *" }), _jsx(Input, { type: "number", min: 0, max: 10, value: form.credits, onChange: (e) => setForm({ ...form, credits: Number(e.target.value) }), placeholder: "e.g., 4", required: true, className: "h-11" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Instructor *" }), _jsx(Input, { value: courseInstructor, onChange: (e) => setCourseInstructor(e.target.value), placeholder: "e.g., Dr. Sarah Johnson", required: true, className: "h-11" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Semester *" }), _jsx("select", { className: "w-full h-11 border-2 border-slate-200 rounded-xl px-3 focus:border-blue-400 focus:outline-none transition-colors", value: form.semester, onChange: (e) => setForm({ ...form, semester: e.target.value }), children: SEMESTERS.map(s => (_jsx("option", { value: s, children: s }, s))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Student Capacity *" }), _jsx(Input, { type: "number", min: 1, value: form.capacity, onChange: (e) => setForm({ ...form, capacity: Number(e.target.value) }), placeholder: "e.g., 50", required: true, className: "h-11" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Description *" }), _jsx("textarea", { value: courseDescription, onChange: (e) => setCourseDescription(e.target.value), placeholder: "Provide a detailed description of the course content, objectives, and learning outcomes...", required: true, rows: 4, className: "w-full border-2 border-slate-200 rounded-xl px-3 py-3 focus:border-blue-400 focus:outline-none transition-colors resize-none" })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-slate-200", children: [_jsx(Button, { type: "button", variant: "outline", onClick: handleCloseCreateModal, className: "px-6", children: "Cancel" }), _jsx(Button, { type: "submit", variant: "primary", className: "px-6", children: "Create Course" })] })] })] }) }) })), showEditModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50", children: _jsx("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-slate-900", children: "Edit Course" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleCloseEditModal, className: "h-8 w-8 p-0", children: _jsx(X, { size: 20 }) })] }), _jsxs("form", { onSubmit: handleUpdateCourse, className: "space-y-6", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Code *" }), _jsx(Input, { value: form.code, onChange: (e) => setForm({ ...form, code: e.target.value }), placeholder: "e.g., ANAT101", required: true, className: "h-11" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Title *" }), _jsx(Input, { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), placeholder: "e.g., Human Anatomy", required: true, className: "h-11" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Credits *" }), _jsx(Input, { type: "number", min: 1, max: 10, value: form.credits, onChange: (e) => setForm({ ...form, credits: Number(e.target.value) }), placeholder: "e.g., 4", required: true, className: "h-11" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Instructor *" }), _jsx(Input, { value: courseInstructor, onChange: (e) => setCourseInstructor(e.target.value), placeholder: "e.g., Dr. Sarah Johnson", required: true, className: "h-11" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Semester *" }), _jsx("select", { className: "w-full h-11 border-2 border-slate-200 rounded-xl px-3 focus:border-blue-400 focus:outline-none transition-colors", value: form.semester, onChange: (e) => setForm({ ...form, semester: e.target.value }), children: SEMESTERS.map(s => (_jsx("option", { value: s, children: s }, s))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Student Capacity *" }), _jsx(Input, { type: "number", min: 1, value: form.capacity, onChange: (e) => setForm({ ...form, capacity: Number(e.target.value) }), placeholder: "e.g., 50", required: true, className: "h-11" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Description *" }), _jsx("textarea", { value: courseDescription, onChange: (e) => setCourseDescription(e.target.value), placeholder: "Provide a detailed description of the course content, objectives, and learning outcomes...", required: true, rows: 4, className: "w-full border-2 border-slate-200 rounded-xl px-3 py-3 focus:border-blue-400 focus:outline-none transition-colors resize-none" })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-slate-200", children: [_jsx(Button, { type: "button", variant: "outline", onClick: handleCloseEditModal, className: "px-6", children: "Cancel" }), _jsx(Button, { type: "submit", variant: "primary", className: "px-6", children: "Update Course" })] })] })] }) }) })), showDetailModal && selectedCourse && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: _jsx("div", { className: "bg-white rounded-3xl shadow-glow max-w-6xl w-full max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl", children: _jsx(BookOpen, { size: 20, className: "text-blue-600" }) }), _jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold text-slate-800", children: [selectedCourse.code, " \u2014 ", selectedCourse.title] }), _jsx("p", { className: "text-sm text-slate-600", children: "Course Details & Enrollment Management" })] })] }), _jsx("button", { onClick: handleCloseDetailModal, className: "p-2 hover:bg-slate-100 rounded-xl transition-colors", children: _jsx(X, { size: 20, className: "text-slate-500" }) })] }), enrollmentLoading ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl mb-4", children: _jsx(BookOpen, { size: 32, className: "text-blue-600 animate-pulse" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-800 mb-2", children: "Loading Course Details..." })] })) : (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [_jsx(BookOpen, { size: 18 }), "Course Information"] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "font-medium text-slate-600", children: "Code:" }), _jsx(Badge, { variant: "default", className: "bg-blue-100 text-blue-700", children: selectedCourse.code })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "font-medium text-slate-600", children: "Title:" }), _jsx("span", { children: selectedCourse.title })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "font-medium text-slate-600", children: "Semester:" }), _jsx(Badge, { variant: "default", className: "bg-green-100 text-green-700", children: selectedCourse.semester })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "font-medium text-slate-600", children: "Credits:" }), _jsxs(Badge, { variant: "secondary", className: "bg-slate-100 text-slate-700", children: [selectedCourse.credits, " Credits"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "font-medium text-slate-600", children: "Capacity:" }), _jsxs("span", { children: [selectedCourse.capacity, " students"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx("span", { className: "font-medium text-slate-600", children: "Instructor:" }), _jsx("span", { children: selectedCourse.instructor || 'TBD' })] }), selectedCourse.description && (_jsxs("div", { className: "space-y-2", children: [_jsx("span", { className: "font-medium text-slate-600 text-sm", children: "Description:" }), _jsx("p", { className: "text-sm text-slate-600 bg-slate-50 p-3 rounded-lg", children: selectedCourse.description })] }))] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [_jsx(Users, { size: 18 }), "Enrollment Statistics"] }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-blue-100 rounded-lg", children: _jsx(UserCheck, { size: 20, className: "text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-slate-600", children: "Enrolled Students" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: courseEnrollments.length })] })] }) }), _jsx("div", { className: "flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-green-100 rounded-lg", children: _jsx(UserPlus, { size: 20, className: "text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-slate-600", children: "Available Students" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: availableStudents.length })] })] }) }), _jsx("div", { className: "flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-orange-100 rounded-lg", children: _jsx(Users, { size: 20, className: "text-orange-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-slate-600", children: "Enrollment Rate" }), _jsxs("p", { className: "text-2xl font-bold text-orange-600", children: [selectedCourse.capacity > 0 ? Math.round((courseEnrollments.length / selectedCourse.capacity) * 100) : 0, "%"] })] })] }) })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [_jsx(UserCheck, { size: 18 }), "Enrolled Students (", courseEnrollments.length, ")"] }), courseEnrollments.length === 0 ? (_jsxs("div", { className: "text-center py-8 bg-slate-50 rounded-xl", children: [_jsx(UserMinus, { size: 32, className: "text-slate-400 mx-auto mb-2" }), _jsx("p", { className: "text-slate-600", children: "No students enrolled in this course yet." })] })) : (_jsx("div", { className: "grid gap-3", children: courseEnrollments.map((enrollment) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-blue-100 to-teal-100 rounded-full flex items-center justify-center", children: _jsx(UserIcon, { size: 20, className: "text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-800", children: enrollment.studentName }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx("span", { children: enrollment.studentEmail }), _jsx(Badge, { variant: "secondary", className: "text-xs", children: enrollment.studentMdYear })] })] })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleUnenrollStudent(enrollment.id), className: "h-8 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300", children: [_jsx(UserMinus, { size: 14, className: "mr-1" }), "Remove"] })] }, enrollment.id))) }))] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsxs("h3", { className: "text-lg font-semibold text-slate-800 flex items-center gap-2", children: [_jsx(UserPlus, { size: 18 }), "Available Students for Enrollment (", filteredAvailableStudents.length, ")"] }) }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(UserIcon, { size: 18, className: "text-slate-400" }) }), _jsx("input", { value: studentSearchQuery, onChange: (e) => setStudentSearchQuery(e.target.value), placeholder: "Search students by name, email, or MD year...", className: "w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300/80 text-slate-700 placeholder-slate-400" })] }), filteredAvailableStudents.length === 0 ? (_jsx("div", { className: "text-center py-8 bg-slate-50 rounded-xl", children: studentSearchQuery ? (_jsxs(_Fragment, { children: [_jsx(UserCheck, { size: 32, className: "text-slate-400 mx-auto mb-2" }), _jsx("p", { className: "text-slate-600", children: "No students found matching your search." })] })) : (_jsxs(_Fragment, { children: [_jsx(UserCheck, { size: 32, className: "text-slate-400 mx-auto mb-2" }), _jsx("p", { className: "text-slate-600", children: "No available students for this course." })] })) })) : (_jsx("div", { className: "grid gap-3", children: filteredAvailableStudents.map((student) => (_jsxs("div", { className: "flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition-shadow", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center", children: _jsx(UserIcon, { size: 20, className: "text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-slate-800", children: student.name || student.email }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx("span", { children: student.email }), _jsx(Badge, { variant: "secondary", className: "text-xs", children: student.mdYear || 'MD-1' })] })] })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleEnrollStudent(student.id), className: "h-8 px-3 hover:bg-green-50 hover:text-green-600 hover:border-green-300", children: [_jsx(UserPlus, { size: 14, className: "mr-1" }), "Enroll"] })] }, student.id))) }))] })] }))] }) }) })), (() => {
                let coursesToShow = courses;
                if (role === 'student') {
                    if (activeTab === 'enrolled') {
                        coursesToShow = getEnrolledCourses();
                    }
                    else if (activeTab === 'available') {
                        coursesToShow = getCoursesForCurrentMD().filter(course => !isEnrolledInCourse(course.id));
                    }
                }
                const filteredCourses = coursesToShow.filter(c => !query || (c.title?.toLowerCase().includes(query.toLowerCase()) || c.code?.toLowerCase().includes(query.toLowerCase())));
                if (filteredCourses.length === 0) {
                    return (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl mb-4", children: _jsx(BookOpen, { size: 32, className: "text-blue-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-800 mb-2", children: role === 'student'
                                    ? activeTab === 'enrolled'
                                        ? 'No Enrolled Courses'
                                        : 'No Available Courses'
                                    : 'No Courses Available' }), _jsx("p", { className: "text-slate-600 mb-6", children: role === 'student'
                                    ? activeTab === 'enrolled'
                                        ? 'You are not enrolled in any courses yet.'
                                        : `No courses available for ${mdYear || 'your current semester'}.`
                                    : 'Get started by creating your first course' }), canCreate && role !== 'student' && (_jsxs(Button, { variant: "primary", onClick: handleOpenCreateModal, className: "flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), "Create First Course"] }))] }));
                }
                return (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: filteredCourses.map((c) => (_jsxs(Card, { className: "hover:shadow-glow transition-all duration-300 interactive cursor-pointer", onClick: () => handleOpenCourseDetail(c), children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs(CardTitle, { className: "text-lg leading-tight mb-2", children: [c.code, " \u2014 ", c.title] }), _jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Badge, { variant: "default", className: "text-xs bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200", children: c.semester }), _jsxs(Badge, { variant: "secondary", className: "text-xs bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200", children: [c.credits, " Credits"] })] })] }) }), _jsxs("div", { className: "flex items-center justify-end gap-2 mt-3 pt-3 border-t border-slate-100", children: [role === 'admin' && (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: (e) => { e.stopPropagation(); handleEditCourse(c); }, className: "h-9 px-3 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300", title: "Edit course", children: [_jsx(Edit2, { size: 16, className: "mr-1" }), "Edit"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: (e) => { e.stopPropagation(); handleDeleteCourse(c.id); }, className: "h-9 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300", title: "Delete course", children: [_jsx(Trash2, { size: 16, className: "mr-1" }), "Delete"] })] })), role === 'student' && (_jsx(_Fragment, { children: isEnrolledInCourse(c.id) ? (_jsxs(Button, { variant: "outline", size: "sm", onClick: (e) => { e.stopPropagation(); handleUnenrollFromCourse(getEnrollmentId(c.id)); }, className: "h-9 px-3 hover:bg-red-50 hover:text-red-600 hover:border-red-300", title: "Unenroll from course", children: [_jsx(CheckCircle, { size: 16, className: "mr-1" }), "Enrolled"] })) : (_jsxs(Button, { variant: "outline", size: "sm", onClick: (e) => { e.stopPropagation(); handleEnrollInCourse(c.id); }, className: "h-9 px-3 hover:bg-green-50 hover:text-green-600 hover:border-green-300", title: "Enroll in course", children: [_jsx(UserPlus, { size: 16, className: "mr-1" }), "Enroll"] })) }))] })] }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx(Users, { size: 14 }), _jsxs("span", { children: ["Capacity: ", c.capacity, " students"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx(UserIcon, { size: 14 }), _jsxs("span", { children: ["Instructor: ", c.instructor || 'TBD'] })] }), c.description && (_jsxs("div", { className: "flex items-start gap-2 text-sm text-slate-600", children: [_jsx(FileText, { size: 14, className: "mt-0.5 flex-shrink-0" }), _jsx("p", { className: "line-clamp-2", children: c.description })] })), _jsx("div", { className: "pt-2 border-t border-slate-100", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500", children: [_jsxs("span", { children: ["Created by: ", String(c.ownerId || "").slice(0, 8), "\u2026"] }), _jsx("span", { children: new Date(c.createdAt).toLocaleDateString() })] }) })] })] }, c.id))) }));
            })()] }));
}
