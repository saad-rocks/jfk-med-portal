import React from "react";
import { PageHeader } from "../components/layout/PageHeader";
import { useRole } from "../hooks/useRole";
import { Card, CardContent } from "../components/ui/card";
import { TimeTrackingSection } from "../components/TimeTrackingSection";

export default function TimeTracking() {
  const { role, user } = useRole();

  if (!(role === 'admin' || role === 'teacher')) {
    return (
      <div className="space-y-6">
        <PageHeader title="Time Tracking" breadcrumb={[{ label: 'Time', to: '/time' }]} />
        <Card><CardContent className="p-6">Only staff and admins can access time tracking.</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Time Tracking" breadcrumb={[{ label: 'Time', to: '/time' }]} />
      <TimeTrackingSection role={role} userId={user?.uid} displayName={user?.displayName || user?.email || undefined} />
    </div>
  );
}




