import { useEffect, useState } from "react";
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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          // Use Firestore as single source of truth for roles
          const userProfile = await getUserByUid(u.uid);

          if (userProfile) {
            // Use data from Firestore user profile
            setRole(userProfile.role);
            if (userProfile.role === 'student' && userProfile.mdYear) {
              setMdYear(userProfile.mdYear);
            } else {
              setMdYear(undefined);
            }
            console.log("👤 User profile loaded:", userProfile.role, "for user:", u.email);
          } else {
            // No profile found - user needs to be created or is incomplete
            console.warn("⚠️ No user profile found for authenticated user:", u.email);
            setRole(undefined);
            setMdYear(undefined);
          }
        } catch (error) {
          console.error("❌ Error loading user profile:", error);
          setRole(undefined);
          setMdYear(undefined);
        }
      } else {
        setRole(undefined);
        setMdYear(undefined);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [refreshTrigger]);

  // Function to force refresh the user profile
  const refreshProfile = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return { user, role, mdYear, loading, refreshProfile };
}
