"use client";

import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  city?: string;
  roles: string[];
  student_id_verified: boolean;
  created_at: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("uprise_token");
    const storedUser = localStorage.getItem("uprise_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem("uprise_token", newToken);
    localStorage.setItem("uprise_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("uprise_token");
    localStorage.removeItem("uprise_user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }, []);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    if (user) {
      const updated = { ...user, ...updates };
      localStorage.setItem("uprise_user", JSON.stringify(updated));
      setUser(updated);
    }
  }, [user]);

  return { user, token, loading, login, logout, updateUser };
}
