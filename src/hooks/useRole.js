import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
export function useRole() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(undefined);
    const [mdYear, setMdYear] = useState(undefined);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                try {
                    await u.getIdToken(true);
                    const claims = (await u.getIdTokenResult()).claims;
                    
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
                    }
                }
                catch { }
            }
            else {
                setRole(undefined);
                setMdYear(undefined);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);
    return { user, role, mdYear, loading };
}
