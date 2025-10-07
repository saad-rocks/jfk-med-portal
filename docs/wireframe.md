JFK Medical Portal — Wireframe and Sitemap

Overview
- Stack: Vite + React + TypeScript, React Router, TailwindCSS (utility), shadcn-style UI components, Firebase Auth + Firestore + Rules, Firebase Cloud Functions.
- Roles: `student`, `teacher`, `admin` with gated access in `src/App.tsx` via `AuthGate` and `useRole`.
- Layout: Global shell wraps protected routes in `src/layouts/AppShell.tsx` with header, left sidebar, main content (`<Outlet />`), and toasts.

Global Layout (AppShell)
- Header: left (menu toggle, logo/title), center (search bar), right (notifications, theme toggle, user info, sign out).
- Sidebar: section “Academic Portal”, role-aware links (Dashboard, Courses, Enrollments, Assignments, Time Tracking, Attendance, Announcements, Semesters, Settings). Admins also see Manage Users and Sessions.
- Content: card-like container for page content with `PageHeader` (breadcrumb + contextual hero for students) and page body.

Sitemap (Routes)
- Public
  - `/login` → `src/pages/Login.tsx`
  - `/profile-setup` → `src/pages/ProfileSetup.tsx`
- Protected (inside `AppShell`)
  - `/` (Dashboard) → `src/pages/Dashboard.tsx`
  - `/courses` (Courses list) → `src/pages/Courses.tsx`
  - `/courses/new` → `src/pages/CourseCreate.tsx`
  - `/courses/:courseId` → `src/pages/CourseDetail.tsx`
  - `/courses/:courseId/edit` → `src/pages/CourseEdit.tsx`
  - `/courses/:courseId/enrollments` → `src/pages/CourseEnrollments.tsx`
  - `/courses/:courseId/assign-instructor` → `src/pages/CourseAssignInstructor.tsx`
  - `/courses/:courseId/assignments` (Student) → `src/pages/AssignmentsStudent.tsx`
  - `/courses/:courseId/assignments/teacher` (Teacher) → `src/pages/AssignmentsTeacher.tsx`
  - `/assignments` (index) → `src/pages/Assignments.tsx`
  - `/assignments/new` → `src/pages/AssignmentCreate.tsx`
  - `/assignments/:assignmentId/edit` → `src/pages/AssignmentEdit.tsx`
  - `/assignments/:assignmentId/submit` → `src/pages/AssignmentSubmit.tsx`
  - `/assignments/:assignmentId/grade` → `src/pages/GradeSubmissions.tsx`
  - `/courses/:courseId/gradebook` → `src/pages/Gradebook.tsx`
  - `/enrollments` → `src/pages/Enrollments.tsx`
  - `/attendance` → `src/pages/Attendance.tsx`
  - `/announcements` → `src/pages/Announcements.tsx`
  - `/semesters` → `src/pages/Semesters.tsx`
  - `/settings` → `src/pages/Settings.tsx` (renders role-specific settings)
  - `/sessions` → `src/pages/Sessions.tsx`
  - `/time` → `src/pages/TimeTracking.tsx`
  - `/admin/time/:entryId/edit` → `src/pages/AdminTimeEdit.tsx`
  - `/admin/time/manual/new` → `src/pages/AdminTimeManualNew.tsx`
  - `/clinical` → `src/pages/ClinicalRotations.tsx`
  - `/courses/:courseId/clinical-assessments` → `src/pages/ClinicalAssessments.tsx`
  - `/immunizations` → `src/pages/Immunizations.tsx`
  - `/database-admin` → `src/pages/DatabaseAdmin.tsx`

Wireframes (Page-by-Page)

Login (`src/pages/Login.tsx`)
- Left panel (desktop): brand header with logo, welcome/notice board content.
- Right panel: card with Email, Password (show/hide), Sign in, “Forgot password?”; Sign Up modal with role-specific fields (student/teacher/admin).

Dashboard (`src/pages/Dashboard.tsx`)
- Header: `PageHeader` with breadcrumb, welcome hero; for students shows MD Year tiles and progress bar.
- Student view
  - Snapshot KPIs: overall grade, attendance, credits in progress, enrolled courses, current session label.
  - Academic Summary: upcoming assignments (due soon), overdue assignments; CTA to “Assignments”.
  - Schedule: current/next session summary; navigation to sessions.
  - Courses Overview: cards list with enrollment counts; click-through to course detail.
  - Quick Actions: role-specific shortcuts.
  - Student Support: help resources and links.
- Teacher/Admin view
  - (Admin) DashboardStats: user counts and percentages.
  - Quick Actions.
  - Courses Overview.
  - Assignment Overview: due/overdue, overall grade/attendance summary.
  - Session Overview: current/next sessions.

