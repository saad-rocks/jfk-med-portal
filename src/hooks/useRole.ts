import { useEffect, useState, useCallback, useMemo } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase";
import { getUserByUid } from "../lib/users";
import type { Role, MDYear } from "../types";

export interface UserProfile {
  user: User | null;
  role: Role | undefined;
  mdYear: MDYear | undefined;
  loading: boolean;
  refreshProfile: () => void;
}

export function useRole(): UserProfile {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | undefined>(undefined);
  const [mdYear, setMdYear] = useState<MDYear | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoize the user profile loading logic
  const loadUserProfile = useCallback(async (user: User) => {
    try {
      const userProfile = await getUserByUid(user.uid);

      if (userProfile) {
        setRole(userProfile.role);
        setMdYear(userProfile.role === 'student' ? userProfile.mdYear : undefined);
      } else {
        setRole(undefined);
        setMdYear(undefined);
      }
    } catch (error) {
      setRole(undefined);
      setMdYear(undefined);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        await loadUserProfile(u);
      } else {
        setRole(undefined);
        setMdYear(undefined);
      }

      setLoading(false);
    });

    return () => unsub();
  }, [loadUserProfile]);

  // Memoized refresh function to prevent unnecessary re-renders
  const refreshProfile = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    user,
    role,
    mdYear,
    loading,
    refreshProfile
  }), [user, role, mdYear, loading, refreshProfile]);
}
