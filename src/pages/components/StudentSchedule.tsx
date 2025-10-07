import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Calendar, Clock3, Navigation2, Circle } from "lucide-react";
import { getSessionDisplayName, getSessionStatus, getSessionProgress } from "../../lib/sessions";
import type { Session } from "../../lib/sessions";
import type { Assignment } from "../../types";

interface EnrichedAssignment extends Assignment {
  id: string;
  courseTitle?: string;
}

// eslint-disable-next-line no-unused-vars
type NavigateHandler = (path: string) => void;

interface StudentScheduleProps {
  currentSession: Session | null;
  nextSession: Session | null;
  upcomingAssignments: EnrichedAssignment[];
  onNavigate: NavigateHandler;
}

export function StudentSchedule({ currentSession, nextSession, upcomingAssignments, onNavigate }: StudentScheduleProps) {
  const todayAssignments = useMemo(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay.getTime());
    endOfDay.setHours(23, 59, 59, 999);

    return upcomingAssignments.filter((assignment) => {
      const dueAt = assignment.dueAt ?? 0;
      return dueAt >= startOfDay.getTime() && dueAt <= endOfDay.getTime();
    });
  }, [upcomingAssignments]);

  const currentSessionMeta = useMemo(() => {
    if (!currentSession) return null;

    const startDate = currentSession.startDate instanceof Date
      ? currentSession.startDate
      : currentSession.startDate.toDate();
    const endDate = currentSession.endDate instanceof Date
      ? currentSession.endDate
      : currentSession.endDate.toDate();

    return {
      label: getSessionDisplayName(currentSession),
      status: getSessionStatus(currentSession),
      progress: getSessionProgress(currentSession),
      startLabel: startDate.toLocaleDateString([], { month: "short", day: "numeric" }),
      endLabel: endDate.toLocaleDateString([], { month: "short", day: "numeric" }),
      description: currentSession.description || "Current academic term in progress."
    };
  }, [currentSession]);

  const nextSessionMeta = useMemo(() => {
    if (!nextSession) return null;

    const startDate = nextSession.startDate instanceof Date
      ? nextSession.startDate
      : nextSession.startDate.toDate();

    return {
      label: getSessionDisplayName(nextSession),
      startLabel: startDate.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric"
      }),
      description: nextSession.description || "Prepare any requirements before the next term begins."
    };
  }, [nextSession]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Calendar className="h-5 w-5 text-blue-500" aria-hidden="true" />
            Planner & Timeline
          </CardTitle>
          <p className="text-sm text-slate-500">
            Review what needs attention today and what is coming next.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("/sessions")}
          className="whitespace-nowrap"
        >
          Open Calendar
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Today at a Glance
          </h3>
          {todayAssignments.length > 0 ? (
            <ul className="space-y-2">
              {todayAssignments.map((assignment) => {
                const dueTime = new Date(assignment.dueAt ?? 0).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
                return (
                  <li
                    key={assignment.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-slate-800">{assignment.title}</p>
                      {assignment.courseTitle && (
                        <p className="text-xs text-slate-500">{assignment.courseTitle}</p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                      <Clock3 className="h-4 w-4" aria-hidden="true" />
                      {dueTime}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-5 text-sm text-slate-600">
              No hard deadlines today—consider reviewing course materials or prepping for upcoming sessions.
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Academic Timeline
          </h3>
          {currentSessionMeta ? (
            <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{currentSessionMeta.label}</p>
                  <p className="text-xs text-slate-500">{currentSessionMeta.description}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  <Circle className="h-3 w-3" aria-hidden="true" />
                  {currentSessionMeta.status === 'current' ? 'In Progress' : currentSessionMeta.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>{currentSessionMeta.startLabel}</span>
                  <span>{currentSessionMeta.endLabel}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-teal-500"
                    style={{ width: `${currentSessionMeta.progress}%` }}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">{currentSessionMeta.progress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-5 text-sm text-slate-600">
              We could not determine your current academic session. Visit the calendar to review upcoming terms.
            </div>
          )}

          {nextSessionMeta && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Next Term
              </p>
              <p className="mt-1 text-sm font-medium text-slate-800">{nextSessionMeta.label}</p>
              <p className="text-xs text-slate-500">Starts {nextSessionMeta.startLabel}</p>
              <p className="mt-2 text-sm text-slate-600">{nextSessionMeta.description}</p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-3 text-blue-700 hover:bg-blue-100"
                onClick={() => onNavigate("/sessions")}
              >
                Review Requirements
                <Navigation2 className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
