import { useMemo } from "react";
import { Bell, Calendar, Pin, Users, Tag, AlertTriangle } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useRole } from "../hooks/useRole";
import { useAnnouncements } from "../hooks/useAnnouncements";
import type { Announcement, AnnouncementAudience } from "../types";

const priorityLabels: Record<Announcement["priority"], string> = {
  high: "Urgent",
  medium: "Important",
  low: "Info",
};

const priorityBadgeClasses: Record<Announcement["priority"], string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const audienceLabels: Record<AnnouncementAudience, string> = {
  all: "Everyone",
  students: "Students",
  teachers: "Faculty",
  admins: "Admins",
};

const gradientByPriority: Record<Announcement["priority"], string> = {
  high: "from-red-50 to-red-100/80 border-red-200/60",
  medium: "from-blue-50 to-blue-100/80 border-blue-200/60",
  low: "from-emerald-50 to-emerald-100/80 border-emerald-200/60",
};

function formatRelative(dateValue?: number): string {
  if (!dateValue) return "—";
  const now = Date.now();
  const diff = dateValue - now;
  const abs = Math.abs(diff);
  const minutes = Math.round(abs / (1000 * 60));
  const hours = Math.round(abs / (1000 * 60 * 60));
  const days = Math.round(abs / (1000 * 60 * 60 * 24));

  let result: string;
  if (minutes < 60) {
    result = `${minutes} min`;
  } else if (hours < 24) {
    result = `${hours} hr`;
  } else {
    result = `${days} day${days === 1 ? "" : "s"}`;
  }

  if (diff < 0) {
    return `${result} ago`;
  }
  return `in ${result}`;
}

function formatDateTime(value?: number): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

function roleToAudience(role: string | undefined): AnnouncementAudience | undefined {
  switch (role) {
    case "student":
      return "students";
    case "teacher":
      return "teachers";
    case "admin":
      return "admins";
    default:
      return undefined;
  }
}

export default function StudentNoticeBoard() {
  const { role } = useRole();
  const audience = roleToAudience(role);

  const { announcements, loading, error } = useAnnouncements({
    audience,
    includeExpired: false,
    realtime: true,
    limit: 100,
  });

  const stats = useMemo(() => {
    const total = announcements.length;
    const pinned = announcements.filter((item) => item.pinned).length;
    const highPriority = announcements.filter((item) => item.priority === "high").length;
    return { total, pinned, highPriority };
  }, [announcements]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notice Board"
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Notice Board" }]}
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500 p-3">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                <p className="text-sm text-blue-700">Active Announcements</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-amber-500 p-3">
                <Pin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-900">{stats.pinned}</p>
                <p className="text-sm text-amber-700">Pinned Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-500 p-3">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-900">{stats.highPriority}</p>
                <p className="text-sm text-red-700">Urgent Notices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-8 text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-3" />
              <p className="text-sm text-red-700">{error}</p>
            </CardContent>
          </Card>
        ) : null}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card
                key={`skeleton-${index}`}
                className="animate-pulse border-slate-200 bg-slate-50"
              >
                <CardContent className="space-y-3 py-6">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-20 rounded-full bg-slate-200" />
                    <div className="h-6 w-24 rounded-full bg-slate-200" />
                  </div>
                  <div className="h-6 w-3/4 rounded bg-slate-200" />
                  <div className="h-20 w-full rounded bg-slate-200" />
                  <div className="h-4 w-1/2 rounded bg-slate-200" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-slate-50/60">
            <CardContent className="py-16 text-center">
              <Bell className="mx-auto h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No Announcements Yet
              </h3>
              <p className="text-sm text-slate-500">
                Check back later for important updates and notices.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => {
              const gradient = gradientByPriority[announcement.priority];
              return (
                <Card
                  key={announcement.id}
                  className={`overflow-hidden border shadow-soft transition-all hover:shadow-lg bg-gradient-to-r ${gradient}`}
                >
                  <CardContent className="space-y-4 p-6">
                    {/* Header with badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={`${priorityBadgeClasses[announcement.priority]} font-semibold`}
                      >
                        {priorityLabels[announcement.priority]}
                      </Badge>

                      {announcement.pinned ? (
                        <Badge
                          variant="outline"
                          className="border-amber-300 bg-amber-50 text-amber-700"
                        >
                          <Pin className="mr-1 h-3 w-3" />
                          Pinned
                        </Badge>
                      ) : null}

                      {(announcement.targetAudience ?? ["all"]).map((audience) => (
                        <Badge key={audience} variant="secondary">
                          <Users className="mr-1 h-3 w-3" />
                          {audienceLabels[audience]}
                        </Badge>
                      ))}

                      {announcement.courseId ? (
                        <Badge variant="outline">
                          <Tag className="mr-1 h-3 w-3" />
                          Course-specific
                        </Badge>
                      ) : null}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {announcement.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                        <span>Posted {formatRelative(announcement.publishedAt)}</span>
                        {announcement.authorName ? (
                          <span>by {announcement.authorName}</span>
                        ) : null}
                        {announcement.expiresAt ? (
                          <span className="inline-flex items-center gap-1 text-amber-700">
                            <Calendar className="h-3 w-3" />
                            Expires {formatRelative(announcement.expiresAt)}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="rounded-lg bg-white/60 p-4 border border-white/80">
                      <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">
                        {announcement.content}
                      </p>
                    </div>

                    {/* Tags */}
                    {announcement.tags && announcement.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {announcement.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}

                    {/* Footer */}
                    <div className="border-t border-white/50 pt-3 text-xs text-slate-600">
                      <div className="flex flex-wrap items-center gap-3">
                        <span>Published {formatDateTime(announcement.publishedAt)}</span>
                        {announcement.updatedAt &&
                        announcement.updatedAt !== announcement.publishedAt ? (
                          <span>• Edited {formatRelative(announcement.updatedAt)}</span>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Help Card at Bottom */}
      {announcements.length > 0 ? (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 mb-2">
                  Stay Informed
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Check this notice board regularly for important updates about courses,
                  schedules, deadlines, and other essential information. Pinned and urgent
                  announcements require immediate attention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
