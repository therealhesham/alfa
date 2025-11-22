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
  isHomePage?: boolean;
}

export default function Header({ locale, settings, headerLogo, isHomePage = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = getTranslations(locale);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setIsMenuOpen(false);
      }
    }
  };

  return (
    <header className={isMenuOpen ? "menu-active" : ""}>
      <Link href={`/${locale}/home`}>
        <Image
          src={headerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
          alt={t.common.logoAlt}
          width={75}
          height={75}
          className="logo"
          unoptimized
        />
      </Link>
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
          isHomePage ? (
            <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>
              {t.nav.about}
            </a>
          ) : (
            <Link href={`/${locale}/about-us`} onClick={() => setIsMenuOpen(false)}>
              {t.nav.about}
            </Link>
          )
        )}
        {settings?.showServices !== false && (
          isHomePage ? (
            <a href="#services" onClick={(e) => handleSmoothScroll(e, 'services')}>
              {t.nav.services}
            </a>
          ) : (
            <Link href={`/${locale}/home#services`} onClick={() => setIsMenuOpen(false)}>
              {t.nav.services}
            </Link>
          )
        )}
        {settings?.showProjects !== false && (
          isHomePage ? (
            <a href="#projects" onClick={(e) => handleSmoothScroll(e, 'projects')}>
              {t.nav.projects}
            </a>
          ) : (
            <Link href={`/${locale}/home#projects`} onClick={() => setIsMenuOpen(false)}>
              {t.nav.projects}
            </Link>
          )
        )}
        {settings?.showContact !== false && (
          <Link href={`/${locale}/contact-us`} onClick={() => setIsMenuOpen(false)}>
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

