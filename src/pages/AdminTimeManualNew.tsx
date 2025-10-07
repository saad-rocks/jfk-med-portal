import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { useRole } from "../hooks/useRole";
import { QuickManualEntry } from "../components/ManualTimeEntry";

export default function AdminTimeManualNew() {
  const navigate = useNavigate();
  const { role } = useRole();

  if (!(role === 'admin' || role === 'teacher')) {
    return (
      <div className="space-y-6">
        <PageHeader title="Manual Time Entry" breadcrumb={[{ label: 'Time', to: '/time' }, { label: 'Manual Entry' }]} />
        <Card><CardContent className="p-6">Only staff and admins can add manual time entries.</CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Manual Time Entry" breadcrumb={[{ label: 'Time', to: '/time' }, { label: 'Manual Entry' }]} />
      <QuickManualEntry onEntryAdded={() => navigate('/time', { replace: true })} />
    </div>
  );
}

