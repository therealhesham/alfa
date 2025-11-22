import Image from "next/image";
import { getHomeContent, getSiteSettings, getFooterContent } from "@/lib/data";
import { getTranslations } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
import { Home, Layers, Activity, HelpCircle } from "lucide-react";
import type { Locale } from "@/i18n";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);

  // Fetch data in parallel
  const [content, settings, footerContent] = await Promise.all([
    getHomeContent(validLocale),
    getSiteSettings(),
    getFooterContent(validLocale),
  ]);

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
    servicesTitle: t.services.title,
    servicesSubtitle: t.services.subtitle,
    service1Title: t.services.service1,
    service1Desc: t.services.service1Desc,
    service2Title: t.services.service2,
    service2Desc: t.services.service2Desc,
    service3Title: t.services.service3,
    service3Desc: t.services.service3Desc,
    service4Title: t.services.service4,
    service4Desc: t.services.service4Desc,
    projectsTitle: t.projectsSection.title,
    projectsSubtitle: t.projectsSection.subtitle,
    projectsViewMore: t.projectsSection.viewMore,
    project1Title: t.projectsSection.project1,
    project1Desc: t.projectsSection.project1Desc,
    project1Image: "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png",
    project2Title: t.projectsSection.project2,
    project2Desc: t.projectsSection.project2Desc,
    project2Image: "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png",
    project3Title: t.projectsSection.project3,
    project3Desc: t.projectsSection.project3Desc,
    project3Image: "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png",
    footerCopyright: t.footer.copyright,
    footerLogo: "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png",
    headerLogo: "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png",
  };

  return (
    <FontsProvider settings={settings}>
      <Header 
        locale={validLocale} 
        settings={settings} 
        headerLogo={displayContent.headerLogo}
        isHomePage={true}
      />

      <section id="hero" className="hero" style={{ fontFamily: settings?.bodyFont }}>
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

      <section id="about" className="about" style={{ fontFamily: settings?.bodyFont }}>
        <h2 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
          {displayContent.aboutTitle}
        </h2>
        <p>{displayContent.aboutP1}</p>
        <p>{displayContent.aboutP2}</p>
      </section>

      <section id="vision" className="vision" style={{ fontFamily: settings?.bodyFont }}>
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

      <section id="services" className="services" style={{ fontFamily: settings?.bodyFont }}>
        <h2 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
          {displayContent.servicesTitle || t.services.title}
        </h2>
        <p className="section-subtitle">{displayContent.servicesSubtitle || t.services.subtitle}</p>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <Home size={48} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.service1Title || t.services.service1}
            </h3>
            <p>{displayContent.service1Desc || t.services.service1Desc}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <Layers size={48} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.service2Title || t.services.service2}
            </h3>
            <p>{displayContent.service2Desc || t.services.service2Desc}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <Activity size={48} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.service3Title || t.services.service3}
            </h3>
            <p>{displayContent.service3Desc || t.services.service3Desc}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <HelpCircle size={48} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {displayContent.service4Title || t.services.service4}
            </h3>
            <p>{displayContent.service4Desc || t.services.service4Desc}</p>
          </div>
        </div>
      </section>

      <section id="projects" className="projects" style={{ fontFamily: settings?.bodyFont }}>
        <h2 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
          {displayContent.projectsTitle || t.projectsSection.title}
        </h2>
        <p className="section-subtitle">{displayContent.projectsSubtitle || t.projectsSection.subtitle}</p>
        <div className="projects-grid">
          <div className="project-card">
            <div className="project-image">
              <Image
                src={displayContent.project1Image || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
                alt={displayContent.project1Title || t.projectsSection.project1}
                width={400}
                height={300}
                unoptimized
              />
            </div>
            <div className="project-content">
              <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                {displayContent.project1Title || t.projectsSection.project1}
              </h3>
              <p>{displayContent.project1Desc || t.projectsSection.project1Desc}</p>
            </div>
          </div>
          <div className="project-card">
            <div className="project-image">
              <Image
                src={displayContent.project2Image || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
                alt={displayContent.project2Title || t.projectsSection.project2}
                width={400}
                height={300}
                unoptimized
              />
            </div>
            <div className="project-content">
              <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                {displayContent.project2Title || t.projectsSection.project2}
              </h3>
              <p>{displayContent.project2Desc || t.projectsSection.project2Desc}</p>
            </div>
          </div>
          <div className="project-card">
            <div className="project-image">
              <Image
                src={displayContent.project3Image || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
                alt={displayContent.project3Title || t.projectsSection.project3}
                width={400}
                height={300}
                unoptimized
              />
            </div>
            <div className="project-content">
              <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                {displayContent.project3Title || t.projectsSection.project3}
              </h3>
              <p>{displayContent.project3Desc || t.projectsSection.project3Desc}</p>
            </div>
          </div>
        </div>
        <div className="view-more-container">
          <a href="#projects" className="view-more-btn" style={{ fontFamily: settings?.bodyFont }}>
            {displayContent.projectsViewMore || t.projectsSection.viewMore} →
          </a>
        </div>
      </section>

      <section id="stats" className="stats" style={{ fontFamily: settings?.bodyFont }}>
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

      <Footer
        locale={validLocale}
        settings={settings}
        footerLogo={footerContent?.footerLogo || displayContent.footerLogo}
        footerCopyright={footerContent?.footerCopyright || displayContent.footerCopyright}
        companyName={footerContent?.companyName}
        addressLabel={footerContent?.addressLabel}
        addressValue={footerContent?.addressValue}
        phoneLabelInfo={footerContent?.phoneLabelInfo}
        phoneValue={footerContent?.phoneValue}
      />
    </FontsProvider>
  );
}
