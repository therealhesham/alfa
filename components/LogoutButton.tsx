"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Locale } from "@/i18n";

export default function LogoutButton() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      // Redirect to login page
      router.push(`/${locale}/login`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-800 text-white px-4 py-2 rounded-md"
      style={{
        padding: "0.5rem 1rem",
        // backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "0.9rem",
        fontWeight: "600",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = "#b91c1c";
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.backgroundColor = "#dc2626";
        }
      }}
    >
      {loading 
        ? (locale === "ar" ? "جاري الخروج..." : "Logging out...")
        : (locale === "ar" ? "تسجيل الخروج" : "Logout")
      }
    </button>
  );
}

