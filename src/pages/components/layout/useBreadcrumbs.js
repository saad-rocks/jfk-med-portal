"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBreadcrumbs = useBreadcrumbs;
var react_router_dom_1 = require("react-router-dom");
function useBreadcrumbs() {
    var location = (0, react_router_dom_1.useLocation)();
    var params = (0, react_router_dom_1.useParams)();
    var path = location.pathname;
    var crumbs = [{ label: "Home", to: "/" }];
    // Static mappings
    var staticMap = {
        "/courses": "Courses",
        "/enrollments": "Enrollments",
        "/attendance": "Attendance",
        "/gradebook": "Gradebook",
        "/announcements": "Announcements",
        "/semesters": "Semesters",
        "/settings": "Settings",
        "/osce": "OSCE",
        "/clinical": "Clinical",
        "/immunizations": "Immunizations",
    };
    // Exact static match
    if (staticMap[path]) {
        crumbs.push({ label: staticMap[path] });
        return crumbs;
    }
    // Pattern-based
    if (path.startsWith("/courses/")) {
        crumbs.push({ label: "Courses", to: "/courses" });
        var courseId = params.courseId;
        if (courseId)
            crumbs.push({ label: String(courseId), to: "/courses/".concat(courseId) });
        if (path.endsWith("/assignments/teacher")) {
            crumbs.push({ label: "Assignments (Teacher)" });
            return crumbs;
        }
        if (path.endsWith("/assignments")) {
            crumbs.push({ label: "Assignments" });
            return crumbs;
        }
        return crumbs;
    }
    if (path.startsWith("/assignments/")) {
        crumbs.push({ label: "Assignments" });
        crumbs.push({ label: "Grade" });
        return crumbs;
    }
    return crumbs;
}
