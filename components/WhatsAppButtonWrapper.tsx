"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import WhatsAppButton from "./WhatsAppButton";
import type { SiteSettings } from "@/lib/data";

export default function WhatsAppButtonWrapper() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/site-settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  // Hide WhatsApp button on admin routes
  if (pathname?.includes("/admin")) {
    return null;
  }

  return <WhatsAppButton settings={settings} />;
}

