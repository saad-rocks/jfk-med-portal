import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import CreateAssignment from "../components/CreateAssignment";

export default function AssignmentCreate() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const courseId = params.get("courseId") || undefined;

  return (
    <div className="space-y-6">
      <PageHeader title="Create Assignment" />
      <CreateAssignment
        courseId={courseId}
        onSuccess={() => navigate("/assignments", { replace: true })}
        onCancel={() => navigate("/assignments", { replace: true })}
      />
    </div>
  );
}

