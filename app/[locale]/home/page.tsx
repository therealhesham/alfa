import Image from "next/image";
import { getHomeContent, getSiteSettings, getFooterContent } from "@/lib/data";
import { getTranslations } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
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
      />

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
