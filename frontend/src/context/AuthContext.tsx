import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "../types";
import api from "../services/api/axios";
import { enableAutoAuth } from "./authHelpers";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(enableAutoAuth);

  // On mount, attempt to fetch current user from backend using cookie-based auth.
  useEffect(() => {
    let mounted = true;
    async function fetchMe() {
      try {
        const res = await api.get("/auth/me");
        const me = (res.data && (res.data.user ?? res.data)) as User;
        if (mounted) setUser(me ?? null);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsAuthLoading(false);
      }
    }

    if (enableAutoAuth) {
      fetchMe();
    }
    return () => {
      mounted = false;
    };
  }, [enableAutoAuth]);

  const login = (newUser: User) => {
    setUser(newUser);
    setIsAuthLoading(false);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore errors — still clear client state
    }
    setUser(null);
    setIsAuthLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
