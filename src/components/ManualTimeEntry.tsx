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
        description: `Entry saved for ${formData.date}`,
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

      <DialogContent className="sm:max-w-[500px] bg-white border-2 border-slate-200 shadow-xl sm:rounded-2xl">
        <DialogHeader className="space-y-3 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <div className="rounded-lg bg-blue-50 p-2">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            Add Manual Time Entry
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 leading-relaxed">
            Record a time entry for a day when you forgot to clock in/out. This will be saved as a manual entry in your timesheet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-lg">
              <span className="font-medium">Will be saved as:</span>
              <span>{(() => {
                const [year, month, day] = formData.date.split('-').map(Number);
                const localDate = new Date(year, month - 1, day);
                return localDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
              })()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clockIn" className="text-sm font-semibold text-slate-700">
                Clock In Time
              </Label>
              <Input
                id="clockIn"
                type="time"
                value={formData.clockInTime}
                onChange={(e) => handleInputChange('clockInTime', e.target.value)}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clockOut" className="text-sm font-semibold text-slate-700">
                Clock Out Time
              </Label>
              <Input
                id="clockOut"
                type="time"
                value={formData.clockOutTime}
                onChange={(e) => handleInputChange('clockOutTime', e.target.value)}
                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">
              Notes <span className="text-slate-400 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Add any additional context (e.g., worked from home, client meeting, etc.)"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              {loading ? 'Adding Entry...' : 'Add Time Entry'}
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
