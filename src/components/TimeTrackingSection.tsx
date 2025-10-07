import React, { useState } from 'react';
import { Clock, BarChart3, Plus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TimeCard } from './TimeCard';
import { TimeTrackingSummary } from './TimeTrackingSummary';
import { ManualTimeEntry } from './ManualTimeEntry';
import { AdminTimeManagement } from './AdminTimeManagement';
import type { Role } from '../types';

interface TimeTrackingSectionProps {
  role?: Role;
  userId?: string;
  displayName?: string;
}

export function TimeTrackingSection({ role, userId, displayName }: TimeTrackingSectionProps) {
  const [activeTab, setActiveTab] = useState('timecard');
  const isTeacher = role === 'teacher';
  const isAdmin = role === 'admin';

  if (!isTeacher && !isAdmin) {
    return null;
  }

  const handleEntryAdded = () => {
    setActiveTab('summary');
    window.setTimeout(() => setActiveTab('timecard'), 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-600" />
            Time Tracking System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="timecard" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Card
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Staff Management
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="timecard" className="mt-6">
              <TimeCard userId={userId} role={role} />
            </TabsContent>

            <TabsContent value="summary" className="mt-6">
              <TimeTrackingSummary userId={userId} displayName={displayName} />
            </TabsContent>

            <TabsContent value="manual" className="mt-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Manual Time Entry</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ManualTimeEntry onEntryAdded={handleEntryAdded} />
                  </CardContent>
                </Card>
                <div className="text-sm text-gray-600">
                  <p>Use this feature when you forget to start/stop your time tracking.</p>
                  <p>All manual entries are clearly marked and can be distinguished from automatic entries.</p>
                </div>
              </div>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="admin" className="mt-6">
                <AdminTimeManagement />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
