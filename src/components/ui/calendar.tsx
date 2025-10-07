import React, { useState } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon
} from 'lucide-react';

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  attendanceData?: { [dateString: string]: boolean };
  attendanceStatusData?: { [dateString: string]: 'present' | 'absent' | 'late' | 'excused' };
  showAttendanceStats?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export function Calendar({
  selectedDate,
  onDateSelect,
  attendanceData = {},
  attendanceStatusData = {},
  showAttendanceStats = false,
  minDate,
  maxDate
}: CalendarProps) {


  const getAttendanceStatus = (date: Date) => {
    const dateKey = formatDateKey(date);
    return attendanceData[dateKey];
  };

  const getAttendanceStatusColor = (date: Date) => {
    const dateKey = formatDateKey(date);
    return attendanceStatusData[dateKey];
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return formatDateKey(date) === formatDateKey(selectedDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDateKey(date) === formatDateKey(today);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Card className="w-full max-w-md shadow-lg border-0 bg-white">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="h-9 w-9 p-0 hover:bg-gray-50 border-gray-200"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </Button>

          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-lg text-gray-800">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="h-9 w-9 p-0 hover:bg-gray-50 border-gray-200"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Today Button */}
        <div className="flex justify-center mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-sm"
          >
            Today
          </Button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-3">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-500 py-3 bg-gray-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            if (!date) {
              return <div key={index} className="aspect-square" />;
            }

            const attendance = getAttendanceStatus(date);
            const attendanceStatus = getAttendanceStatusColor(date);
            const isDisabled = isDateDisabled(date);
            const isSelected = isDateSelected(date);
            const isCurrentDay = isToday(date);

            // Determine background color based on attendance status
            const getStatusBackground = () => {
              if (isSelected) {
                return 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800';
              }

              if (attendanceStatus) {
                switch (attendanceStatus) {
                  case 'present':
                    return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:scale-105 font-semibold border border-emerald-300 shadow-sm';
                  case 'absent':
                    return 'bg-red-100 text-red-800 hover:bg-red-200 hover:scale-105 font-semibold border border-red-300 shadow-sm';
                  case 'late':
                    return 'bg-amber-100 text-amber-800 hover:bg-amber-200 hover:scale-105 font-semibold border border-amber-300 shadow-sm';
                  case 'excused':
                    return 'bg-blue-100 text-blue-800 hover:bg-blue-200 hover:scale-105 font-semibold border border-blue-300 shadow-sm';
                  default:
                    return 'text-gray-700';
                }
              }

              if (attendance) {
                return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 hover:scale-105 font-semibold border border-emerald-300 shadow-sm';
              }

              return 'text-gray-700';
            };

            const statusClasses = getStatusBackground();

            return (
              <Button
                key={index}
                variant={isSelected ? "primary" : "ghost"}
                className={`
                  aspect-square p-0 h-12 w-12 relative transition-all duration-200 !rounded-lg flex items-center justify-center
                  ${isCurrentDay && !isSelected ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50' : ''}
                  ${isDisabled ? 'opacity-40 cursor-not-allowed text-gray-400' : 'hover:bg-gray-100 hover:scale-105'}
                  ${statusClasses}
                `}
                onClick={() => !isDisabled && onDateSelect(date)}
                disabled={isDisabled}
              >
                <span className="text-sm font-medium relative z-0">{date.getDate()}</span>
                {/* Professional checkmark indicator for attendance */}
                {attendance && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border border-gray-300 shadow-sm flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Legend */}
        {(showAttendanceStats || Object.keys(attendanceData).length > 0 || Object.keys(attendanceStatusData).length > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-3">Legend:</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {Object.keys(attendanceStatusData).length > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center relative shadow-sm">
                      <span className="text-emerald-800 font-semibold text-xs">15</span>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border border-gray-300 shadow-sm flex items-center justify-center">
                        <svg className="w-1.5 h-1.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-600">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-red-100 border border-red-300 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-red-800 font-semibold text-xs">15</span>
                    </div>
                    <span className="text-gray-600">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-amber-100 border border-amber-300 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-amber-800 font-semibold text-xs">15</span>
                    </div>
                    <span className="text-gray-600">Late</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-blue-800 font-semibold text-xs">15</span>
                    </div>
                    <span className="text-gray-600">Excused</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center relative shadow-sm">
                    <span className="text-emerald-800 font-semibold text-xs">15</span>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border border-gray-300 shadow-sm flex items-center justify-center">
                      <svg className="w-1.5 h-1.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-600">Attendance Marked</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Compact calendar for mobile/small screens
export function CompactCalendar({
  selectedDate,
  onDateSelect,
  attendanceData = {},
  attendanceStatusData = {},
  minDate,
  maxDate
}: Omit<CalendarProps, 'showAttendanceStats'>) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return formatDateKey(date) === formatDateKey(selectedDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDateKey(date) === formatDateKey(today);
  };

  const getAttendanceStatus = (date: Date) => {
    const dateKey = formatDateKey(date);
    return attendanceData[dateKey];
  };

  const getAttendanceStatusColor = (date: Date) => {
    const dateKey = formatDateKey(date);
    return attendanceStatusData[dateKey];
  };

  const days = getDaysInMonth(currentMonth);
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() - 1);
            return newMonth;
          })}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="font-semibold text-sm">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + 1);
            return newMonth;
          })}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="aspect-square" />;
          }

                      const attendance = getAttendanceStatus(date);
            const isDisabled = isDateDisabled(date);
            const isSelected = isDateSelected(date);
            const isCurrentDay = isToday(date);

          const attendanceStatus = getAttendanceStatusColor(date);

          // Determine background color based on attendance status for compact calendar
          const getCompactStatusBackground = () => {
            if (isSelected) {
              return 'bg-blue-600 text-white';
            }

            if (attendanceStatus) {
              switch (attendanceStatus) {
                case 'present':
                  return 'bg-green-100 text-green-800 font-bold';
                case 'absent':
                  return 'bg-red-100 text-red-800 font-bold';
                case 'late':
                  return 'bg-yellow-100 text-yellow-800 font-bold';
                case 'excused':
                  return 'bg-blue-100 text-blue-800 font-bold';
                default:
                  return '';
              }
            }

            if (attendance) {
              return 'bg-green-100 text-green-800 font-bold';
            }

            return '';
          };

          return (
            <Button
              key={index}
              variant={isSelected ? "primary" : "ghost"}
              size="sm"
              className={`
                aspect-square p-0 h-8 w-8 text-xs relative flex items-center justify-center !rounded-lg
                ${isCurrentDay && !isSelected ? 'ring-1 ring-blue-500' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                ${getCompactStatusBackground()}
              `}
              onClick={() => !isDisabled && onDateSelect(date)}
              disabled={isDisabled}
            >
              <span className="relative z-0">{date.getDate()}</span>


            </Button>
          );
        })}
      </div>
    </div>
  );
}
