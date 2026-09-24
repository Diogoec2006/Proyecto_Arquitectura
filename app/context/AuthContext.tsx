"use client";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContext {
    userRole: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContext>({userRole: null, loading: true});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/status")
            .then(res => res.json())
            .then(data => setUserRole(data.authenticated ? data.role : null))
            .finally(() => setLoading(false));
    }, [pathname]);

    return (
        <AuthContext.Provider value={{ userRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}