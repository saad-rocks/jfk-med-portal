import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, Download, Clock, BarChart3, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '../hooks/useToast';
import {
  getTimeEntriesForUser,
  getMonthlyReport,
  formatDate,
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

export function TimeTrackingSummary({ userId, displayName }: TimeTrackingSummaryProps) {
  const { push } = useToast();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [pdfGenerator, setPdfGenerator] = useState<'jspdf' | 'pdfmake' | 'clean'>('clean');

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
      console.error('Error loading monthly data:', error);
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

  const totalHours = useMemo(
    () => entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0),
    [entries]
  );

  const workingDays = useMemo(() => Object.keys(entriesByDate).length, [entriesByDate]);
  const avgHoursPerDay = workingDays > 0 ? totalHours / workingDays : 0;

  const dailyTotals = useMemo(() =>
    Object.entries(entriesByDate)
      .map(([date, dayEntries]) => {
        const dayTotalHours = dayEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0);
        return {
          date,
          totalHours: Math.round(dayTotalHours * 100) / 100,
          sessions: dayEntries.length
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [entriesByDate]
  );

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
      console.error('Error generating PDF:', error);
      push({
        title: 'Error',
        description: 'Failed to generate PDF report',
        variant: 'error'
      });
    }
  };

  return (
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
          {dailyTotals.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
              No time entries recorded for this month.
            </div>
          ) : (
            dailyTotals.map((day) => {
              // Parse date string as local date to avoid timezone issues
              const [year, month, dayNum] = day.date.split('-').map(Number);
              const localDate = new Date(year, month - 1, dayNum);

              return (
                <div key={day.date} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{formatDate(localDate)}</span>
                    <span>{day.sessions} session{day.sessions === 1 ? '' : 's'}</span>
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {day.totalHours.toFixed(2)} hours
                  </div>
                </div>
              );
            })
          )}
        </div>

        {loading && (
          <p className="text-center text-sm text-slate-500">Loading monthly data…</p>
        )}
      </CardContent>
    </Card>
  );
}
