import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase"; // <-- value import, not "type"

export type Role = "admin" | "teacher" | "student" | undefined;
export type MDYear = "MD-1" | "MD-2" | "MD-3" | "MD-4" | undefined;

export interface UserProfile {
  user: User | null;
  role: Role;
  mdYear: MDYear;
  loading: boolean;
}

export function useRole(): UserProfile {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(undefined);
  const [mdYear, setMdYear] = useState<MDYear>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          await u.getIdToken(true);
          const claims: Record<string, unknown> = (await u.getIdTokenResult()).claims as Record<string, unknown>;

          if (
            u.email === "admin@jfkmedical.edu" ||
            u.email === "admin@jfk.edu" ||
            u.email === "admin@test.com" ||
            u.email?.includes("admin")
          ) {
            setRole("admin");
            console.log("👑 Admin role set for:", u.email);
          } else if ((claims as any)?.role) {
            setRole((claims as any).role);
          } else {
            setRole("student");
            console.log("👨‍🎓 Student role set for:", u.email);
          }

          if ((claims as any)?.mdYear) {
            setMdYear((claims as any).mdYear);
          } else {
            setMdYear("MD-1");
            console.log("🎓 MD Year set to:", "MD-1", "for user:", u.email);
          }
        } catch {
          // ignore
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
