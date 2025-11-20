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

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const t = getTranslations(locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/home-content");
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
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
    heroLogo: "/Capture.PNG",
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
    footerLogo: "/Capture.PNG",
    headerLogo: "/Capture.PNG",
  };

  return (
    <>
      <header className={isMenuOpen ? "menu-active" : ""}>
        <Image
          src={displayContent.headerLogo || "/Capture.PNG"}
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
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.home}
          </Link>
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.about}
          </Link>
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.services}
          </Link>
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.projects}
          </Link>
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            {t.nav.contact}
          </Link>
          <LanguageSwitcher currentLocale={locale} />
        </nav>
      </header>

      <section className="hero">
        <Image
          src={displayContent.heroLogo || "/Capture.PNG"}
          alt={t.common.logoAlt}
          width={300}
          height={300}
          className="hero-logo"
          unoptimized
        />
        <h1>{displayContent.heroTitle}</h1>
        <p>{displayContent.heroSubtitle}</p>
      </section>

      <section className="about">
        <h2>{displayContent.aboutTitle}</h2>
        <p>{displayContent.aboutP1}</p>
        <p>{displayContent.aboutP2}</p>
      </section>

      <section className="vision">
        <h2>{displayContent.visionTitle}</h2>
        <div className="cards">
          <div className="card">
            <h3>{displayContent.visionVision}</h3>
            <p>{displayContent.visionVisionText}</p>
          </div>
          <div className="card">
            <h3>{displayContent.visionMission}</h3>
            <p>{displayContent.visionMissionText}</p>
          </div>
          <div className="card">
            <h3>{displayContent.visionValues}</h3>
            <p>{displayContent.visionValuesText}</p>
          </div>
        </div>
      </section>

      <section className="stats">
        <h2>{displayContent.statsTitle}</h2>
        <div className="stats-grid">
          <div className="stat">
            <h3>{displayContent.statsProjectsNum}</h3>
            <p>{displayContent.statsProjects}</p>
          </div>
          <div className="stat">
            <h3>{displayContent.statsYearsNum}</h3>
            <p>{displayContent.statsYears}</p>
          </div>
          <div className="stat">
            <h3>{displayContent.statsCountriesNum}</h3>
            <p>{displayContent.statsCountries}</p>
          </div>
          <div className="stat">
            <h3>{displayContent.statsAwardsNum}</h3>
            <p>{displayContent.statsAwards}</p>
          </div>
        </div>
      </section>

      <footer>
        <Image
          src={displayContent.footerLogo || "/Capture.PNG"}
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

