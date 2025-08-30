import { useLocation, useParams } from "react-router-dom";

export type Crumb = { label: string; to?: string };

export function useBreadcrumbs(): Crumb[] {
  const location = useLocation();
  const params = useParams();
  const path = location.pathname;

  const crumbs: Crumb[] = [{ label: "Home", to: "/" }];

  // Static mappings
  const staticMap: Record<string, string> = {
    "/courses": "Courses",
    "/enrollments": "Enrollments",
    "/attendance": "Attendance",
    "/gradebook": "Gradebook", // This will be updated when we have a course-specific route
    "/announcements": "Announcements",
    "/semesters": "Semesters",
    "/settings": "Settings",

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
    const { courseId } = params as { courseId?: string };
    
    if (courseId) {
      // For the main course detail page, show "Course Details" instead of the ID
      if (path === `/courses/${courseId}`) {
        crumbs.push({ label: "Course Details", to: `/courses/${courseId}` });
      } else {
        crumbs.push({ label: String(courseId), to: `/courses/${courseId}` });
      }
    }

    if (path.endsWith("/assignments/teacher")) {
      crumbs.push({ label: "Assignments (Teacher)" });
      return crumbs;
    }
    if (path.endsWith("/assignments")) {
      crumbs.push({ label: "Assignments" });
      return crumbs;
    }
    if (path.endsWith("/gradebook")) {
      crumbs.push({ label: "Gradebook" });
      return crumbs;
    }
    if (path.endsWith("/clinical-assessments")) {
      crumbs.push({ label: "Clinical Assessments" });
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


