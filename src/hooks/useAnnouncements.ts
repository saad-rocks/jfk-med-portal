import { useCallback, useEffect, useMemo, useState } from "react";
import type { Announcement, AnnouncementAudience } from "../types";
import {
  fetchAnnouncements,
  listenToAnnouncements,
  type AnnouncementListenerOptions,
  type AnnouncementQueryOptions,
} from "../lib/announcements";

export interface UseAnnouncementsOptions extends AnnouncementQueryOptions {
  audience?: AnnouncementAudience;
  realtime?: boolean;
}

export interface UseAnnouncementsResult {
  announcements: Announcement[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAnnouncements(options: UseAnnouncementsOptions = {}): UseAnnouncementsResult {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const memoizedOptions = useMemo(() => options, [JSON.stringify(options)]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await fetchAnnouncements(memoizedOptions);
      setAnnouncements(items);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setError(err instanceof Error ? err.message : "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, [memoizedOptions]);

  useEffect(() => {
    if (options.realtime) {
      setLoading(true);
      const listenerOptions: AnnouncementListenerOptions = {
        ...memoizedOptions,
        onError: (err) => {
          console.error("Announcements listener error:", err);
          setError(err instanceof Error ? err.message : "Failed to load announcements");
          setLoading(false);
        },
      };

      const unsubscribe = listenToAnnouncements(listenerOptions, (items) => {
        setAnnouncements(items);
        setLoading(false);
      });

      return () => unsubscribe();
    }

    load();
    return undefined;
  }, [memoizedOptions, load, options.realtime]);

  return {
    announcements,
    loading,
    error,
    refresh: load,
  };
}
