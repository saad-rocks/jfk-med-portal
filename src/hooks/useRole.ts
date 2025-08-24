import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../firebase";

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
          const claims: any = (await u.getIdTokenResult()).claims;
          
          // Temporary admin override for demo - remove this in production
          // TODO: Replace with your actual admin email
          if (u.email === 'admin@jfkmedical.edu' || u.email === 'admin@jfk.edu' || u.email === 'admin@test.com' || u.email?.includes('admin')) {
            setRole('admin');
            console.log('👑 Admin role set for:', u.email);
          } else if (claims?.role) {
            setRole(claims.role);
          } else {
            setRole('student');
            console.log('👨‍🎓 Student role set for:', u.email);
          }
          
          // Debug: Log all user info to help identify your users
          console.log('🔍 User Info:', {
            email: u.email,
            uid: u.uid,
            displayName: u.displayName,
            role: u.email === 'admin@jfkmedical.edu' || u.email === 'admin@jfk.edu' || u.email === 'admin@test.com' || u.email?.includes('admin') ? 'admin' : 'student'
          });
          
          // Extract MD year from claims or derive from enrollment date
          if (claims?.mdYear) {
            setMdYear(claims.mdYear);
          } else {
            // Default to MD-1 for demo purposes - you can change this
            setMdYear("MD-1");
            console.log('🎓 MD Year set to:', "MD-1", 'for user:', u.email);
            
            // Optional: Use account creation date logic if you want variety
            // const currentYear = new Date().getFullYear();
            // const userCreationYear = u.metadata.creationTime 
            //   ? new Date(u.metadata.creationTime).getFullYear()
            //   : currentYear;
            // const yearsSinceEnrollment = currentYear - userCreationYear;
            // if (yearsSinceEnrollment <= 0) setMdYear("MD-1");
            // else if (yearsSinceEnrollment === 1) setMdYear("MD-2");
            // else if (yearsSinceEnrollment === 2) setMdYear("MD-3");
            // else setMdYear("MD-4");
          }
        } catch {}
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


