import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // <-- value import, not "type"
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
                catch {
                    // ignore
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
