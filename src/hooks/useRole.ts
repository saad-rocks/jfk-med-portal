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
}

export function useRole(): UserProfile {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | undefined>(undefined);
  const [mdYear, setMdYear] = useState<MDYear | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          // First, try to get user profile from Firestore
          const userProfile = await getUserByUid(u.uid);
          
          if (userProfile) {
            // Use real data from Firestore
            setRole(userProfile.role);
            if (userProfile.role === 'student' && userProfile.mdYear) {
              setMdYear(userProfile.mdYear);
              console.log("🎓 Real MD Year from database:", userProfile.mdYear, "for user:", u.email);
            } else {
              setMdYear(undefined);
            }
            console.log("👤 User profile loaded from database:", userProfile.role, "for user:", u.email);
          } else {
            // Fallback to Firebase Auth claims if no Firestore profile
            await u.getIdToken(true);
            const tokenResult = await u.getIdTokenResult();
            const claims = tokenResult.claims as Record<string, unknown>;

            if (
              u.email === "admin@jfkmedical.edu" ||
              u.email === "admin@jfk.edu" ||
              u.email === "admin@test.com" ||
              u.email?.includes("admin")
            ) {
              setRole("admin");
              console.log("👑 Admin role set for:", u.email);
            } else if (claims?.role && typeof claims.role === 'string') {
              setRole(claims.role as Role);
            } else {
              setRole("student");
              console.log("👨‍🎓 Student role set for:", u.email);
            }

            if (claims?.mdYear && typeof claims.mdYear === 'string') {
              setMdYear(claims.mdYear as MDYear);
            } else {
              setMdYear("MD-1");
              console.log("🎓 MD Year set to:", "MD-1", "for user:", u.email);
            }
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          // Set defaults on error
          setRole("student");
          setMdYear("MD-1");
        }
      } else {
        setRole(undefined);
        setMdYear(undefined);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, role, mdYear, loading };
}
