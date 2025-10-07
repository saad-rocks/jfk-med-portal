import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileText, AlertTriangle, Clock, CheckCircle, CalendarClock } from "lucide-react";
import type { Assignment } from "../../types";

interface EnrichedAssignment extends Assignment {
  id: string;
  courseTitle?: string;
}

// eslint-disable-next-line no-unused-vars
type NavigateHandler = (path: string) => void;

interface StudentAcademicSummaryProps {
  upcomingAssignments: EnrichedAssignment[];
  overdueAssignments: EnrichedAssignment[];
  onNavigate: NavigateHandler;
}

export function StudentAcademicSummary({
  upcomingAssignments,
  overdueAssignments,
  onNavigate
}: StudentAcademicSummaryProps) {
  const hasUpcoming = upcomingAssignments.length > 0;
  const hasOverdue = overdueAssignments.length > 0;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <FileText className="h-5 w-5 text-blue-500" aria-hidden="true" />
            Assignments & Deadlines
          </CardTitle>
          <p className="text-sm text-slate-500">
            Stay ahead of your coursework with the next due dates.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("/assignments")}
          className="whitespace-nowrap"
        >
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        {hasOverdue && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 p-4">
            <span className="rounded-xl bg-red-100/90 p-2 text-red-600">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-red-700">
                {overdueAssignments.length} overdue assignment{overdueAssignments.length === 1 ? "" : "s"}
              </p>
              <p className="text-sm text-red-600">
                Submit as soon as possible to avoid grade impact.
              </p>
            </div>
          </div>
        )}

        {hasUpcoming ? (
          <ul className="space-y-3">
            {upcomingAssignments.slice(0, 4).map((assignment) => {
              const dueDate = new Date(assignment.dueAt);
              const dueString = dueDate.toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
              });

              return (
                <li
                  key={assignment.id}
                  className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800">
                      {assignment.title}
                    </p>
                    {assignment.courseTitle && (
                      <p className="text-sm text-slate-500">
                        {assignment.courseTitle}
                      </p>
                    )}
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                      <CalendarClock className="h-4 w-4 text-blue-500" aria-hidden="true" />
                      Due {dueString}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="self-center whitespace-nowrap"
                    onClick={() => onNavigate(assignment.courseId ? `/courses/${assignment.courseId}/assignments` : '/assignments')}
                  >
                    Open
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/70 bg-slate-50/60 p-6 text-center">
            <CheckCircle className="h-10 w-10 text-emerald-500" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-slate-600">
              You are up to date! No upcoming deadlines for the next few days.
            </p>
          </div>
        )}

        {!hasOverdue && hasUpcoming && (
          <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-3 text-sm text-blue-700">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Use the assignment planner to block study time.
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:bg-blue-100"
              onClick={() => onNavigate("/sessions")}
            >
              Open Planner
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
