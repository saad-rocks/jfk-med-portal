import React from "react";
import { GraduationCap, LineChart, CalendarDays, BookOpen } from "lucide-react";

interface SnapshotMetric {
  label: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StudentSnapshotProps {
  mdYear?: string;
  overallGrade: number;
  attendance: number;
  creditsInProgress: number;
  enrolledCourses: number;
  currentSemester?: string;
}

export function StudentSnapshot({
  mdYear,
  overallGrade,
  attendance,
  creditsInProgress,
  enrolledCourses,
  currentSemester
}: StudentSnapshotProps) {
  const metrics: SnapshotMetric[] = [
    {
      label: "Overall Grade",
      value: `${Number.isFinite(overallGrade) ? overallGrade.toFixed(1) : "--"}%`,
      description: "Cumulative performance across courses",
      icon: LineChart
    },
    {
      label: "Attendance",
      value: `${Number.isFinite(attendance) ? attendance.toFixed(1) : "--"}%`,
      description: "Present rate over the active term",
      icon: CalendarDays
    },
    {
      label: "Total Courses",
      value: Number.isFinite(enrolledCourses) ? String(enrolledCourses) : "--",
      description: "Active courses this term",
      icon: BookOpen
    },
    {
      label: "Current Semester",
      value: mdYear ?? currentSemester ?? "Not set",
      description: "Your current MD semester",
      icon: GraduationCap
    }
  ];

  return (
    <section aria-labelledby="student-snapshot-heading" className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur-sm shadow-sm">
      <header className="border-b border-slate-200/70 px-6 py-4">
        <h2 id="student-snapshot-heading" className="text-lg font-semibold text-slate-800">
          Academic Snapshot
        </h2>
        <p className="text-sm text-slate-500">
          Key indicators for your current term
        </p>
      </header>
      <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article
              key={metric.label}
              className="flex items-start gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/60 px-5 py-4 transition hover:border-blue-200 hover:bg-white"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {metric.label}
                </p>
                <p className="text-2xl font-semibold text-slate-800">
                  {metric.value}
                </p>
                <p className="text-sm text-slate-500">
                  {metric.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
