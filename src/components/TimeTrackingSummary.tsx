import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Download, Clock, BarChart3, ChevronLeft, ChevronRight, TrendingUp, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { useToast } from '../hooks/useToast';
import {
  getTimeEntriesForUser,
  getMonthlyReport,
  formatDate,
  formatTime,
  calculateHours,
  updateTimeEntry,
  deleteTimeEntry,
  type TimeEntry,
  type MonthlyReport
} from '../lib/timeTracking';
import { generateMonthlyTimeReport } from '../lib/pdfGenerator';
import { generateMonthlyTimeReportMake } from '../lib/pdfGeneratorMake';
import { generateMonthlyTimeReportClean } from '../lib/pdfGeneratorClean';

interface TimeTrackingSummaryProps {
  userId?: string;
  displayName?: string;
}

type EditFormState = {
  date: string;
  clockInTime: string;
  clockOutTime: string;
  notes: string;
};

const formatTimeInput = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function TimeTrackingSummary({ userId, displayName }: TimeTrackingSummaryProps) {
  const { push } = useToast();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [pdfGenerator, setPdfGenerator] = useState<'jspdf' | 'pdfmake' | 'clean'>('clean');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    date: formatDate(new Date()),
    clockInTime: '',
    clockOutTime: '',
    notes: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [entryActionId, setEntryActionId] = useState<string | null>(null);

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const loadMonthlyData = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
      const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
      const endDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${lastDayOfMonth
        .getDate()
        .toString()
        .padStart(2, '0')}`;

      const [monthlyEntries, report] = await Promise.all([
        getTimeEntriesForUser(userId, startDate, endDate),
        getMonthlyReport(userId, displayName || 'User', currentMonth.toString().padStart(2, '0'), currentYear)
      ]);

      setEntries(monthlyEntries);
      setMonthlyReport(report);
    } catch (error) {
      push({
        title: 'Error',
        description: 'Failed to load monthly time data',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear, displayName, push, userId]);

  useEffect(() => {
    void loadMonthlyData();
  }, [loadMonthlyData]);

  const entriesByDate = useMemo(() => {
    return entries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = [];
      }
      acc[entry.date].push(entry);
      return acc;
    }, {} as Record<string, TimeEntry[]>);
  }, [entries]);

  const dailyDetails = useMemo(() => {
    return Object.entries(entriesByDate)
      .map(([dateKey, dayEntries]) => {
        const sortedEntries = [...dayEntries].sort((a, b) => a.clockIn - b.clockIn);
        const totalHours = sortedEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
        return {
          date: dateKey,
          totalHours: Math.round(totalHours * 100) / 100,
          sessions: sortedEntries.length,
          entries: sortedEntries,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [entriesByDate]);

  const totalHours = useMemo(
    () => entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0),
    [entries]
  );

  const workingDays = useMemo(() => Object.keys(entriesByDate).length, [entriesByDate]);
  const avgHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0;

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const openEditDialog = (entry: TimeEntry) => {
    if (!entry.id) return;
    const baseClockOut = entry.clockOut ?? entry.clockIn;
    setEditingEntry(entry);
    setEditForm({
      date: entry.date,
      clockInTime: formatTimeInput(entry.clockIn),
      clockOutTime: formatTimeInput(baseClockOut),
      notes: entry.notes ?? '',
    });
    setEditDialogOpen(true);
  };

  const handleEditFieldChange = (field: keyof EditFormState, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingEntry?.id) return;

    if (!editForm.clockInTime || !editForm.clockOutTime) {
      push({
        title: 'Missing Time',
        description: 'Clock in and clock out times are required.',
        variant: 'error'
      });
      return;
    }

    const clockIn = new Date(`${editForm.date}T${editForm.clockInTime}`).getTime();
    const clockOut = new Date(`${editForm.date}T${editForm.clockOutTime}`).getTime();

    if (clockOut <= clockIn) {
      push({
        title: 'Invalid Time Range',
        description: 'Clock out time must be after clock in time.',
        variant: 'error'
      });
      return;
    }

    setSavingEdit(true);
    try {
      const totalHoursForEntry = calculateHours(clockIn, clockOut);
      await updateTimeEntry(editingEntry.id, {
        date: editForm.date,
        clockIn,
        clockOut,
        totalHours: totalHoursForEntry,
        notes: editForm.notes || undefined,
      });

      push({
        title: 'Entry Updated',
        description: 'Time entry changes saved successfully.',
        variant: 'success'
      });

      handleEditDialogOpenChange(false);
      await loadMonthlyData();
    } catch (error) {
      if (error instanceof Error && error.message === 'TIME_ENTRY_OVERLAP') {
        push({
          title: 'Overlapping Entry',
          description: 'This time range overlaps another entry for the same day. Adjust the times and try again.',
          variant: 'error'
        });
      } else if (error instanceof Error && error.message === 'TIME_ENTRY_INVALID_RANGE') {
        push({
          title: 'Invalid Time Range',
          description: 'Clock out time must be after clock in time.',
          variant: 'error'
        });
      } else {
        push({
          title: 'Error',
          description: 'Failed to update the time entry.',
          variant: 'error'
        });
      }
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteEntry = async (entry: TimeEntry) => {
    if (!entry.id) return;
    const confirmed = window.confirm('Delete this time entry? This action cannot be undone.');
    if (!confirmed) return;

    setEntryActionId(entry.id);
    try {
      await deleteTimeEntry(entry.id);
      push({
        title: 'Entry Deleted',
        description: 'The time entry was removed successfully.',
        variant: 'success'
      });
      await loadMonthlyData();
    } catch (error) {
      push({
        title: 'Error',
        description: 'Failed to delete the time entry.',
        variant: 'error'
      });
    } finally {
      setEntryActionId(null);
    }
  };

  const handleEditDialogOpenChange = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setEditingEntry(null);
      setEditForm({
        date: formatDate(new Date()),
        clockInTime: '',
        clockOutTime: '',
        notes: '',
      });
    }
  };

  const generatePDF = () => {
    if (!monthlyReport || entries.length === 0) {
      push({
        title: 'No Data',
        description: 'No time data available to export',
        variant: 'error'
      });
      return;
    }

    try {
      if (pdfGenerator === 'clean') {
        generateMonthlyTimeReportClean(monthlyReport);
        push({
          title: 'PDF Generated',
          description: 'Clean 1-page report downloaded successfully',
          variant: 'success'
        });
      } else if (pdfGenerator === 'pdfmake') {
        generateMonthlyTimeReportMake(monthlyReport);
        push({
          title: 'PDF Generated (pdfmake)',
          description: 'Professional PDF report downloaded successfully',
          variant: 'success'
        });
      } else {
        generateMonthlyTimeReport(monthlyReport);
        push({
          title: 'PDF Generated (jspdf)',
          description: 'Compact PDF report downloaded successfully',
          variant: 'success'
        });
      }
    } catch (error) {
      push({
        title: 'Error',
        description: 'Failed to generate PDF report',
        variant: 'error'
      });
    }
  };

  return (
    <>
      <Card className="h-full shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-base font-semibold text-slate-800">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Monthly Summary
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant={pdfGenerator === 'clean' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPdfGenerator('clean')}
              >
                Clean
              </Button>
              <Button
                variant={pdfGenerator === 'pdfmake' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setPdfGenerator('pdfmake')}
              >
                Detailed
              </Button>
              <Button variant="primary" size="sm" onClick={generatePDF} className="bg-blue-600 hover:bg-blue-700">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">Selected Month</p>
              <p className="text-lg font-semibold text-slate-800">
                {currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-sky-50 p-4 text-center border border-sky-100">
              <div className="mb-1 flex items-center justify-center text-sm font-medium text-sky-600">
                <Clock className="mr-2 h-4 w-4" /> Total Hours
              </div>
              <div className="text-2xl font-bold text-sky-800">{totalHours.toFixed(2)}</div>
            </div>
            <div className="rounded-xl bg-teal-50 p-4 text-center border border-teal-100">
              <div className="mb-1 flex items-center justify-center text-sm font-medium text-teal-600">
                <Calendar className="mr-2 h-4 w-4" /> Working Days
              </div>
              <div className="text-2xl font-bold text-teal-800">{workingDays}</div>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center border border-emerald-100">
              <div className="mb-1 flex items-center justify-center text-sm font-medium text-emerald-600">
                <TrendingUp className="mr-2 h-4 w-4" /> Avg Hours/Day
              </div>
              <div className="text-2xl font-bold text-emerald-800">{avgHoursPerDay.toFixed(2)}</div>
            </div>
          </div>

          <div className="space-y-3">
            {dailyDetails.length === 0 ? (
              <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
                No time entries recorded for this month.
              </div>
            ) : (
              dailyDetails.map((day) => {
                const [year, month, dayNum] = day.date.split('-').map(Number);
                const localDate = new Date(year, month - 1, dayNum);
                const prettyDate = localDate.toLocaleDateString([], {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <div key={day.date} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>{prettyDate}</span>
                      <span>{day.sessions} session{day.sessions === 1 ? '' : 's'}</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {day.totalHours.toFixed(2)} hours
                    </div>

                    <div className="mt-3 space-y-2">
                      {day.entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800">
                              <span>
                                {formatTime(entry.clockIn)} – {entry.clockOut ? formatTime(entry.clockOut) : 'Pending'}
                              </span>
                              <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                {entry.isManual ? 'Manual' : 'Clocked'}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-500">
                              {(entry.totalHours ?? 0).toFixed(2)} hours
                              {entry.notes ? ` · ${entry.notes}` : ''}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(entry)}
                              disabled={entryActionId === entry.id}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteEntry(entry)}
                              disabled={entryActionId === entry.id}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {loading && (
            <p className="text-center text-sm text-slate-500">Loading monthly data.</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={handleEditDialogOpenChange}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
            <DialogDescription>Update the recorded time range or notes for this entry.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={editForm.date}
                onChange={(event) => handleEditFieldChange('date', event.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-clock-in">Clock In</Label>
                <Input
                  id="edit-clock-in"
                  type="time"
                  value={editForm.clockInTime}
                  onChange={(event) => handleEditFieldChange('clockInTime', event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-clock-out">Clock Out</Label>
                <Input
                  id="edit-clock-out"
                  type="time"
                  value={editForm.clockOutTime}
                  onChange={(event) => handleEditFieldChange('clockOutTime', event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                rows={3}
                value={editForm.notes}
                onChange={(event) => handleEditFieldChange('notes', event.target.value)}
                placeholder="Optional context for this entry"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleEditDialogOpenChange(false)}
                disabled={savingEdit}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={savingEdit} className="bg-blue-600 text-white hover:bg-blue-700">
                {savingEdit ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
