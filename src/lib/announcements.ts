import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit as limitTo,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import type { Announcement, AnnouncementAudience } from "../types";

const announcementsCollection = collection(db, "announcements");
const DEFAULT_LIMIT = 50;

export interface AnnouncementInput {
  title: string;
  content: string;
  priority: Announcement["priority"];
  targetAudience: AnnouncementAudience[];
  courseId?: string | null;
  expiresAt?: Date | null;
  pinned?: boolean;
  tags?: string[];
}

export interface AnnouncementQueryOptions {
  audience?: AnnouncementAudience;
  includeExpired?: boolean;
  includeFuture?: boolean;
  limit?: number;
  priority?: Announcement["priority"] | "any";
  courseId?: string;
  includeUnpublished?: boolean;
}

export interface AnnouncementListenerOptions extends AnnouncementQueryOptions {
  onError?: (error: Error) => void;
}

const normalizeAudience = (audience?: AnnouncementAudience[] | null): AnnouncementAudience[] => {
  if (!audience || audience.length === 0) {
    return ["all"];
  }
  const unique = Array.from(new Set(audience));
  return unique.includes("all") ? ["all"] : unique;
};

const audienceMatches = (
  audiences: AnnouncementAudience[],
  target: AnnouncementAudience | undefined,
): boolean => {
  if (!target) return true;
  if (audiences.includes("all")) return true;
  return audiences.includes(target);
};

const toMillis = (value: any | null | undefined): number | undefined => {
  if (!value) return undefined;
  if (typeof value === "number") return value;
  if (typeof value === "object") {
    if (value instanceof Date) return value.getTime();
    if (typeof value.toMillis === "function") return value.toMillis();
  }
  return undefined;
};

const mapDocToAnnouncement = (docSnapshot: any): Announcement => {
  const data = docSnapshot.data() ?? {};

  const publishedAt = toMillis(data.publishedAt) ?? Date.now();
  const expiresAt = toMillis(data.expiresAt);
  const createdAt = toMillis(data.createdAt);
  const updatedAt = toMillis(data.updatedAt);

  return {
    id: docSnapshot.id,
    title: data.title ?? "Untitled",
    content: data.content ?? "",
    authorId: data.authorId ?? "",
    authorUid: data.authorUid ?? data.authorId ?? "",
    authorName: data.authorName,
    courseId: data.courseId ?? undefined,
    priority: data.priority ?? "medium",
    targetAudience: normalizeAudience(data.targetAudience),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    pinned: Boolean(data.pinned),
    publishedAt,
    expiresAt,
    createdAt,
    updatedAt,
  };
};

const applyFilters = (
  items: Announcement[],
  options: AnnouncementQueryOptions,
  now: number,
): Announcement[] => {
  const {
    includeExpired = false,
    includeFuture = false,
    audience,
    priority,
    courseId,
  } = options;

  return items.filter((item) => {
    if (!includeExpired && item.expiresAt && item.expiresAt < now) {
      return false;
    }
    if (!includeFuture && item.publishedAt > now) {
      return false;
    }
    if (audience && !audienceMatches(item.targetAudience ?? ["all"], audience)) {
      return false;
    }
    if (priority && priority !== "any" && item.priority !== priority) {
      return false;
    }
    if (courseId && item.courseId !== courseId) {
      return false;
    }
    return true;
  });
};

const sortAnnouncements = (items: Announcement[]): Announcement[] => {
  return [...items].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.publishedAt ?? 0) - (a.publishedAt ?? 0);
  });
};

export async function createAnnouncement(
  input: AnnouncementInput,
  meta?: { authorProfileId?: string; authorName?: string },
): Promise<string> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be signed in to create an announcement.");
  }

  const docRef = await addDoc(announcementsCollection, {
    title: input.title.trim(),
    content: input.content.trim(),
    priority: input.priority,
    targetAudience: normalizeAudience(input.targetAudience),
    courseId: input.courseId || null,
    tags: input.tags ?? [],
    pinned: Boolean(input.pinned),
    authorId: meta?.authorProfileId ?? user.uid,
    authorUid: user.uid,
    authorName: meta?.authorName ?? user.displayName ?? "Unknown",
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: input.expiresAt ? Timestamp.fromDate(input.expiresAt) : null,
  });

  return docRef.id;
}

export async function updateAnnouncement(
  announcementId: string,
  input: Partial<AnnouncementInput>,
): Promise<void> {
  const docRef = doc(db, "announcements", announcementId);

  const payload: Record<string, any> = {
    updatedAt: serverTimestamp(),
  };

  if (input.title !== undefined) payload.title = input.title.trim();
  if (input.content !== undefined) payload.content = input.content.trim();
  if (input.priority !== undefined) payload.priority = input.priority;
  if (input.targetAudience !== undefined) payload.targetAudience = normalizeAudience(input.targetAudience);
  if (input.courseId !== undefined) payload.courseId = input.courseId || null;
  if (input.tags !== undefined) payload.tags = input.tags;
  if (input.pinned !== undefined) payload.pinned = Boolean(input.pinned);
  if (input.expiresAt !== undefined) {
    payload.expiresAt = input.expiresAt ? Timestamp.fromDate(input.expiresAt) : null;
  }

  await updateDoc(docRef, payload);
}

export async function deleteAnnouncement(announcementId: string): Promise<void> {
  const docRef = doc(db, "announcements", announcementId);
  await deleteDoc(docRef);
}

export async function fetchAnnouncements(options: AnnouncementQueryOptions = {}): Promise<Announcement[]> {
  const { limit = DEFAULT_LIMIT } = options;
  const fetchLimit = Math.min(limit * 3, DEFAULT_LIMIT);
  const q = query(announcementsCollection, orderBy("publishedAt", "desc"), limitTo(fetchLimit));

  const snapshot = await getDocs(q);
  const now = Date.now();
  const mapped = snapshot.docs.map(mapDocToAnnouncement);
  const filtered = applyFilters(mapped, options, now);

  return sortAnnouncements(filtered).slice(0, limit);
}

export function listenToAnnouncements(
  options: AnnouncementListenerOptions,
  onChange: (announcements: Announcement[]) => void,
): () => void {
  const { limit = DEFAULT_LIMIT, onError } = options;
  const fetchLimit = Math.min(limit * 3, DEFAULT_LIMIT);
  const q = query(announcementsCollection, orderBy("publishedAt", "desc"), limitTo(fetchLimit));
  const now = Date.now();

  return onSnapshot(
    q,
    (snapshot) => {
      const mapped = snapshot.docs.map(mapDocToAnnouncement);
      const filtered = applyFilters(mapped, options, now);
      const sorted = sortAnnouncements(filtered).slice(0, limit);
      onChange(sorted);
    },
    (error) => {
      if (onError) {
        onError(error);
      } else {
      }
    },
  );
}
