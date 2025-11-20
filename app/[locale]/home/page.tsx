"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getTranslations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n";

interface HomeContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroLogo: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  visionTitle: string;
  visionVision: string;
  visionVisionText: string;
  visionMission: string;
  visionMissionText: string;
  visionValues: string;
  visionValuesText: string;
  statsTitle: string;
  statsProjects: string;
  statsYears: string;
  statsCountries: string;
  statsAwards: string;
  statsProjectsNum: string;
  statsYearsNum: string;
  statsCountriesNum: string;
  statsAwardsNum: string;
  footerCopyright: string;
  footerLogo: string;
  headerLogo: string;
}

interface SiteSettings {
  id: string;
  primaryFont: string;
  headingFont: string;
  bodyFont: string;
  showHome: boolean;
  showAbout: boolean;
  showServices: boolean;
  showProjects: boolean;
  showContact: boolean;
  showLanguageSwitcher: boolean;
}

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const t = getTranslations(locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [content, setContent] = useState<HomeContent | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    fetchSettings();
    
    // Re-fetch data when page becomes visible (e.g., after returning from admin)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchContent();
        fetchSettings();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (settings) {
      applyFonts();
    }
  }, [settings]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/home-content?locale=${locale}`);
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/site-settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const applyFonts = () => {
    if (!settings) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary-font', settings.primaryFont);
    root.style.setProperty('--heading-font', settings.headingFont);
    root.style.setProperty('--body-font', settings.bodyFont);
    
    // Apply to body
    document.body.style.fontFamily = settings.bodyFont;
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  // Fallback to translations if content is not available
  const displayContent = content || {
    heroTitle: t.hero.title,
    heroSubtitle: t.hero.subtitle,
    heroLogo: "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png",
    aboutTitle: t.about.title,
    aboutP1: t.about.p1,
    aboutP2: t.about.p2,
    visionTitle: t.vision.title,
    visionVision: t.vision.vision,
    visionVisionText: t.vision.visionText,
    visionMission: t.vision.mission,
    visionMissionText: t.vision.missionText,
    visionValues: t.vision.values,
    visionValuesText: t.vision.valuesText,
    statsTitle: t.stats.title,
    statsProjects: t.stats.projects,
    statsYears: t.stats.years,
    statsCountries: t.stats.countries,
    statsAwards: t.stats.awards,
    statsProjectsNum: "250+",
    statsYearsNum: "15+",
    statsCountriesNum: "48",
    statsAwardsNum: "22",
    footerCopyright: t.footer.copyright,
    footerLogo: "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png",
    headerLogo: "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png",
  };

  return (
    <>
      <header className={isMenuOpen ? "menu-active" : ""}>
        <Image
          src={displayContent.headerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
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

      <section className="hero" style={{ fontFamily: settings?.bodyFont }}>
        <Image
          src={displayContent.heroLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
          alt={t.common.logoAlt}
          width={300}
          height={300}
          className="hero-logo"
          unoptimized
        />
        <h1 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
          {displayContent.heroTitle}
        </h1>
        <p style={{ fontFamily: settings?.bodyFont }}>
          {displayContent.heroSubtitle}
        </p>
      </section>

      <section className="about" style={{ fontFamily: settings?.bodyFont }}>
        <h2 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
          {displayContent.aboutTitle}
        </h2>
        <p>{displayContent.aboutP1}</p>
        <p>{displayContent.aboutP2}</p>
      </section>

      <section className="vision" style={{ fontFamily: settings?.bodyFont }}>
        <h2 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
          {displayContent.visionTitle}
        </h2>
        <div className="cards">
          <div className="card">
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.visionVision}
            </h3>
            <p>{displayContent.visionVisionText}</p>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.visionMission}
            </h3>
            <p>{displayContent.visionMissionText}</p>
          </div>
          <div className="card">
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.visionValues}
            </h3>
            <p>{displayContent.visionValuesText}</p>
          </div>
        </div>
      </section>

      <section className="stats" style={{ fontFamily: settings?.bodyFont }}>
        <h2 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
          {displayContent.statsTitle}
        </h2>
        <div className="stats-grid">
          <div className="stat">
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.statsProjectsNum}
            </h3>
            <p>{displayContent.statsProjects}</p>
          </div>
          <div className="stat">
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.statsYearsNum}
            </h3>
            <p>{displayContent.statsYears}</p>
          </div>
          <div className="stat">
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.statsCountriesNum}
            </h3>
            <p>{displayContent.statsCountries}</p>
          </div>
          <div className="stat">
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.statsAwardsNum}
            </h3>
            <p>{displayContent.statsAwards}</p>
          </div>
        </div>
      </section>

      <footer>
        <Image
          src={displayContent.footerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
          alt={t.common.logoAlt}
          width={80}
          height={80}
          unoptimized
        />
        <p>{displayContent.footerCopyright}</p>
      </footer>
    </>
  );
}

