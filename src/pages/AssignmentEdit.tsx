import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import EditAssignment from "../components/EditAssignment";
import type { Assignment } from "../types";
import { getAssignment } from "../lib/assignments";

export default function AssignmentEdit() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<Assignment & { id: string } | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!assignmentId) return;
      setLoading(true);
      try {
        const a = await getAssignment(assignmentId);
        setAssignment(a);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [assignmentId]);

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Assignment" />
      {loading ? (
        <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
      ) : !assignment ? (
        <div className="p-6 rounded-xl border border-slate-200 bg-white">Assignment not found.</div>
      ) : (
        <EditAssignment
          assignment={assignment}
          onSuccess={() => navigate("/assignments", { replace: true })}
          onCancel={() => navigate("/assignments", { replace: true })}
        />
      )}
    </div>
  );
}

