"use client";

import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/i18n";
import { useState } from "react";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: Locale) => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  return (
    <div className="language-switcher">
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch Language"
        aria-expanded={isOpen}
      >
        {currentLocale === "ar" ? "عربي" : "ENG"}
      </button>
      {isOpen && (
        <>
          <div
            className="language-backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="language-dropdown">
            <button
              onClick={() => switchLocale("ar")}
              className={currentLocale === "ar" ? "active" : ""}
            >
              عربي
            </button>
            <button
              onClick={() => switchLocale("en")}
              className={currentLocale === "en" ? "active" : ""}
            >
              ENG
            </button>
          </div>
        </>
      )}
    </div>
  );
}

