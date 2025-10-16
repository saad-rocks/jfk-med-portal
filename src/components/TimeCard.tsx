import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Play, Square, Clock, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/useToast';
import {
  startTimeSession,
  stopTimeSession,
  getTimeTrackingStats,
  formatTime,
  type TimeTrackingStats
} from '../lib/timeTracking';
import type { Role } from '../types';

interface TimeCardProps {
  userId?: string;
  role?: Role;
}

export function TimeCard({ userId, role }: TimeCardProps) {
  const { push } = useToast();
  const [stats, setStats] = useState<TimeTrackingStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [indexBuilding, setIndexBuilding] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [elapsedTime, setElapsedTime] = useState(0);

  const isAuthorized = role === 'teacher' || role === 'admin';

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!stats?.currentSession) {
      setElapsedTime(0);
      return undefined;
    }

    const timer = window.setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - stats.currentSession!.startTime) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [stats?.currentSession]);

  const loadStats = useCallback(async () => {
    if (!userId || !isAuthorized) return;

    try {
      const statsData = await getTimeTrackingStats(userId);
      setStats(statsData);
      setIndexBuilding(false);
    } catch (error) {
      if (error instanceof Error && error.message.includes('index is currently building')) {
        setIndexBuilding(true);
        push({
          title: 'System Update in Progress',
          description: 'Time tracking system is being optimized. Please try again in a few minutes.',
          variant: 'default'
        });
      } else {
        push({
          title: 'Error',
          description: 'Failed to load time tracking data',
          variant: 'error'
        });
      }
    }
  }, [isAuthorized, push, userId]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  const formatElapsedTime = useMemo(() => (
    seconds: number
  ) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const handleStart = async () => {
    if (!userId || !isAuthorized) return;

    setLoading(true);
    try {
      await startTimeSession(userId);
      await loadStats();
      setIndexBuilding(false);
      push({
        title: 'Time Started',
        description: 'Your work session has begun',
        variant: 'success'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('index is currently building')) {
        push({
          title: 'System Update in Progress',
          description: 'Time tracking system is being optimized. Please try again in a few minutes.',
          variant: 'default'
        });
      } else {
        push({
          title: 'Error',
          description: 'Failed to start time tracking',
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    if (!userId || !isAuthorized) return;

    setLoading(true);
    try {
      await stopTimeSession(userId);
      await loadStats();
      setIndexBuilding(false);
      push({
        title: 'Time Stopped',
        description: 'Your work session has ended',
        variant: 'success'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('index is currently building')) {
        push({
          title: 'System Update in Progress',
          description: 'Time tracking system is being optimized. Please try again in a few minutes.',
          variant: 'default'
        });
      } else {
        push({
          title: 'Error',
          description: 'Failed to stop time tracking',
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized || !userId) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Clock className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <p>Time tracking is only available for faculty and staff members.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Time Card
          {indexBuilding && (
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
              System Optimizing
            </Badge>
          )}
        </CardTitle>
        <div className="text-sm text-gray-600">
          {currentTime.toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          {stats?.currentSession ? (
            <div className="space-y-2">
              <Badge variant="default" className="border-green-300 bg-green-100 text-green-800">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Active Session
              </Badge>
              <div className="text-2xl font-mono font-bold text-gray-900">
                {formatElapsedTime(elapsedTime)}
              </div>
              <div className="text-sm text-gray-600">
                Started at {formatTime(stats.currentSession.startTime)}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Badge variant="secondary">Not Tracking</Badge>
              <div className="text-2xl font-mono font-bold text-gray-400">00:00:00</div>
              <div className="text-sm text-gray-600">Ready to start tracking</div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          {stats?.currentSession ? (
            <>
              <Button
                onClick={handleStop}
                disabled={loading}
                variant="danger"
                size="lg"
                className="px-8"
              >
                <Square className="mr-2 h-4 w-4" />
                {loading ? 'Stopping...' : 'Stop Time'}
              </Button>
              <Button
                onClick={handleStart}
                disabled={loading}
                variant="warning"
                size="lg"
                className="px-8"
              >
                <Play className="mr-2 h-4 w-4" />
                {loading ? 'Restarting...' : 'Restart Session'}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleStart}
              disabled={loading}
              size="lg"
              className="bg-green-600 px-8 text-white hover:bg-green-700"
            >
              <Play className="mr-2 h-4 w-4" />
              {loading ? 'Starting...' : 'Start Time'}
            </Button>
          )}
        </div>

        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="mb-2 flex items-center justify-center">
                <Clock className="mr-2 h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Today</span>
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {stats?.todayHours?.toFixed(2) ?? '0.00'}
              </div>
              <div className="text-xs text-blue-600">hours</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="mb-2 flex items-center justify-center">
                <TrendingUp className="mr-2 h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">This Week</span>
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {stats?.weekHours?.toFixed(2) ?? '0.00'}
              </div>
              <div className="text-xs text-purple-600">hours</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <div className="mb-2 flex items-center justify-center">
              <Calendar className="mr-2 h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-600">This Month</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.monthHours?.toFixed(2) ?? '0.00'}
            </div>
            <div className="text-sm text-gray-600">
              Average: {stats?.averageDailyHours?.toFixed(2) ?? '0.00'} hours/day
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
