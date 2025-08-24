import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Tabs } from "../components/ui/tabs";
import { PageHeader } from "../components/layout/PageHeader";
export default function CourseDetail() {
    const { courseId } = useParams();
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: `Course: ${courseId}`, breadcrumb: [{ label: 'Home', to: '/' }, { label: 'Courses', to: '/courses' }, { label: String(courseId) }], actions: _jsxs("div", { className: "flex gap-2 text-sm", children: [_jsx(Link, { className: "text-blue-700 underline", to: `/courses/${courseId}/assignments`, children: "Student View" }), _jsx(Link, { className: "text-blue-700 underline", to: `/courses/${courseId}/assignments/teacher`, children: "Teacher View" })] }) }), _jsx(Tabs, { tabs: [
                    { key: 'overview', label: 'Overview', content: _jsx("div", { className: "text-sm", children: "Course intro, syllabus, faculty." }) },
                    { key: 'assignments', label: 'Assignments', content: _jsx("div", { className: "text-sm", children: "Manage and submit assignments." }) },
                    { key: 'materials', label: 'Materials', content: _jsx("div", { className: "text-sm", children: "Links and resources." }) },
                    { key: 'grades', label: 'Grades', content: _jsx("div", { className: "text-sm", children: "Grades placeholder." }) },
                    { key: 'attendance', label: 'Attendance', content: _jsx("div", { className: "text-sm", children: "Attendance placeholder." }) },
                ] })] }));
}
