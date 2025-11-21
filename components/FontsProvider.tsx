"use client";

import { useEffect } from "react";
import type { SiteSettings } from "@/lib/data";

interface FontsProviderProps {
  settings: SiteSettings | null;
  children: React.ReactNode;
}

export default function FontsProvider({ settings, children }: FontsProviderProps) {
  useEffect(() => {
    if (!settings) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary-font', settings.primaryFont);
    root.style.setProperty('--heading-font', settings.headingFont);
    root.style.setProperty('--body-font', settings.bodyFont);
    
    document.body.style.fontFamily = settings.bodyFont;
  }, [settings]);

  return <>{children}</>;
}

