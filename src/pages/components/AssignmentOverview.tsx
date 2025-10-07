import React, { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { FileText, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import type { Assignment } from "../../types";

interface AssignmentOverviewProps {
  assignmentsDue: Array<Assignment & { id: string }>;
  overdueAssignments: Array<Assignment & { id: string }>;
  overallGrade: number;
  attendance: number;
}

export const AssignmentOverview = memo(({
  assignmentsDue,
  overdueAssignments,
  overallGrade,
  attendance
}: AssignmentOverviewProps) => {
  const totalAssignments = assignmentsDue.length + overdueAssignments.length;
  const urgentAssignments = assignmentsDue.filter((assignment) => {
    const dueDate = new Date(assignment.dueAt);
    const now = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 3;
  });

  const gradeBuckets = [
    {
      label: "A (90-100%)",
      isActive: overallGrade >= 90,
      barClass: "bg-emerald-500",
      textClass: "text-emerald-600"
    },
    {
      label: "B (80-89%)",
      isActive: overallGrade >= 80 && overallGrade < 90,
      barClass: "bg-blue-500",
      textClass: "text-blue-600"
    },
    {
      label: "C (70-79%)",
      isActive: overallGrade >= 70 && overallGrade < 80,
      barClass: "bg-amber-500",
      textClass: "text-amber-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" aria-hidden="true" />
            Assignment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overdueAssignments.length > 0 && (
              <div className="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50/80 p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-red-800">Overdue</p>
                    <p className="text-sm text-red-600">
                      {overdueAssignments.length} assignment{overdueAssignments.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" className="border-red-200 text-red-700 hover:bg-red-50">
                  View All
                </Button>
              </div>
            )}

            {urgentAssignments.length > 0 && (
              <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-amber-800">Due Soon</p>
                    <p className="text-sm text-amber-600">
                      {urgentAssignments.length} assignment{urgentAssignments.length !== 1 ? "s" : ""} in 3 days
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                  View All
                </Button>
              </div>
            )}

            {overdueAssignments.length === 0 && urgentAssignments.length === 0 && assignmentsDue.length > 0 && (
              <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-emerald-800">On Track</p>
                    <p className="text-sm text-emerald-600">
                      {assignmentsDue.length} assignment{assignmentsDue.length !== 1 ? "s" : ""} due
                    </p>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  View All
                </Button>
              </div>
            )}

            {totalAssignments === 0 && (
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 text-center">
                <FileText className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
                <p className="mt-3 text-sm text-slate-600">No assignments found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" aria-hidden="true" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Grade</p>
                <p className="text-2xl font-bold text-blue-600">{overallGrade.toFixed(1)}%</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  overallGrade >= 90
                    ? "bg-emerald-100"
                    : overallGrade >= 80
                    ? "bg-blue-100"
                    : overallGrade >= 70
                    ? "bg-amber-100"
                    : "bg-red-100"
                }`}
              >
                <TrendingUp
                  className={`h-6 w-6 ${
                    overallGrade >= 90
                      ? "text-emerald-600"
                      : overallGrade >= 80
                      ? "text-blue-600"
                      : overallGrade >= 70
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-emerald-600">{attendance.toFixed(1)}%</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  attendance >= 90
                    ? "bg-emerald-100"
                    : attendance >= 80
                    ? "bg-blue-100"
                    : attendance >= 70
                    ? "bg-amber-100"
                    : "bg-red-100"
                }`}
              >
                <CheckCircle
                  className={`h-6 w-6 ${
                    attendance >= 90
                      ? "text-emerald-600"
                      : attendance >= 80
                      ? "text-blue-600"
                      : attendance >= 70
                      ? "text-amber-600"
                      : "text-red-600"
                  }`}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="mb-3 text-sm font-medium text-gray-600">Grade Distribution</p>
              <div className="space-y-2">
                {gradeBuckets.map((bucket) => (
                  <div
                    key={bucket.label}
                    className={`flex items-center justify-between rounded-lg border border-slate-200/70 px-3 py-2 text-sm ${
                      bucket.isActive ? "bg-slate-50" : "bg-white"
                    }`}
                  >
                    <span className={bucket.isActive ? `font-semibold ${bucket.textClass}` : "text-slate-500"}>
                      {bucket.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-2 w-16 overflow-hidden rounded-full bg-slate-200 ${
                        bucket.isActive ? bucket.barClass : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

AssignmentOverview.displayName = "AssignmentOverview";
