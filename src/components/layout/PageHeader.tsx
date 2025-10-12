import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Stethoscope, CalendarDays, GraduationCap } from "lucide-react";
import { useBreadcrumbs, type Crumb } from "./useBreadcrumbs";
import type { Role, MDYear } from "../../types";

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
  breadcrumb?: Array<Crumb>;
  userName?: string;
  role?: Role;
  mdYear?: MDYear;
}

export function PageHeader({
  title,
  actions,
  breadcrumb,
  userName,
  role,
  mdYear
}: PageHeaderProps) {
  const auto = useBreadcrumbs();
  const resolvedBreadcrumb = breadcrumb ?? auto;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const todayLabel = useMemo(() => {
    try {
      return new Date().toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }, []);

  const roleLabel = useMemo(() => {
    if (!role) return "";
    // Title case (e.g., Student, Teacher, Admin)
    return role.charAt(0).toUpperCase() + role.slice(1);
  }, [role]);

  // MD Year information for students
  const mdYearInfo = useMemo(() => {
    if (!mdYear) return null;

    const yearNum = Number.parseInt(mdYear.split("-")[1], 10);
    if (!Number.isFinite(yearNum)) return null;

    // Clinical years start from MD-5
    const clinicalYear = yearNum >= 5 ? Math.ceil((yearNum - 4) / 3) : null;

    const yearDescriptions: Record<number, { title: string; description: string }> = {
      1: { title: "First Year Medical Student", description: "Building your foundation in basic sciences and clinical skills." },
      2: { title: "First Year Medical Student", description: "Advancing your knowledge in basic sciences and clinical skills." },
      3: { title: "First Year Medical Student", description: "Completing your foundation in basic sciences and clinical skills." },
      4: { title: "Second Year Medical Student", description: "Deepening clinical knowledge and patient care fundamentals." },
      5: { title: "Second Year Medical Student", description: "Advancing clinical knowledge and diagnostic skills." },
      6: { title: "Second Year Medical Student", description: "Mastering clinical knowledge and preparing for rotations." },
      7: { title: "Third Year Medical Student", description: "Engaging in clinical rotations and hands-on patient care." },
      8: { title: "Third Year Medical Student", description: "Advancing through clinical rotations and specialty exposure." },
      9: { title: "Third Year Medical Student", description: "Completing clinical rotations and refining clinical skills." },
      10: { title: "Fourth Year Medical Student", description: "Preparing for residency with advanced clinical experiences." },
      11: { title: "Fourth Year Medical Student", description: "Final preparation for medical practice and residency." }
    };

    const fallback = { title: "Medical Student", description: "Advancing through your coursework and clinical preparation." };
    const { title, description } = yearDescriptions[yearNum] ?? fallback;
    const progress = Math.min(100, Math.max(0, Math.round((yearNum / 11) * 100)));

    return {
      title,
      description,
      clinicalYear,
      yearNum,
      progress
    };
  }, [mdYear]);

  return (
    <header className="space-y-4">
      {resolvedBreadcrumb?.length ? (
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500"
        >
          {resolvedBreadcrumb.map((crumb, index) => (
            <span key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {crumb.to ? (
                <Link className="transition-colors duration-200 hover:text-blue-600" to={crumb.to}>
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-700">{crumb.label}</span>
              )}
              {index < resolvedBreadcrumb.length - 1 && (
                <span aria-hidden="true" className="text-slate-400">
                  /
                </span>
              )}
            </span>
          ))}
        </nav>
      ) : null}

      {userName && (
        <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
          {role === "student" && mdYear && mdYearInfo ? (
            <div className="relative p-4 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Left: Main content */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-white sm:text-2xl">
                      Welcome to JFK Medical Portal
                    </h2>
                    <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {mdYear} Student
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-white/90 sm:text-lg">
                      {mdYearInfo.title}
                    </h3>
                    <p className="max-w-lg text-sm leading-relaxed text-white/80">
                      {mdYearInfo.description}
                    </p>
                  </div>
                </div>

                {/* Right: Condensed info display */}
                <div className="flex items-center gap-3 md:flex-col md:items-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{mdYear}</div>
                    <div className="text-xs font-medium uppercase tracking-wider text-white/70">
                      Current Year
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                      <Stethoscope className="h-6 w-6 text-white/90 sm:h-7 sm:w-7" aria-hidden="true" />
                    </div>
                    {mdYearInfo.clinicalYear ? (
                      <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                        <GraduationCap className="h-5 w-5 text-white/90 sm:h-6 sm:w-6" aria-hidden="true" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {actions && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/20 pt-4">
                  {actions}
                </div>
              )}
            </div>
          ) : (
            <div className="relative p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    Welcome to JFK Medical Portal
                  </h2>
                  <p className="text-sm text-white/80 sm:text-base">
                    {greeting}, {userName}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-white/90 sm:text-sm">
                    {role && (
                      <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">
                        {roleLabel}
                      </span>
                    )}
                    {todayLabel && (
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <CalendarDays className="h-4 w-4 text-white/75" aria-hidden="true" />
                        {todayLabel}
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden rounded-full bg-white/10 p-3 backdrop-blur-sm md:flex">
                  <Stethoscope className="h-8 w-8 text-white/90" aria-hidden="true" />
                </div>
              </div>
              {actions && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/20 pt-4">
                  {actions}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">{title}</h1>
        {!userName && actions ? (
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
