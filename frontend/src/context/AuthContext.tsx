import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "../types";
import api from "../services/api/axios";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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
      }
    }
    fetchMe();
    return () => {
      mounted = false;
    };
  }, []);

  const login = (newUser: User) => {
    setUser(newUser);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore errors — still clear client state
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
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
