"use client";

import { useParams } from "next/navigation";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

export default function AdminExplanationPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);

  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          fontSize: "1.2rem",
        }}
      >
        {locale === "ar" ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "2rem",
        paddingTop: "6rem",
      }}
    >
      <AdminNav locale={locale} />
      <LogoutButton locale={locale} />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "2rem",
            color: "#0F1C2A",
            textAlign: locale === "ar" ? "right" : "left",
          }}
        >
          {locale === "ar" ? "شرح" : "Explanation"}
        </h1>

        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "56.25%", // 16:9 aspect ratio
            backgroundColor: "#000",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <video
            controls
            autoPlay
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          >
            <source src="/explanation.mp4" type="video/mp4" />
            {locale === "ar"
              ? "المتصفح الخاص بك لا يدعم تشغيل الفيديو."
              : "Your browser does not support the video tag."}
          </video>
        </div>
      </div>
    </div>
  );
}

