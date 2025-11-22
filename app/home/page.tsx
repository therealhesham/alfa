"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface HomeContent {
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
      // Use default values if fetch fails
      setContent({
        heroTitle: "ظلال المدينة",
        heroSubtitle: "نصنع الفخامة والتميّز في كل تفصيلة منذ أكثر من خمسة عشر عامًا",
        heroLogo: "/capture.png",
        aboutTitle: "من نحن",
        aboutP1: "شركة رائدة في التصميم المعماري والهندسة الفاخرة، نجمع بين الأصالة العربية واللمسات العصرية العالمية لنقدم مشاريع تحمل بصمة لا تُنسى.",
        aboutP2: "منذ تأسيسنا عام ٢٠٠٨ نفذنا أكثر من ٢٥٠ مشروعًا في ٤٨ دولة وحصدنا ٢٢ جائزة عالمية.",
        visionTitle: "رؤيتنا · رسالتنا · قيمنا",
        visionVision: "الرؤية",
        visionVisionText: "أن نكون الخيار الأول عالميًا في تقديم حلول معمارية فاخرة تحترم الهوية وتتخطى التوقعات.",
        visionMission: "الرسالة",
        visionMissionText: "تصميم مساحات تعبر عن طموح أصحابها بأعلى معايير الجودة والإبداع والاستدامة.",
        visionValues: "القيم",
        visionValuesText: "التميّز • الأصالة • الالتزام • الابتكار • الثقة",
        statsTitle: "إنجازاتنا بالأرقام",
        statsProjects: "مشروع منجز",
        statsYears: "سنوات الخبرة",
        statsCountries: "دولة حول العالم",
        statsAwards: "جائزة عالمية",
        statsProjectsNum: "250+",
        statsYearsNum: "15+",
        statsCountriesNum: "48",
        statsAwardsNum: "22",
        footerCopyright: "© 2025 اسم الشركة – جميع الحقوق محفوظة",
        footerLogo: "/capture.png",
        headerLogo: "/capture.png",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !content) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <>
      <header className={isMenuOpen ? "menu-active" : ""}>
        <Image
          src={content.headerLogo}
          alt="شعار الشركة"
          width={75}
          height={75}
          className="logo"
          unoptimized
        />
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="قائمة التنقل"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        {isMenuOpen && (
          <div
            className="menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        <nav className={isMenuOpen ? "nav-open" : ""}>
          <Link href="/home" onClick={() => setIsMenuOpen(false)}>الرئيسية</Link>
          <Link href="/home" onClick={() => setIsMenuOpen(false)}>عن الشركة</Link>
          <Link href="/home" onClick={() => setIsMenuOpen(false)}>خدماتنا</Link>
          <Link href="/home" onClick={() => setIsMenuOpen(false)}>المشاريع</Link>
          <Link href="/home" onClick={() => setIsMenuOpen(false)}>تواصلوا معنا</Link>
        </nav>
      </header>

      <section className="hero">
        <Image
          src={content.heroLogo}
          alt="شعار"
          width={200}
          height={200}
          className="hero-logo"
          unoptimized
        />
        <h1>{content.heroTitle}</h1>
        <p>{content.heroSubtitle}</p>
      </section>

      <section className="about">
        <h2>{content.aboutTitle}</h2>
        <p>{content.aboutP1}</p>
        <p>{content.aboutP2}</p>
      </section>

      <section className="vision">
        <h2>{content.visionTitle}</h2>
        <div className="cards">
          <div className="card">
            <h3>{content.visionVision}</h3>
            <p>{content.visionVisionText}</p>
          </div>
          <div className="card">
            <h3>{content.visionMission}</h3>
            <p>{content.visionMissionText}</p>
          </div>
          <div className="card">
            <h3>{content.visionValues}</h3>
            <p>{content.visionValuesText}</p>
          </div>
        </div>
      </section>

      <section className="stats">
        <h2>{content.statsTitle}</h2>
        <div className="stats-grid">
          <div className="stat">
            <h3>{content.statsProjectsNum}</h3>
            <p>{content.statsProjects}</p>
          </div>
          <div className="stat">
            <h3>{content.statsYearsNum}</h3>
            <p>{content.statsYears}</p>
          </div>
          <div className="stat">
            <h3>{content.statsCountriesNum}</h3>
            <p>{content.statsCountries}</p>
          </div>
          <div className="stat">
            <h3>{content.statsAwardsNum}</h3>
            <p>{content.statsAwards}</p>
          </div>
        </div>
      </section>

      <footer>
        <Image
          src={content.footerLogo}
          alt="شعار"
          width={80}
          height={80}
          unoptimized
        />
        <p>{content.footerCopyright}</p>
      </footer>
    </>
  );
}

