import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { createEnrollment, deleteEnrollment, listEnrollments, updateEnrollmentStatus } from "../lib/enrollments";
import { listCourses } from "../lib/courses";
import { getAllUsers } from "../lib/users";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/card";
import { useRole } from "../hooks/useRole";
const SEMESTERS = Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`);
const STATUSES = ["enrolled", "dropped", "completed"];
export default function Enrollments() {
    const { user, role, loading } = useRole();
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [studentSearch, setStudentSearch] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState("");
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedSemesterId, setSelectedSemesterId] = useState("MD-1");
    const [createStatus, setCreateStatus] = useState("enrolled");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterCourseId, setFilterCourseId] = useState("");
    const [filterSemesterId, setFilterSemesterId] = useState("");
    const isAdmin = role === "admin";
    // Create lookup maps for quick name retrieval - with safe fallbacks
    const studentNameMap = (users || []).reduce((map, user) => {
        if (user && user.uid && user.name) {
            map[user.uid] = user.name;
        }
        return map;
    }, {});
    const courseNameMap = (courses || []).reduce((map, course) => {
        if (course && course.id && course.code && course.title) {
            map[course.id] = `${course.code} - ${course.title}`;
        }
        return map;
    }, {});
    // Debug logging - wrapped in try-catch to prevent crashes
    try {
        console.log('🔍 Debug Info:', {
            usersCount: users.length,
            coursesCount: courses.length,
            enrollmentsCount: enrollments.length,
            sampleStudentMap: Object.keys(studentNameMap).slice(0, 3),
            sampleCourseMap: Object.keys(courseNameMap).slice(0, 3),
            sampleEnrollment: enrollments[0]
        });
    }
    catch (debugError) {
        console.error('Debug logging error:', debugError);
    }
    useEffect(() => {
        if (!loading) {
            (async () => {
                try {
                    console.log('🚀 Starting to load data...');
                    const [cs, us, es] = await Promise.all([
                        listCourses(),
                        getAllUsers(),
                        listEnrollments({}),
                    ]);
                    console.log('✅ Data loaded successfully:', { courses: cs.length, users: us.length, enrollments: es.length });
                    setCourses(cs || []);
                    setUsers(us || []);
                    setEnrollments(es || []);
                }
                catch (e) {
                    console.error('❌ Error loading data:', e);
                    setError(e?.message ?? "Failed to load data");
                    // Set empty arrays to prevent crashes
                    setCourses([]);
                    setUsers([]);
                    setEnrollments([]);
                }
            })();
        }
    }, [loading]);
    async function handleFindStudent() {
        setError(null);
        const value = studentSearch.trim();
        if (!value)
            return;
        if (value.includes("@")) {
            try {
                const callable = httpsCallable(functions, "findUserByEmailOrUid");
                const res = await callable({ emailOrUid: value });
                setSelectedStudentId(res.data.uid);
            }
            catch (e) {
                setError(e?.message ?? "User not found");
            }
        }
        else {
            setSelectedStudentId(value);
        }
    }
    async function handleCreateEnrollment(e) {
        e.preventDefault();
        if (!isAdmin || isSubmitting)
            return;
        if (!selectedStudentId || !selectedCourseId) {
            setError("Please select both a student and a course");
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            await createEnrollment({
                studentId: selectedStudentId,
                courseId: selectedCourseId,
                semesterId: selectedSemesterId,
                status: createStatus,
            });
            const [es, us] = await Promise.all([
                listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined }),
                getAllUsers()
            ]);
            setEnrollments(es);
            setUsers(us);
            setSelectedCourseId("");
            setSelectedSemesterId("MD-1");
            setCreateStatus("enrolled");
            setSelectedStudentId("");
            setStudentSearch("");
        }
        catch (e) {
            setError(e?.message ?? "Failed to create enrollment");
        }
        finally {
            setIsSubmitting(false);
        }
    }
    async function handleUpdateStatus(id, status) {
        try {
            await updateEnrollmentStatus(id, status);
            const es = await listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined });
            setEnrollments(es);
        }
        catch (e) {
            setError(e?.message ?? "Failed to update status");
        }
    }
    async function handleDelete(id) {
        try {
            await deleteEnrollment(id);
            const es = await listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined });
            setEnrollments(es);
        }
        catch (e) {
            setError(e?.message ?? "Failed to delete enrollment");
        }
    }
    async function applyFilters() {
        const es = await listEnrollments({ courseId: filterCourseId || undefined, semesterId: filterSemesterId || undefined });
        setEnrollments(es);
    }
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" }), _jsx("span", { className: "text-gray-600", children: "Loading enrollments..." })] }) }));
    }
    // Error boundary for rendering issues
    try {
        if (!isAdmin) {
            return (_jsx("div", { className: "p-6", children: _jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4", children: _jsx("svg", { className: "w-8 h-8 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Access Denied" }), _jsx("p", { className: "text-gray-600", children: "You need admin privileges to access the enrollments page." })] }) }));
        }
        return (_jsxs("div", { className: "p-6 max-w-5xl mx-auto", children: [_jsx(PageHeader, { title: "Enrollments", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Enrollments' }], actions: _jsx(PageActions, { children: _jsx(Button, { variant: "outline", onClick: () => document.querySelector('#assign-form')?.scrollIntoView({ behavior: 'smooth' }), children: "Assign Student" }) }) }), error && (_jsx("div", { className: "mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 shadow-soft", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-red-800", children: "Error" }), _jsx("p", { className: "text-sm text-red-700", children: error })] })] }) })), _jsxs(Card, { id: "assign-form", className: "mb-8", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6v6m0 0v6m0-6h6m-6 0H6" }) }) }), "Assign Student to Course"] }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleCreateEnrollment, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Student (UID or Email)" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "flex-1", children: _jsx(Input, { value: studentSearch, onChange: (e) => setStudentSearch(e.target.value), placeholder: "Enter student UID or email address", className: "h-12" }) }), _jsx(Button, { type: "button", onClick: handleFindStudent, variant: "outline", size: "md", className: "h-12 px-6 whitespace-nowrap", children: "Find Student" })] }), selectedStudentId && (_jsxs("div", { className: "flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsxs("span", { className: "text-sm font-medium text-green-700", children: ["Selected: ", selectedStudentId] })] }))] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course" }), _jsxs("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: selectedCourseId, onChange: (e) => setSelectedCourseId(e.target.value), children: [_jsx("option", { value: "", children: "Select a course..." }), courses.map(c => (_jsxs("option", { value: c.id, children: [c.code, " \u2014 ", c.title] }, c.id)))] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Semester" }), _jsx("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: selectedSemesterId, onChange: (e) => setSelectedSemesterId(e.target.value), children: SEMESTERS.map(s => (_jsx("option", { value: s, children: s }, s))) })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Initial Status" }), _jsx("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: createStatus, onChange: (e) => setCreateStatus(e.target.value), children: STATUSES.map(s => (_jsx("option", { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s))) })] })] }), _jsx("div", { className: "flex justify-end pt-4", children: _jsx(Button, { type: "submit", variant: "primary", size: "lg", disabled: isSubmitting || !selectedStudentId || !selectedCourseId, className: "min-w-[140px]", children: isSubmitting ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Assigning..."] })) : ("Assign Student") }) })] }) })] }), _jsxs(Card, { className: "mb-8", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-2xl bg-gradient-to-r from-slate-500 to-slate-600 flex items-center justify-center", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" }) }) }), "Filter Enrollments"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course" }), _jsxs("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: filterCourseId, onChange: (e) => setFilterCourseId(e.target.value), children: [_jsx("option", { value: "", children: "All Courses" }), courses.map(c => (_jsxs("option", { value: c.id, children: [c.code, " \u2014 ", c.title] }, c.id)))] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Semester" }), _jsxs("select", { className: "w-full h-12 border-2 border-slate-200 rounded-xl px-4 bg-white/50 backdrop-blur-sm focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300", value: filterSemesterId, onChange: (e) => setFilterSemesterId(e.target.value), children: [_jsx("option", { value: "", children: "All Semesters" }), SEMESTERS.map(s => (_jsx("option", { value: s, children: s }, s)))] })] }), _jsx("div", { className: "flex items-end", children: _jsx(Button, { onClick: applyFilters, variant: "outline", size: "lg", className: "w-full h-12", children: "Apply Filters" }) })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center", children: _jsx("svg", { className: "w-5 h-5 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" }) }) }), "All Enrollments", _jsxs("div", { className: "ml-auto px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600", children: [enrollments.length, " total"] })] }) }), _jsx(CardContent, { children: enrollments.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center", children: _jsx("svg", { className: "w-8 h-8 text-slate-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" }) }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-800 mb-2", children: "No enrollments found" }), _jsx("p", { className: "text-slate-600 mb-4", children: "Get started by assigning a student to a course above." })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "hidden lg:block overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-slate-200", children: [_jsx("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Student" }), _jsx("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Course" }), _jsx("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Semester" }), _jsx("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Status" }), _jsx("th", { className: "text-left py-4 px-4 font-semibold text-slate-700", children: "Actions" })] }) }), _jsx("tbody", { children: enrollments.map(e => (_jsxs("tr", { className: "border-b border-slate-100 hover:bg-slate-50 transition-colors", children: [_jsx("td", { className: "py-4 px-4", children: _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "font-medium text-slate-800", children: studentNameMap[e.studentId] || 'Unknown Student' }), _jsx("div", { className: "font-mono text-xs text-slate-500", children: e.studentId })] }) }), _jsx("td", { className: "py-4 px-4", children: _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "font-medium text-slate-800", children: courseNameMap[e.courseId] || 'Unknown Course' }), _jsx("div", { className: "font-mono text-xs text-slate-500", children: e.courseId })] }) }), _jsx("td", { className: "py-4 px-4", children: _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: e.semesterId }) }), _jsx("td", { className: "py-4 px-4", children: _jsx("select", { className: "h-9 border-2 border-slate-200 rounded-lg px-3 bg-white focus:border-blue-400 transition-colors text-sm", value: e.status, onChange: (ev) => handleUpdateStatus(e.id, ev.target.value), children: STATUSES.map(s => (_jsx("option", { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s))) }) }), _jsx("td", { className: "py-4 px-4", children: _jsx(Button, { onClick: () => handleDelete(e.id), variant: "danger", size: "sm", className: "h-9", children: "Delete" }) })] }, e.id))) })] }) }), _jsx("div", { className: "lg:hidden space-y-4", children: enrollments.map(e => (_jsx("div", { className: "border border-slate-200 rounded-2xl p-4 bg-white shadow-soft", children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-xs font-medium text-slate-500 mb-1", children: "Student" }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "font-medium text-slate-800", children: studentNameMap[e.studentId] || 'Unknown Student' }), _jsx("div", { className: "font-mono text-xs text-slate-500", children: e.studentId })] })] }), _jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: e.semesterId })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-slate-500 mb-1", children: "Course" }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "font-medium text-slate-800", children: courseNameMap[e.courseId] || 'Unknown Course' }), _jsx("div", { className: "font-mono text-xs text-slate-500", children: e.courseId })] })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-xs font-medium text-slate-500 mb-2", children: "Status" }), _jsx("select", { className: "w-full h-10 border-2 border-slate-200 rounded-lg px-3 bg-white focus:border-blue-400 transition-colors text-sm", value: e.status, onChange: (ev) => handleUpdateStatus(e.id, ev.target.value), children: STATUSES.map(s => (_jsx("option", { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s))) })] }), _jsx("div", { className: "flex items-end", children: _jsx(Button, { onClick: () => handleDelete(e.id), variant: "danger", size: "sm", className: "h-10 px-4", children: "Delete" }) })] })] }) }, e.id))) })] })) })] })] }));
    }
    catch (renderError) {
        console.error('❌ Enrollment component render error:', renderError);
        return (_jsx("div", { className: "p-6", children: _jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4", children: _jsx("svg", { className: "w-8 h-8 text-red-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" }) }) }), _jsx("h3", { className: "text-lg font-semibold text-gray-800 mb-2", children: "Something went wrong" }), _jsx("p", { className: "text-gray-600 mb-4", children: "There was an error loading the enrollments page." }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Reload Page" })] }) }));
    }
}
