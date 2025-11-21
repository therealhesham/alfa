"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getTranslations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n";
import type { SiteSettings } from "@/lib/data";

interface HeaderProps {
  locale: Locale;
  settings: SiteSettings | null;
  headerLogo?: string;
}

export default function Header({ locale, settings, headerLogo }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = getTranslations(locale);

  return (
    <header className={isMenuOpen ? "menu-active" : ""}>
      <Image
        src={headerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
        alt={t.common.logoAlt}
        width={75}
        height={75}
        className="logo"
        unoptimized
      />
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={t.common.menuLabel}
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      {isMenuOpen && (
        <div
          className="menu-backdrop"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
      <nav className={isMenuOpen ? "nav-open" : ""}>
        {settings?.showHome !== false && (
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.home}
          </Link>
        )}
        {settings?.showAbout !== false && (
          <Link href={`/${locale}/about-us`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.about}
          </Link>
        )}
        {settings?.showServices !== false && (
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.services}
          </Link>
        )}
        {settings?.showProjects !== false && (
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.projects}
          </Link>
        )}
        {settings?.showContact !== false && (
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.contact}
          </Link>
        )}
        {settings?.showLanguageSwitcher !== false && (
          <LanguageSwitcher currentLocale={locale} />
        )}
      </nav>
    </header>
  );
}

