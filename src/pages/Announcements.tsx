import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Calendar,
  Filter,
  Loader2,
  Pin,
  PinOff,
  Plus,
  Tag,
  Trash2,
  Users,
} from "lucide-react";

import { PageHeader } from "../components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

import { useRole } from "../hooks/useRole";
import { useAnnouncements } from "../hooks/useAnnouncements";
import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
  type AnnouncementInput,
} from "../lib/announcements";
import { listCourses } from "../lib/courses";
import { getUserByUid, type UserProfile } from "../lib/users";

import type { Announcement, AnnouncementAudience, Course } from "../types";

type PriorityFilter = Announcement["priority"] | "any";

const priorityLabels: Record<Announcement["priority"], string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
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

const audienceOrder: AnnouncementAudience[] = ["all", "students", "teachers", "admins"];

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

function formatRelative(dateValue?: number, withPrefix = true): string {
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

  if (!withPrefix) return result;

  if (diff < 0) {
    return `${result} ago`;
  }
  return `in ${result}`;
}

function formatDateTime(value?: number): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

interface AnnouncementComposerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AnnouncementInput & { id?: string; expiresAt?: Date | null }) => Promise<void>;
  isSubmitting: boolean;
  defaultValue?: Announcement | null;
  availableAudiences: AnnouncementAudience[];
  courses: Course[];
}

