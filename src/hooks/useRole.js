import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUserByUid } from "../lib/users";
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
                    // First, try to get user profile from Firestore
                    const userProfile = await getUserByUid(u.uid);
                    if (userProfile) {
                        // Use real data from Firestore
                        setRole(userProfile.role);
                        if (userProfile.role === 'student' && userProfile.mdYear) {
                            setMdYear(userProfile.mdYear);
                            console.log("🎓 Real MD Year from database:", userProfile.mdYear, "for user:", u.email);
                        }
                        else {
                            setMdYear(undefined);
                        }
                        console.log("👤 User profile loaded from database:", userProfile.role, "for user:", u.email);
                    }
                    else {
                        // Fallback to Firebase Auth claims if no Firestore profile
                        await u.getIdToken(true);
                        const claims = (await u.getIdTokenResult()).claims;
                        if (u.email === "admin@jfkmedical.edu" ||
                            u.email === "admin@jfk.edu" ||
                            u.email === "admin@test.com" ||
                            u.email?.includes("admin")) {
                            setRole("admin");
                            console.log("👑 Admin role set for:", u.email);
                        }
                        else if (claims?.role) {
                            setRole(claims.role);
                        }
                        else {
                            setRole("student");
                            console.log("👨‍🎓 Student role set for:", u.email);
                        }
                        if (claims?.mdYear) {
                            setMdYear(claims.mdYear);
                        }
                        else {
                            setMdYear("MD-1");
                            console.log("🎓 MD Year set to:", "MD-1", "for user:", u.email);
                        }
                    }
                }
                catch (error) {
                    console.error("Error loading user profile:", error);
                    // Set defaults on error
                    setRole("student");
                    setMdYear("MD-1");
                }
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
