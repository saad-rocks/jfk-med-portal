import React, { useState, useEffect, useCallback } from 'react';
import { Edit2, Trash2, Users, Search, Filter, UserCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/useToast';
import { useRole } from '../hooks/useRole';
import { TimeTrackingSummary } from './TimeTrackingSummary';
import {
  getAllUsers,
  type UserProfile
} from '../lib/users';
import {
  getAllTimeEntriesForDateRange,
  updateTimeEntryAsAdmin,
  deleteTimeEntry,
  getTimeEntriesForUser,
  createManualTimeEntry,
  formatTime,
  formatDate,
  type TimeEntry
} from '../lib/timeTracking';

interface TimeEntryWithUser extends TimeEntry {
  userName: string;
  userEmail: string;
}

export function AdminTimeManagement() {
  const navigate = useNavigate();
  const { user, role } = useRole();
  const { push } = useToast();
  const [entries, setEntries] = useState<TimeEntryWithUser[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'summary'>('list');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [editingEntry, setEditingEntry] = useState<TimeEntryWithUser | null>(null);
  const [editForm, setEditForm] = useState({
    date: '',
    clockInTime: '',
    clockOutTime: '',
    notes: ''
  });

  // Load data
  const loadData = useCallback(async () => {
    if (role !== 'admin') return;

    setLoading(true);
    try {
      const [entriesData, usersData] = await Promise.all([
        getAllTimeEntriesForDateRange(dateRange.start, dateRange.end),
        getAllUsers()
      ]);

      // Filter users to only show staff/faculty (teachers and admins, not students)
      const staffUsers = usersData.filter(user =>
        user.role === 'teacher' || user.role === 'admin'
      );

      // Combine entries with user info
      const entriesWithUsers: TimeEntryWithUser[] = entriesData.map(entry => {
        const userInfo = usersData.find(u => u.uid === entry.userId);
        return {
          ...entry,
          userName: userInfo?.name || 'Unknown User',
          userEmail: userInfo?.email || 'unknown@example.com'
        };
      });

      // Filter by selected user if needed
      const filteredEntries = selectedUser === 'all'
        ? entriesWithUsers
        : entriesWithUsers.filter(entry => entry.userId === selectedUser);

      setEntries(filteredEntries);
      setUsers(staffUsers); // Only show staff in dropdown
    } catch (error) {
      console.error('Error loading admin time data:', error);
      push({
        title: 'Error',
        description: 'Failed to load time management data',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [role, dateRange, selectedUser, push]);

  // Handle user selection and view mode switching
  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
    setViewMode(userId === 'all' ? 'list' : 'summary');
  };

  // Get selected user info for summary view
  const selectedUserInfo = users.find(user => (user.uid || user.id) === selectedUser);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle edit entry
  const handleEditEntry = (entry: TimeEntryWithUser) => {
    setEditingEntry(entry);
    setEditForm({
      date: entry.date,
      clockInTime: new Date(entry.clockIn).toTimeString().slice(0, 5),
      clockOutTime: entry.clockOut ? new Date(entry.clockOut).toTimeString().slice(0, 5) : '',
      notes: entry.notes || ''
    });
  };

  // Save edited entry
  const saveEditedEntry = async () => {
    if (!editingEntry || !user?.uid) return;

    try {
      const clockIn = new Date(`${editForm.date}T${editForm.clockInTime}`).getTime();
      let clockOut: number | undefined;

      if (editForm.clockOutTime) {
        clockOut = new Date(`${editForm.date}T${editForm.clockOutTime}`).getTime();
        if (clockOut <= clockIn) {
          throw new Error('Clock out time must be after clock in time');
        }
      }

      const totalHours = clockOut ? (clockOut - clockIn) / (1000 * 60 * 60) : undefined;

      await updateTimeEntryAsAdmin(editingEntry.id!, {
        date: editForm.date,
        clockIn,
        clockOut,
        totalHours: totalHours ? Math.round(totalHours * 100) / 100 : undefined,
        notes: editForm.notes || undefined,
      }, user.uid);

      push({
        title: 'Entry Updated',
        description: 'Time entry has been successfully updated',
        variant: 'success'
      });

      setEditingEntry(null);
      loadData();
    } catch (error) {
      push({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update entry',
        variant: 'error'
      });
    }
  };

  // Delete entry
  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm('Are you sure you want to delete this time entry?')) return;

    try {
      await deleteTimeEntry(entryId);
      push({
        title: 'Entry Deleted',
        description: 'Time entry has been deleted',
        variant: 'success'
      });
      loadData();
    } catch (error) {
      push({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'error'
      });
    }
  };

  // Add manual entry for user
  const addManualEntryForUser = async (userId: string, userName: string) => {
    const date = prompt('Enter date (YYYY-MM-DD):', formatDate(new Date()));
    if (!date) return;

    const clockInTime = prompt('Enter clock in time (HH:MM):', '09:00');
    if (!clockInTime) return;

    const clockOutTime = prompt('Enter clock out time (HH:MM):', '17:00');
    if (!clockOutTime) return;

    try {
      await createManualTimeEntry(userId, date, clockInTime, clockOutTime);
      push({
        title: 'Entry Added',
        description: `Manual entry added for ${userName}`,
        variant: 'success'
      });
      loadData();
    } catch (error) {
      push({
        title: 'Error',
        description: 'Failed to add manual entry',
        variant: 'error'
      });
    }
  };

  if (role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">Access denied. Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          {viewMode === 'summary' && selectedUserInfo
            ? `Time Management - ${selectedUserInfo.name}`
            : 'Staff Time Management'
          }
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Staff Member</label>
            <Select value={selectedUser} onValueChange={handleUserChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.uid || user.id} value={user.uid || user.id || ''}>
                    {user.name} ({user.role === 'teacher' ? 'Faculty' : 'Admin'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button onClick={loadData} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Content Area - Show entries list or individual summary */}
        {viewMode === 'list' ? (
          /* Entries List */
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No time entries found for the selected period</p>
              </div>
            ) : (
              entries
                .sort((a, b) => b.date.localeCompare(a.date) || b.clockIn - a.clockIn)
                .map((entry) => (
                  <Card key={entry.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{entry.userName}</h3>
                            <Badge variant="outline">{entry.userEmail}</Badge>
                            {entry.isManual && <Badge variant="secondary">Manual</Badge>}
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                            {' • '}
                            {formatTime(entry.clockIn)} - {entry.clockOut ? formatTime(entry.clockOut) : 'Active'}
                            {' • '}
                            <span className="font-medium">{entry.totalHours?.toFixed(2) || '0.00'} hours</span>
                          </div>
                          {entry.notes && (
                            <div className="text-sm text-gray-500 mt-1">
                              Notes: {entry.notes}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/admin/time/${entry.id}/edit`)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addManualEntryForUser(entry.userId, entry.userName)}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteEntry(entry.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        ) : (
          /* Individual Staff Member Summary */
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUserChange('all')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Staff
              </Button>
              {selectedUserInfo && (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{selectedUserInfo.name}</h3>
                  <Badge variant="outline">
                    {selectedUserInfo.role === 'teacher' ? 'Faculty' : 'Admin'}
                  </Badge>
                </div>
              )}
            </div>

            {selectedUserInfo && (
              <TimeTrackingSummary
                userId={selectedUserInfo.uid || selectedUserInfo.id}
                displayName={selectedUserInfo.name}
              />
            )}
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Time Entry</DialogTitle>
            <DialogDescription>
              Edit the time entry details. Changes will be tracked and attributed to you.
            </DialogDescription>
          </DialogHeader>

          {editingEntry && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Clock In</label>
                  <Input
                    type="time"
                    value={editForm.clockInTime}
                    onChange={(e) => setEditForm(prev => ({ ...prev, clockInTime: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Clock Out</label>
                  <Input
                    type="time"
                    value={editForm.clockOutTime}
                    onChange={(e) => setEditForm(prev => ({ ...prev, clockOutTime: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <Input
                  value={editForm.notes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setEditingEntry(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEditedEntry}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}


