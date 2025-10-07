# Dashboard Refresh Plan

## Baseline Snapshot (2025-09-28)
- **Route**: `/` renders `Dashboard` (`src/pages/Dashboard.tsx`).
- **Primary Modules**: `QuickActions`, `CourseOverview`, `AssignmentOverview`, `SessionOverview`, `DashboardStats`, `TimeTrackingSection` (teachers/admin only).
- **Data Sources**: `listCourses`, `listEnrollmentsForStudent`, assignment helpers, `getUserStats`, `getAllSessions`.
- **Loading State**: skeleton cards displayed until parallel requests resolve.

## UI & Layout Findings
- Greeting + heading stack duplicated when breadcrumbs render; spacing inconsistent.
- Quick actions relied on `items-start`, causing icon/text drift on small screens.
- Bright gradients across cards and buttons felt unprofessional.
- Course/assignment cards broke layout on tablet due to rigid flex usage.
- CTA buttons (e.g., View Course) used manual margins that misaligned on mobile.
- Several components rendered mojibake characters in separators and grade indicators.

## Breakpoint Notes
- `QuickActions` jumped from 1 to 2 columns at `md`, but inner layout stayed left-biased.
- `AssignmentOverview` locked to two columns, overflowing on tablet.
- `SessionOverview` timeline text drifted on small screens.
- Breadcrumb separator glyphs collapsed when viewport shrank.

## Success Criteria
- Student dashboard surfaces KPI tiles, upcoming deadlines, today’s schedule, and support links.
- Buttons/icons stay centered across breakpoints with neutral color palette.
- Layout uses Tailwind spacing scale with mobile-first grids.

## Iteration 1 – Student Experience Refresh
- Replaced dashboard hero with KPI snapshot, academic summary, schedule, and support modules (`src/pages/Dashboard.tsx`).
- Added student widgets (`StudentSnapshot`, `StudentAcademicSummary`, `StudentSchedule`, `StudentSupport`).
- Standardised heading/crumb layout via `PageHeader`; neutralised quick actions; restyled assignment/course cards; removed mojibake.
- Defaulted shared `Button` to `type="button"` for safer form usage.

## Iteration 2 – Visual & Responsive Polish
- Quick actions now use balanced icon tiles with focus states and consistent spacing.
- Course and assignment cards adopt rounded containers, mobile-first stacking, centered CTAs.
- Support resources list uses semantic bullets and inline navigation buttons.
- Performed responsive spot-checks (<=640px, 768px, >=1024px) to verify grid collapse and button centering.
- Accessibility sweep: ensured decorative icons set `aria-hidden`, breadcrumb uses labelled `<nav>`, and tile contrast stays >= 4.5:1.
