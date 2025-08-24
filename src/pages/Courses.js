import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { createCourse, listCourses } from "../lib/courses";
import { useToast } from "../components/ui/toast";
import { PageHeader } from "../components/layout/PageHeader";
import { PageActions } from "../components/layout/PageActions";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { X, Plus, BookOpen, Users, Clock, GraduationCap, User as UserIcon, FileText } from "lucide-react";
import { useRole } from "../hooks/useRole";
const SEMESTERS = Array.from({ length: 11 }, (_, i) => `MD-${i + 1}`);
export default function Courses() {
    const { push } = useToast();
    const { user, role, loading } = useRole();
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState([]);
    const [query, setQuery] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
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
            }
            catch (e) {
                setError(e?.message ?? "Failed to load courses");
            }
        })();
    }, []);
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
    return (_jsxs("div", { className: "p-6 max-w-4xl mx-auto", children: [_jsx(PageHeader, { title: "Courses", breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Courses' }], actions: _jsx(PageActions, { children: canCreate && (_jsxs(Button, { variant: "primary", onClick: handleOpenCreateModal, className: "flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), "New Course"] })) }) }), _jsx("div", { className: "mb-6 flex items-center gap-2", children: _jsxs("div", { className: "relative flex-1", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none", children: _jsx(BookOpen, { size: 18, className: "text-slate-400" }) }), _jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Search courses by code or title...", className: "w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-2xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 focus:bg-white transition-all duration-300 hover:border-slate-300/80 text-slate-700 placeholder-slate-400" })] }) }), error && (_jsx("div", { className: "mb-6 p-4 rounded-2xl bg-red-50/80 text-red-700 border border-red-200/50 shadow-soft backdrop-blur-sm", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-red-500" }), _jsx("span", { className: "font-medium", children: error })] }) })), showCreateModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4", children: _jsx("div", { className: "bg-white rounded-3xl shadow-glow max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-r from-blue-100 to-teal-100 rounded-xl", children: _jsx(BookOpen, { size: 20, className: "text-blue-600" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-slate-800", children: "Create New Course" }), _jsx("p", { className: "text-sm text-slate-600", children: "Add a new course to the curriculum" })] })] }), _jsx("button", { onClick: handleCloseCreateModal, className: "p-2 hover:bg-slate-100 rounded-xl transition-colors", children: _jsx(X, { size: 20, className: "text-slate-500" }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Code *" }), _jsx(Input, { value: form.code, onChange: (e) => setForm({ ...form, code: e.target.value }), placeholder: "e.g., ANAT101", required: true, className: "h-11" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Name *" }), _jsx(Input, { value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), placeholder: "e.g., Human Anatomy", required: true, className: "h-11" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Credit Hours *" }), _jsx(Input, { type: "number", min: 0, max: 10, value: form.credits, onChange: (e) => setForm({ ...form, credits: Number(e.target.value) }), placeholder: "e.g., 4", required: true, className: "h-11" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Instructor *" }), _jsx(Input, { value: courseInstructor, onChange: (e) => setCourseInstructor(e.target.value), placeholder: "e.g., Dr. Sarah Johnson", required: true, className: "h-11" })] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Semester *" }), _jsx("select", { className: "w-full h-11 border-2 border-slate-200 rounded-xl px-3 focus:border-blue-400 focus:outline-none transition-colors", value: form.semester, onChange: (e) => setForm({ ...form, semester: e.target.value }), children: SEMESTERS.map(s => (_jsx("option", { value: s, children: s }, s))) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Student Capacity *" }), _jsx(Input, { type: "number", min: 1, value: form.capacity, onChange: (e) => setForm({ ...form, capacity: Number(e.target.value) }), placeholder: "e.g., 50", required: true, className: "h-11" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm font-semibold text-slate-700", children: "Course Description *" }), _jsx("textarea", { value: courseDescription, onChange: (e) => setCourseDescription(e.target.value), placeholder: "Provide a detailed description of the course content, objectives, and learning outcomes...", required: true, rows: 4, className: "w-full border-2 border-slate-200 rounded-xl px-3 py-3 focus:border-blue-400 focus:outline-none transition-colors resize-none" })] }), _jsxs("div", { className: "flex items-center justify-end gap-3 pt-4 border-t border-slate-200", children: [_jsx(Button, { type: "button", variant: "outline", onClick: handleCloseCreateModal, className: "px-6", children: "Cancel" }), _jsx(Button, { type: "submit", variant: "primary", className: "px-6", children: "Create Course" })] })] })] }) }) })), courses.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-teal-100 rounded-2xl mb-4", children: _jsx(BookOpen, { size: 32, className: "text-blue-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-800 mb-2", children: "No Courses Available" }), _jsx("p", { className: "text-slate-600 mb-6", children: "Get started by creating your first course" }), canCreate && (_jsxs(Button, { variant: "primary", onClick: handleOpenCreateModal, className: "flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), "Create First Course"] }))] })) : (_jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: courses
                    .filter(c => !query || (c.title?.toLowerCase().includes(query.toLowerCase()) || c.code?.toLowerCase().includes(query.toLowerCase())))
                    .map((c) => (_jsxs(Card, { className: "hover:shadow-glow transition-all duration-300 interactive", children: [_jsx(CardHeader, { className: "pb-3", children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsxs(CardTitle, { className: "text-lg leading-tight mb-2", children: [c.code, " \u2014 ", c.title] }), _jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(Badge, { variant: "default", className: "text-xs bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200", children: c.semester }), _jsxs(Badge, { variant: "secondary", className: "text-xs bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border-slate-200", children: [c.credits, " Credits"] })] })] }) }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx(Users, { size: 14 }), _jsxs("span", { children: ["Capacity: ", c.capacity, " students"] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-600", children: [_jsx(UserIcon, { size: 14 }), _jsxs("span", { children: ["Instructor: ", c.instructor || 'TBD'] })] }), c.description && (_jsxs("div", { className: "flex items-start gap-2 text-sm text-slate-600", children: [_jsx(FileText, { size: 14, className: "mt-0.5 flex-shrink-0" }), _jsx("p", { className: "line-clamp-2", children: c.description })] })), _jsx("div", { className: "pt-2 border-t border-slate-100", children: _jsxs("div", { className: "flex items-center justify-between text-xs text-slate-500", children: [_jsxs("span", { children: ["Created by: ", String(c.ownerId || "").slice(0, 8), "\u2026"] }), _jsx("span", { children: new Date(c.createdAt).toLocaleDateString() })] }) })] })] }, c.id))) }))] }));
}
