"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getTranslations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n";
import type { SiteSettings } from "@/lib/data";
import { X } from "lucide-react";

interface HeaderProps {
  locale: Locale;
  settings: SiteSettings | null;
  headerLogo?: string;
  isHomePage?: boolean;
}

export default function Header({ locale, settings, headerLogo, isHomePage = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = getTranslations(locale);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (isHomePage) {
      e.preventDefault();
      setIsMenuOpen(false);
      
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={isMenuOpen ? "menu-active" : ""}>
      <Link href={`/${locale}/home`} onClick={closeMenu}>
        <Image
          src={headerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
          alt={t.common.logoAlt}
          width={75}
          height={75}
          className="logo"
          unoptimized
        />
      </Link>
      <div className="header-right">
        {/* Social Media Icons */}
        <div className="header-social-icons">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a
            href="https://www.x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
        <button
          className="menu-toggle"
          onClick={toggleMenu}
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
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      {/* Desktop Navigation */}
      <nav className="desktop-nav">
        {settings?.showHome !== false && (
          <Link href={`/${locale}/home`}>
            {t.nav.home}
          </Link>
        )}
        {settings?.showAbout !== false && (
          isHomePage ? (
            <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>
              {t.nav.about}
            </a>
          ) : (
            <Link href={`/${locale}/about-us`}>
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
            <Link href={`/${locale}/home#services`}>
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
            <Link href={`/${locale}/home#projects`}>
              {t.nav.projects}
            </Link>
          )
        )}
        {settings?.showContact !== false && (
          isHomePage ? (
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>
              {t.nav.contact}
            </a>
          ) : (
            <Link href={`/${locale}/contact-us`}>
              {t.nav.contact}
            </Link>
          )
        )}
        {settings?.showLanguageSwitcher !== false && (
          <LanguageSwitcher currentLocale={locale} />
        )}
      </nav>

      {/* Mobile Sidebar */}
      {isMenuOpen && (
        <div
          className="menu-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      <nav className={`mobile-sidebar ${isMenuOpen ? "nav-open" : ""}`}>
        <div className="sidebar-header">
          {settings?.showLanguageSwitcher !== false && (
            <div className="sidebar-language-switcher-top">
              <LanguageSwitcher currentLocale={locale} />
            </div>
          )}
          <button
            className="sidebar-close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
        <div className="sidebar-content">
          {settings?.showHome !== false && (
            <Link href={`/${locale}/home`} onClick={closeMenu} className="nav-link">
              <span className="nav-link-text">{t.nav.home}</span>
            </Link>
          )}
          {settings?.showAbout !== false && (
            isHomePage ? (
              <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')} className="nav-link">
                <span className="nav-link-text">{t.nav.about}</span>
              </a>
            ) : (
              <Link href={`/${locale}/about-us`} onClick={closeMenu} className="nav-link">
                <span className="nav-link-text">{t.nav.about}</span>
              </Link>
            )
          )}
          {settings?.showServices !== false && (
            isHomePage ? (
              <a href="#services" onClick={(e) => handleSmoothScroll(e, 'services')} className="nav-link">
                <span className="nav-link-text">{t.nav.services}</span>
              </a>
            ) : (
              <Link href={`/${locale}/home#services`} onClick={closeMenu} className="nav-link">
                <span className="nav-link-text">{t.nav.services}</span>
              </Link>
            )
          )}
          {settings?.showProjects !== false && (
            isHomePage ? (
              <a href="#projects" onClick={(e) => handleSmoothScroll(e, 'projects')} className="nav-link">
                <span className="nav-link-text">{t.nav.projects}</span>
              </a>
            ) : (
              <Link href={`/${locale}/home#projects`} onClick={closeMenu} className="nav-link">
                <span className="nav-link-text">{t.nav.projects}</span>
              </Link>
            )
          )}
          {settings?.showContact !== false && (
            isHomePage ? (
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')} className="nav-link">
                <span className="nav-link-text">{t.nav.contact}</span>
              </a>
            ) : (
              <Link href={`/${locale}/contact-us`} onClick={closeMenu} className="nav-link">
                <span className="nav-link-text">{t.nav.contact}</span>
              </Link>
            )
          )}
        </div>
        {/* Mobile Social Media Icons */}
        <div className="mobile-social-icons">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </a>
          <a
            href="https://www.x.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter)"
            className="social-icon"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}

