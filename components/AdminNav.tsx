"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n";

type AdminRoute = {
  slug: string;
  labels: Record<Locale, string>;
};

const adminRoutes: AdminRoute[] = [
  {
    slug: "home",
    labels: {
      ar: "الرئيسية",
      en: "Home",
    },
  },
  {
    slug: "about-us",
    labels: {
      ar: "من نحن",
      en: "About Us",
    },
  },
  {
    slug: "contact-us",
    labels: {
      ar: "تواصلوا معنا",
      en: "Contact Us",
    },
  },
  {
    slug: "settings",
    labels: {
      ar: "الإعدادات",
      en: "Settings",
    },
  },
];

export default function AdminNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 10000,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderRadius: "999px",
        padding: "0.4rem",
        boxShadow: "0 10px 25px rgba(15, 28, 42, 0.15)",
        border: "1px solid rgba(15, 28, 42, 0.08)",
        maxWidth: "calc(100% - 2rem)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          padding: "0 0.5rem",
        }}
      >
        {adminRoutes.map((route) => {
          const href = `/${locale}/admin/${route.slug}`;
          const isActive = pathname?.startsWith(href);

          return (
            <Link
              key={route.slug}
              href={href}
              aria-current={isActive ? "page" : undefined}
              style={{
                padding: "0.35rem 1rem",
                borderRadius: "999px",
                fontWeight: 600,
                fontSize: "0.95rem",
                border: "1px solid rgba(15, 28, 42, 0.2)",
                color: isActive ? "#ffffff" : "#0F1C2A",
                backgroundColor: isActive ? "#0F1C2A" : "transparent",
                boxShadow: isActive ? "0 10px 20px rgba(15, 28, 42, 0.2)" : "none",
                transition: "all 0.2s ease-in-out",
                whiteSpace: "nowrap",
              }}
            >
              {route.labels[locale] ?? route.labels.en}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


