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

  const roleClasses = useMemo(() => {
    if (!role) return "border-slate-200 bg-white text-slate-600";
    switch (role) {
      case "student":
        // Match primary theme accents
        return "border-blue-200 bg-blue-50 text-blue-700";
      case "teacher":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";
      case "admin":
        return "border-amber-200 bg-amber-50 text-amber-700";
      default:
        return "border-slate-200 bg-white text-slate-600";
    }
  }, [role]);

  // MD Year information for students
  const mdYearInfo = useMemo(() => {
    if (!mdYear) return null;

    const yearNum = parseInt(mdYear.split('-')[1]);
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

    return {
      ...yearDescriptions[yearNum],
      clinicalYear
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
        <div className="relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 shadow-lg shadow-blue-500/20">
          {/* Simplified decorative elements */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl"></div>
          <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-blue-400/15 blur-2xl"></div>

          {role === 'student' && mdYear && mdYearInfo ? (
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-7">
              {/* Left section - Main welcome content */}
              <div className="lg:col-span-7 flex items-start gap-4">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-lg flex-shrink-0 border border-white/30">
                  <Stethoscope className="h-7 w-7" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Welcome to JFK Medical Portal
                  </h2>
                  <p className="text-base font-semibold text-white/95 mb-1.5">
                    {mdYearInfo.title}
                  </p>
                  <p className="text-sm text-blue-50/85 leading-relaxed max-w-xl">
                    {mdYearInfo.description}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-white/25 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-white shadow-sm border border-white/30">
                      <GraduationCap className="h-4 w-4 mr-2" aria-hidden="true" />
                      {mdYear} Student
                    </span>
                    {todayLabel && (
                      <span className="inline-flex items-center gap-2 text-sm text-blue-50/90 font-medium">
                        <CalendarDays className="h-4 w-4 text-white/70" aria-hidden="true" />
                        {todayLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right section - MD Year info cards */}
              <div className="lg:col-span-5 flex items-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  {/* Current MD Card */}
                  <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/25 shadow-md">
                    <div className="text-xs font-semibold text-blue-100 uppercase tracking-wide mb-2">
                      Current MD
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {mdYear}
                    </div>
                    <div className="text-xs text-blue-100/70">
                      Trisemester {parseInt(mdYear.split('-')[1])}
                    </div>
                  </div>

                  {/* Clinical Year Card */}
                  {mdYearInfo.clinicalYear ? (
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/25 shadow-md">
                      <div className="text-xs font-semibold text-emerald-100 uppercase tracking-wide mb-2">
                        Clinical Year
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">
                        Year {mdYearInfo.clinicalYear}
                      </div>
                      <div className="text-xs text-emerald-100/70">
                        Clinical Phase
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/25 shadow-md">
                      <div className="text-xs font-semibold text-amber-100 uppercase tracking-wide mb-2">
                        Academic Phase
                      </div>
                      <div className="text-lg font-bold text-white mb-1">
                        Pre-Clinical
                      </div>
                      <div className="text-xs text-amber-100/70">
                        Foundation Year
                      </div>
                    </div>
                  )}

                  {/* Progress Card - Full Width */}
                  <div className="col-span-2 bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/25 shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-blue-100 uppercase tracking-wide">
                        Program Progress
                      </span>
                      <span className="text-sm font-bold text-white">
                        {Math.round((parseInt(mdYear.split('-')[1]) / 11) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-300 to-blue-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(parseInt(mdYear.split('-')[1]) / 11) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-blue-100/80">
                      Semester {parseInt(mdYear.split('-')[1])} of 11
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions at bottom if present */}
              {actions && (
                <div className="lg:col-span-12 flex flex-wrap items-center gap-2 pt-2 border-t border-white/20">
                  {actions}
                </div>
              )}
            </div>
          ) : (
            <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4 flex-1">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white shadow-lg flex-shrink-0">
                  <Stethoscope className="h-7 w-7" aria-hidden="true" />
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-white mb-1">
                    Welcome to JFK Medical Portal
                  </h2>
                  <h3 className="text-lg font-semibold text-white/95 mt-1">
                    {greeting}, {userName}
                  </h3>
                  <p className="mt-1.5 text-sm text-blue-50/90">
                    Welcome back to your portal
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2.5">
                    {role && (
                      <span className="inline-flex items-center rounded-full bg-white/25 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white shadow-sm border border-white/30">
                        {roleLabel}
                      </span>
                    )}
                    {todayLabel && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-blue-50/90 font-medium">
                        <CalendarDays className="h-3.5 w-3.5 text-white/80" aria-hidden="true" />
                        {todayLabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {actions && (
                <div className="flex flex-wrap items-center gap-2 sm:justify-end flex-shrink-0">
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
