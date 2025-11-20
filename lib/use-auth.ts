"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n";

interface User {
  id: string;
  username: string;
  email: string;
  name: string | null;
  role: string;
}

export function useAuth(locale: Locale = "ar") {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // Not authenticated, redirect to login
        setIsAuthenticated(false);
        setUser(null);
        router.push(`/${locale}/login`);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
      router.push(`/${locale}/login`);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, isAuthenticated, checkAuth };
}