Courses List (`src/pages/Courses.tsx`)
- Header: title, search input.
- Tabs: Enrolled vs Available (for students).
- Filters: query search; (teacher/admin) teacher selection, course selection.
- Course cards: title, code (badge), description, semester, credits, students count, instructor.
- Actions
  - Student: Enroll / Unenroll, status badge (Enrolled/Available).
  - Teacher/Admin: Edit, Assign Instructor; (Admin/Teacher) Create Course (form with code, title, credits, semester, instructor, description).

Course Detail (`src/pages/CourseDetail.tsx`)
- Header: course title + badges, instructor summary.
- Student grade summary (if student): overall grade gauge, submitted/graded/pending counters.
- Left column: Course Information (description), Details (code, credits, semester), Instructor card.
- Right column: Quick Actions vary by role
  - Teacher/Admin: Create Assignment, View Gradebook, Grade Submissions, Manage Enrollments, Attendance.
  - Student: View Assignments, View Attendance.
- Recent Assignments list: title, type, due date, weight; overdue badge.

Assignments
- Index (`src/pages/Assignments.tsx`): role-aware landing for assignments.
- Create (`src/pages/AssignmentCreate.tsx`): form (title, type, dueAt, weight, maxPoints, instructions, attachments, course).
- Edit (`src/pages/AssignmentEdit.tsx`): same inputs with existing values.
- Submit (`src/pages/AssignmentSubmit.tsx`): upload, comments, submission state; resubmission if allowed.
- Grade Submissions (`src/pages/GradeSubmissions.tsx`): roster of submissions, grade entry, feedback, gradedAt, filters.
- Per-course views (`AssignmentsStudent.tsx`, `AssignmentsTeacher.tsx`): filtered list scoped to course.

Gradebook (`src/pages/Gradebook.tsx`)
- Table: students x assignments, points/percentages; support for per-assignment or category weighting (see `Course` grading fields).
- Actions: export, finalize grading, adjust weights (if category mode).

Enrollments (`src/pages/Enrollments.tsx`)
- List/filter enrollments; create enrollment, drop student, mark complete; student details (name/email/MD year) via `getEnrollmentsWithStudentDetails`.

Attendance (`src/pages/Attendance.tsx`)
- Record attendance by date/course; statuses: present/absent/late/excused; teacher/admin actions.

Sessions (`src/pages/Sessions.tsx`)
- Current and upcoming sessions list; details: title, time range, location, instructor; status badges; manage attendees.

Announcements (`src/pages/Announcements.tsx`)
- Create and browse announcements; filter by course/priority; publish/expire controls.

Semesters (`src/pages/Semesters.tsx`)
- Manage semesters: name, dates, active flag, academic year; list + create/edit.

Time Tracking
- User view (`src/pages/TimeTracking.tsx`): clock in/out, timecard history, weekly/monthly summaries; current session.
- Admin edits (`src/pages/AdminTimeEdit.tsx`, `AdminTimeManualNew.tsx`): fix entries, manual records, notes, updatedBy.

Clinical and Records
- Clinical Rotations (`src/pages/ClinicalRotations.tsx`) and Clinical Assessments (`src/pages/ClinicalAssessments.tsx`): per-course clinical workflows.
- Immunizations (`src/pages/Immunizations.tsx`): records and compliance tracking.

Settings (`src/pages/Settings.tsx`)
- Role-routed content:
  - StudentSettings: profile, MD year, contact, preferences.
  - TeacherSettings: department, specialization, preferences.
  - AdminSettings: permissions, system options.

Database Admin (`src/pages/DatabaseAdmin.tsx`)
- Admin-only utilities: seed data, debugging, indexes, safe operations.

Primary User Flows
- Student: Login → Profile Setup (if needed) → Dashboard → Courses (enroll/unenroll) → Course Detail → Assignments (submit) → Attendance/Immunizations → Settings.
- Teacher: Login → Dashboard → Courses Teach → Course Detail → Create Assignment → Grade Submissions → Gradebook → Attendance → Settings.
- Admin: Login → Dashboard (stats) → Manage Users → Courses (create/edit/assign instructor) → Enrollments/Sessions → Time Tracking (admin edits) → Database Admin → Settings.

Key Data Entities (from `src/types.ts`)
- User (role, status; student/teacher/admin fields), Course, Enrollment, Assignment, Submission (+grade), Session, AttendanceRecord, GradeRecord, TimeEntry/TimeCardSession.

Notes & Next Steps
- Navigation and page naming are stable in `src/App.tsx`. Sidebar is role-aware in `src/layouts/AppShell.tsx`.
- If desired, we can extend this doc with low-fidelity ASCII sketches per page or exportable diagrams (Mermaid/Draw.io). Let me know your preferred format for visuals.

