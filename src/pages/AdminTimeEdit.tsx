import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useRole } from "../hooks/useRole";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { updateTimeEntry, calculateHours } from "../lib/timeTracking";

export default function AdminTimeEdit() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { entryId } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState("");
  const [clockInTime, setClockInTime] = useState("");
  const [clockOutTime, setClockOutTime] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!entryId) return;
      setLoading(true);
      try {
        const d = await getDoc(doc(db, "timeEntries", entryId));
        if (d.exists()) {
          const data = d.data() as any;
          setDate(String(data.date || ""));
          setClockInTime(new Date(data.clockIn).toISOString().slice(11, 16));
          setClockOutTime(data.clockOut ? new Date(data.clockOut).toISOString().slice(11, 16) : "");
          setNotes(String(data.notes || ""));
        }
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [entryId]);

  if (!(role === 'admin' || role === 'teacher')) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Time Entry" breadcrumb={[{ label: 'Time', to: '/time' }, { label: 'Edit Entry' }]} />
        <Card><CardContent className="p-6">Only staff and admins can edit time entries.</CardContent></Card>
      </div>
    );
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!entryId || !date || !clockInTime || !clockOutTime) return;
    setSaving(true);
    try {
      const clockIn = new Date(`${date}T${clockInTime}`).getTime();
      const clockOut = new Date(`${date}T${clockOutTime}`).getTime();
      const totalHours = calculateHours(clockIn, clockOut);
      await updateTimeEntry(entryId, { date, clockIn, clockOut, totalHours, notes });
      navigate('/time', { replace: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Time Entry" breadcrumb={[{ label: 'Time', to: '/time' }, { label: 'Edit Entry' }]} />
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
          ) : (
            <form onSubmit={onSave} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Clock In</label>
                  <Input type="time" value={clockInTime} onChange={(e) => setClockInTime(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Clock Out</label>
                  <Input type="time" value={clockOutTime} onChange={(e) => setClockOutTime(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={saving}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

