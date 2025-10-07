import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useToast } from '../hooks/useToast';
import { useRole } from '../hooks/useRole';
import { createManualTimeEntry, formatDate } from '../lib/timeTracking';

export function ManualTimeEntry({ onEntryAdded }: { onEntryAdded?: () => void }) {
  const { user } = useRole();
  const { push } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: formatDate(new Date()),
    clockInTime: '09:00',
    clockOutTime: '17:00',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid) return;

    // Validate times
    const clockIn = new Date(`${formData.date}T${formData.clockInTime}`);
    const clockOut = new Date(`${formData.date}T${formData.clockOutTime}`);

    if (clockOut <= clockIn) {
      push({
        title: 'Invalid Time',
        description: 'Clock out time must be after clock in time',
        variant: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      await createManualTimeEntry(
        user.uid,
        formData.date,
        formData.clockInTime,
        formData.clockOutTime,
        formData.notes || undefined
      );

      push({
        title: 'Time Entry Added',
        description: 'Manual time entry has been recorded',
        variant: 'success'
      });

      // Reset form
      setFormData({
        date: formatDate(new Date()),
        clockInTime: '09:00',
        clockOutTime: '17:00',
        notes: '',
      });

      setIsOpen(false);
      onEntryAdded?.();
    } catch (error) {
      push({
        title: 'Error',
        description: 'Failed to add manual time entry',
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Manual Entry
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Add Manual Time Entry
          </DialogTitle>
          <DialogDescription>
            Add a time entry for a day when you forgot to clock in/out. This will be saved as a manual entry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              required
            />
            <div className="text-xs text-gray-500">
              Will be saved as: {new Date(formData.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clockIn">Clock In</Label>
              <Input
                id="clockIn"
                type="time"
                value={formData.clockInTime}
                onChange={(e) => handleInputChange('clockInTime', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clockOut">Clock Out</Label>
              <Input
                id="clockOut"
                type="time"
                value={formData.clockOutTime}
                onChange={(e) => handleInputChange('clockOutTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="e.g., Worked from home, meeting, etc."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Quick Add Manual Entry Button Component
export function QuickManualEntry({ onEntryAdded }: { onEntryAdded?: () => void }) {
  return (
    <Card>
      <CardContent className="p-4">
        <ManualTimeEntry onEntryAdded={onEntryAdded} />
      </CardContent>
    </Card>
  );
}