function AnnouncementComposer({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  defaultValue,
  availableAudiences,
  courses,
}: AnnouncementComposerProps) {
  const [title, setTitle] = useState(defaultValue?.title ?? "");
  const [content, setContent] = useState(defaultValue?.content ?? "");
  const [priority, setPriority] = useState<Announcement["priority"]>(defaultValue?.priority ?? "medium");
  const [targetAudience, setTargetAudience] = useState<AnnouncementAudience[]>(
    defaultValue?.targetAudience ?? ["all"],
  );
  const [courseId, setCourseId] = useState<string>(defaultValue?.courseId ?? "all");
  const [pinned, setPinned] = useState<boolean>(Boolean(defaultValue?.pinned));
  const [expiresAt, setExpiresAt] = useState<string>(
    defaultValue?.expiresAt ? new Date(defaultValue.expiresAt).toISOString().slice(0, 16) : "",
  );
  const [tags, setTags] = useState<string>((defaultValue?.tags ?? []).join(", "));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open && defaultValue) {
      setTitle(defaultValue.title);
      setContent(defaultValue.content);
      setPriority(defaultValue.priority ?? "medium");
      setTargetAudience(defaultValue.targetAudience ?? ["all"]);
      setCourseId(defaultValue.courseId ?? "all");
      setPinned(Boolean(defaultValue.pinned));
      setExpiresAt(defaultValue.expiresAt ? new Date(defaultValue.expiresAt).toISOString().slice(0, 16) : "");
      setTags((defaultValue.tags ?? []).join(", "));
      setError(null);
    }
  }, [defaultValue, open]);

  useEffect(() => {
    if (open && !defaultValue) {
      setTitle("");
      setContent("");
      setPriority("medium");
      setTargetAudience(["all"]);
      setCourseId("all");
      setPinned(false);
      setExpiresAt("");
      setTags("");
      setError(null);
    }
  }, [open, defaultValue]);

  const toggleAudience = (value: AnnouncementAudience) => {
    setTargetAudience((current) => {
      if (value === "all") {
        return ["all"];
      }
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current.filter((item) => item !== "all"), value];
      return next.length === 0 ? ["all"] : next;
    });
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    const normalizedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload: AnnouncementInput & { id?: string; expiresAt?: Date | null } = {
      title: title.trim(),
      content: content.trim(),
      priority,
      targetAudience,
      courseId: courseId === "all" ? undefined : courseId,
      pinned,
      tags: normalizedTags,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    };

    if (defaultValue?.id) {
      payload.id = defaultValue.id;
    }

    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => (!value ? onClose() : undefined)}>
      <DialogContent className="max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>{defaultValue ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
          ) : null}

          <div className="grid gap-3">
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Title</label>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter announcement title"
              maxLength={120}
              required
            />
          </div>

          <div className="grid gap-3">
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Content</label>
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Write the announcement details..."
              rows={6}
            />
            <p className="text-xs text-slate-500">
              Tip: Keep the first sentence concise for the login notice board.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Priority</label>
              <Select value={priority} onValueChange={(value: Announcement["priority"]) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Applies to course</label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger>
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} — {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Audience</label>
            <div className="flex flex-wrap gap-2">
              {availableAudiences.map((audience) => {
                const checked = targetAudience.includes(audience);
                return (
                  <button
                    key={audience}
                    type="button"
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      checked
                        ? "border-blue-500 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-500 hover:border-blue-200"
                    }`}
                    onClick={() => toggleAudience(audience)}
                  >
                    {audienceLabels[audience]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Expires on</label>
              <Input
                type="datetime-local"
                value={expiresAt}
                min={new Date().toISOString().slice(0, 16)}
                onChange={(event) => setExpiresAt(event.target.value)}
              />
              <p className="text-xs text-slate-500">Leave blank to keep the announcement active indefinitely.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-600 uppercase tracking-wide flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                  checked={pinned}
                  onChange={(event) => setPinned(event.target.checked)}
                />
                Pin to top
              </label>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600 uppercase tracking-wide">Tags</label>
                <Input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="Comma separated tags (e.g. clinical, deadline)"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-slate-500">
            {defaultValue?.publishedAt
              ? `Last updated ${formatRelative(defaultValue.updatedAt ?? defaultValue.publishedAt)}`
              : "Announced items are visible instantly after publishing."}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {defaultValue ? "Save changes" : "Publish announcement"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Announcements() {
  const { user, role } = useRole();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("any");
  const [showExpired, setShowExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;
    const loadProfile = async () => {
      if (!user?.uid) return;
      const result = await getUserByUid(user.uid);
      if (!ignore) {
        setProfile(result);
      }
    };
    loadProfile();
    return () => {
      ignore = true;
    };
  }, [user?.uid]);

  useEffect(() => {
    let ignore = false;
    const loadCourses = async () => {
      if (!role || role === "student") return;
      try {
        const data = await listCourses();
        if (!ignore) {
          setCourses(data);
        }
      } catch (err) {
      }
    };
    loadCourses();
    return () => {
      ignore = true;
    };
  }, [role]);

  const audience = roleToAudience(role);

  const {
    announcements,
    loading,
    error,
    refresh,
  } = useAnnouncements({
    audience,
    includeExpired: showExpired,
    realtime: true,
    limit: 60,
  });

  const canManage = role === "admin" || role === "teacher";

  const filteredAnnouncements = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return announcements.filter((item) => {
      if (!showExpired && item.expiresAt && item.expiresAt < Date.now()) {
        return false;
      }
      if (priorityFilter !== "any" && item.priority !== priorityFilter) {
        return false;
      }
      if (!term) return true;

      const haystack = [
        item.title,
        item.content,
        item.tags?.join(" "),
        item.courseId,
        item.authorName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [announcements, priorityFilter, searchTerm, showExpired]);

  const stats = useMemo(() => {
    const total = announcements.length;
    const pinned = announcements.filter((item) => item.pinned).length;
    const active = announcements.filter((item) => !item.expiresAt || item.expiresAt > Date.now()).length;
    const highPriority = announcements.filter((item) => item.priority === "high").length;
    return { total, pinned, active, highPriority };
  }, [announcements]);

  const handleCreateOrUpdate = async (input: AnnouncementInput & { id?: string; expiresAt?: Date | null }) => {
    try {
      setIsSubmitting(true);
      if (input.id) {
        const { id, ...rest } = input;
        await updateAnnouncement(id, rest);
      } else {
        await createAnnouncement(input, {
          authorProfileId: profile?.id,
          authorName: profile?.name ?? user?.displayName ?? undefined,
        });
      }
      await refresh();
      setShowComposer(false);
      setEditingAnnouncement(null);
    } catch (err) {
      // surface error via console / toast? (Toast system exists)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (announcement: Announcement) => {
    if (!window.confirm(`Delete announcement "${announcement.title}"?`)) {
      return;
    }
    try {
      await deleteAnnouncement(announcement.id!);
      await refresh();
    } catch (err) {
    }
  };

  const handleTogglePin = async (announcement: Announcement) => {
    try {
      await updateAnnouncement(announcement.id!, { pinned: !announcement.pinned });
      await refresh();
    } catch (err) {
    }
  };

  const availableAudiences: AnnouncementAudience[] = useMemo(() => {
    if (role === "admin") {
      return [...audienceOrder];
    }
    if (role === "teacher") {
      return ["all", "teachers", "students"];
    }
    return ["all"];
  }, [role]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Announcements" },
        ]}
        actions={
          canManage ? (
            <Button onClick={() => setShowComposer(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Announcement
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Filter className="h-4 w-4 text-blue-600" />
                Feed Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Search</label>
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search announcements"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Priority</label>
                <Select value={priorityFilter} onValueChange={(value: PriorityFilter) => setPriorityFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500 md:col-span-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                  checked={showExpired}
                  onChange={(event) => setShowExpired(event.target.checked)}
                />
                Include expired announcements
              </label>
            </CardContent>
          </Card>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-slate-200">
              <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading announcements…
              </div>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-8 py-12 text-center text-sm text-slate-500">
              No announcements found for your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <Card key={announcement.id} className="overflow-hidden border-slate-200 shadow-soft">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={priorityBadgeClasses[announcement.priority]}>
                        {priorityLabels[announcement.priority]} priority
                      </Badge>
                      {(announcement.targetAudience ?? ["all"]).map((audience) => (
                        <Badge key={audience} variant="secondary">
                          <Users className="mr-1 h-3 w-3" />
                          {audienceLabels[audience]}
                        </Badge>
                      ))}
                      {announcement.courseId ? (
                        <Badge variant="outline">
                          <Tag className="mr-1 h-3 w-3" />
                          Linked course
                        </Badge>
                      ) : null}
                      {announcement.pinned ? (
                        <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                          <Pin className="mr-1 h-3 w-3" />
                          Pinned
                        </Badge>
                      ) : null}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{announcement.title}</h3>
                      <div className="mt-1 text-xs text-slate-500">
                        Posted {formatRelative(announcement.publishedAt)} by{" "}
                        {announcement.authorName ?? "Unknown author"}
                        {announcement.expiresAt ? (
                          <span className="ml-2 inline-flex items-center gap-1 text-amber-600">
                            <Calendar className="h-3 w-3" />
                            Expires {formatRelative(announcement.expiresAt)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-line">{announcement.content}</p>
                    {announcement.tags && announcement.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {announcement.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <span>Published {formatDateTime(announcement.publishedAt)}</span>
                        {announcement.updatedAt && announcement.updatedAt !== announcement.publishedAt ? (
                          <span>Edited {formatRelative(announcement.updatedAt)}</span>
                        ) : null}
                      </div>
                      {canManage ? (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingAnnouncement(announcement);
                              setShowComposer(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePin(announcement)}
                          >
                            {announcement.pinned ? (
                              <>
                                <PinOff className="mr-2 h-4 w-4" /> Unpin
                              </>
                            ) : (
                              <>
                                <Pin className="mr-2 h-4 w-4" /> Pin
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleDelete(announcement)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-slate-900">Announcement Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <StatPill label="Total announcements" value={stats.total} tone="blue" />
                <StatPill label="Active announcements" value={stats.active} tone="emerald" />
                <StatPill label="High priority" value={stats.highPriority} tone="amber" />
                <StatPill label="Pinned to top" value={stats.pinned} tone="purple" />
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Tips</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  <li>Pin urgent updates so they stay at the top of every feed.</li>
                  <li>Set an expiry date for time-sensitive notices to clean up the board automatically.</li>
                  <li>Use tags such as “clinical” or “deadline” to improve searchability.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {canManage ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Publishing Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600">
                <p>
                  Announcements are visible immediately after publishing and appear in the login notice board as well as
                  on interior dashboards. Keep messaging concise and aligned with the selected audience.
                </p>
                <ul className="list-disc space-y-1 pl-4">
                  <li>Use high priority only for urgent operational updates.</li>
                  <li>Faculty announcements should target both teachers and students when relevant.</li>
                  <li>Include clear calls to action and relevant links when applicable.</li>
                </ul>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {canManage ? (
        <AnnouncementComposer
          open={showComposer}
          onClose={() => {
            setShowComposer(false);
            setEditingAnnouncement(null);
          }}
          onSubmit={handleCreateOrUpdate}
          isSubmitting={isSubmitting}
          defaultValue={editingAnnouncement}
          availableAudiences={availableAudiences}
          courses={courses}
        />
      ) : null}
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: number;
  tone: "blue" | "emerald" | "amber" | "purple";
}

function StatPill({ label, value, tone }: StatPillProps) {
  const toneClass =
    tone === "blue"
      ? "border-blue-100 bg-blue-50 text-blue-600"
      : tone === "emerald"
      ? "border-emerald-100 bg-emerald-50 text-emerald-600"
      : tone === "amber"
      ? "border-amber-100 bg-amber-50 text-amber-600"
      : "border-purple-100 bg-purple-50 text-purple-600";

  return (
    <div className={`rounded-xl border px-4 py-3 ${toneClass}`}>
      <p className="text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
