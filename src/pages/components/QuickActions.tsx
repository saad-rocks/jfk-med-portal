import React, { memo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Plus,
  BookOpen,
  FileText,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Upload,
  Download,
  MessageSquare
} from "lucide-react";

interface QuickActionsProps {
  role: string;
  onNavigate: (path: string) => void;
}

export const QuickActions = memo(({ role, onNavigate }: QuickActionsProps) => {
  // Role-aware styling helpers for cohesive portal theme
  const roleGradientText =
    role === 'admin'
      ? 'from-emerald-600 to-teal-600'
      : role === 'teacher'
        ? 'from-indigo-600 to-violet-600'
        : 'from-blue-600 to-teal-600';

  const roleGradientBg = `bg-gradient-to-r ${roleGradientText}`;

  const roleTileHover =
    role === 'admin'
      ? 'hover:shadow-emerald-500/10 hover:border-emerald-200 focus-visible:ring-emerald-500/40'
      : role === 'teacher'
        ? 'hover:shadow-indigo-500/10 hover:border-indigo-200 focus-visible:ring-indigo-500/40'
        : 'hover:shadow-sky-500/10 hover:border-sky-200 focus-visible:ring-sky-500/40';
  const getActions = () => {
    switch (role) {
      case 'admin':
        return [
          {
            title: 'Manage Users',
            description: 'Add, edit, and manage user accounts',
            icon: Users,
            path: '/manage-users',
            accent: 'text-sky-600',
            accentBg: 'bg-sky-100'
          },
          {
            title: 'System Settings',
            description: 'Configure system preferences',
            icon: Settings,
            path: '/settings',
            accent: 'text-slate-600',
            accentBg: 'bg-slate-100'
          },
          {
            title: 'Database Admin',
            description: 'Oversee data and backups',
            icon: BarChart3,
            path: '/database-admin',
            accent: 'text-teal-600',
            accentBg: 'bg-teal-100'
          },
          {
            title: 'Announcements',
            description: 'Create and manage announcements',
            icon: MessageSquare,
            path: '/announcements',
            accent: 'text-emerald-600',
            accentBg: 'bg-emerald-100'
          }
        ];

      case 'teacher':
        return [
          {
            title: 'Create Assignment',
            description: 'Add new assignments for students',
            icon: Plus,
            path: '/assignments/new',
            accent: 'text-sky-600',
            accentBg: 'bg-sky-100'
          },
          {
            title: 'Grade Submissions',
            description: 'Review and grade student work',
            icon: FileText,
            path: '/assignments/grade',
            accent: 'text-emerald-600',
            accentBg: 'bg-emerald-100'
          },
          {
            title: 'Manage Courses',
            description: 'View and manage your courses',
            icon: BookOpen,
            path: '/courses',
            accent: 'text-teal-600',
            accentBg: 'bg-teal-100'
          },
          {
            title: 'Attendance',
            description: 'Take attendance for sessions',
            icon: Calendar,
            path: '/attendance',
            accent: 'text-amber-600',
            accentBg: 'bg-amber-100'
          }
        ];

      case 'student':
      default:
        return [
          {
            title: 'View Courses',
            description: 'Browse available courses',
            icon: BookOpen,
            path: '/courses',
            accent: 'text-sky-600',
            accentBg: 'bg-sky-100'
          },
          {
            title: 'My Assignments',
            description: 'View and submit assignments',
            icon: FileText,
            path: '/assignments',
            accent: 'text-emerald-600',
            accentBg: 'bg-emerald-100'
          },
          {
            title: 'Grade Book',
            description: 'Check your grades and progress',
            icon: BarChart3,
            path: '/gradebook',
            accent: 'text-teal-600',
            accentBg: 'bg-teal-100'
          },
          {
            title: 'Schedule',
            description: 'View your class schedule',
            icon: Calendar,
            path: '/schedule',
            accent: 'text-amber-600',
            accentBg: 'bg-amber-100'
          }
        ];
    }
  };

  const actions = getActions();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>
          <span className={`bg-gradient-to-r ${roleGradientText} bg-clip-text text-transparent`}>
            Quick Actions
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={() => onNavigate(action.path)}
              className={`group h-full w-full rounded-2xl ${roleGradientBg} text-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2`}
            >
              <div className="flex w-full items-start gap-4">
                <span className={`flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white/15 border border-white/20`}>
                  <action.icon className={`h-6 w-6 text-white`} aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold text-white leading-tight">{action.title}</p>
                  <p className="mt-2 text-sm text-white/90 leading-relaxed">{action.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Additional Actions for All Roles */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/settings')}
              className={`flex h-20 flex-col items-center justify-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 ${roleTileHover}`}
            >
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Settings</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/announcements')}
              className={`flex h-20 flex-col items-center justify-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 ${roleTileHover}`}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs font-medium">Announcements</span>
            </Button>

            {role === 'student' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('/enrollments')}
                  className="flex h-20 flex-col items-center justify-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-xs font-medium">Enrollments</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Download transcript logic */}}
                  className="flex h-20 flex-col items-center justify-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  <Download className="h-5 w-5" />
                  <span className="text-xs font-medium">Transcript</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

QuickActions.displayName = 'QuickActions';
