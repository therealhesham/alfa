import type { Metadata } from "next";
import { getHomeContent, getSiteSettings, getFooterContent, getContactUsContent, getProjects } from "@/lib/data";
import { getTranslations } from "@/lib/i18n";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
import HomeContactForm from "@/components/HomeContactForm";
import { Home, Layers, Activity, HelpCircle } from "lucide-react";
import {
  AnimatedHero,
  AnimatedAbout,
  AnimatedVision,
  AnimatedQuote,
  AnimatedServices,
  AnimatedProjects,
  AnimatedStats,
} from "./AnimatedSections";
import { ScrollSnapContainer } from "./ScrollSnapContainer";
import type { Locale } from "@/i18n";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);

  const title = validLocale === "ar"
    ? "الرئيسية - ظلال المدينة | التصميم المعماري الفاخر"
    : "Home - City Shadows | Luxury Architectural Design";

  const description = validLocale === "ar"
    ? `${t.hero.subtitle} شركة رائدة في التصميم المعماري والهندسة الفاخرة. أكثر من 250 مشروع في 48 دولة و 22 جائزة عالمية.`
    : `${t.hero.subtitle} A leading company in architectural design and luxury engineering. Over 250 projects in 48 countries and 22 international awards.`;

  return generateSEOMetadata({
    title,
    description,
    locale: validLocale,
    path: "/home",
    keywords: validLocale === "ar"
      ? ["تصميم معماري", "هندسة معمارية", "تصميم داخلي", "مشاريع معمارية", "فخامة", "تميز", "ظلال المدينة"]
      : ["Architectural Design", "Interior Design", "Luxury Architecture", "Engineering", "Projects", "City Shadows"],
  });
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);

  // Fetch data in parallel
  const [content, settings, footerContent, projects, contactContent] = await Promise.all([
    getHomeContent(validLocale),
    getSiteSettings(),
    getFooterContent(validLocale),
    getProjects(validLocale, 3),
    getContactUsContent(validLocale),
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

  // Fallback to translations if contact content is not available
  const displayContactContent = contactContent || {
    id: "",
    heroTitle: t.contact.title,
    heroSubtitle: t.contact.subtitle,
    formTitle: t.contact.title,
    nameLabel: t.contact.name,
    emailLabel: t.contact.email,
    phoneLabel: t.contact.phone,
    subjectLabel: t.contact.subject,
    messageLabel: t.contact.message,
    sendButton: t.contact.send,
    sendingButton: t.contact.sending,
    infoTitle: t.contact.info.title,
    infoDescription: t.contact.info.description,
    addressLabel: t.contact.info.address,
    addressValue: t.contact.info.addressValue,
    phoneLabelInfo: t.contact.info.phone,
    phoneValue: t.contact.info.phoneValue,
    emailLabelInfo: t.contact.info.email,
    emailValue: t.contact.info.emailValue,
    hoursLabel: t.contact.info.hours,
    hoursValue: t.contact.info.hoursValue,
    successMessage: t.contact.success,
    errorMessage: t.contact.error,
    requiredField: t.contact.required,
    invalidEmail: t.contact.invalidEmail,
  };

  return (
    <FontsProvider settings={settings}>
      <Header 
        locale={validLocale} 
        settings={settings} 
        headerLogo={displayContent.headerLogo}
        isHomePage={true}
      />

      <ScrollSnapContainer>
        <AnimatedHero
        heroLogo={displayContent.heroLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
        heroTitle={displayContent.heroTitle}
        heroSubtitle={displayContent.heroSubtitle}
        logoAlt={t.common.logoAlt}
        bodyFont={settings?.bodyFont}
        headingFont={settings?.headingFont}
        primaryFont={settings?.primaryFont}
      />

      <AnimatedAbout
        aboutTitle={displayContent.aboutTitle}
        aboutP1={displayContent.aboutP1}
        aboutP2={displayContent.aboutP2}
        readMoreText={t.about.readMore}
        readMoreLink={`/${validLocale}/about-us`}
        bodyFont={settings?.bodyFont}
        headingFont={settings?.headingFont}
        primaryFont={settings?.primaryFont}
      />

      <AnimatedVision
        visionTitle={displayContent.visionTitle}
        visionVision={displayContent.visionVision}
        visionVisionText={displayContent.visionVisionText}
        visionMission={displayContent.visionMission}
        visionMissionText={displayContent.visionMissionText}
        visionValues={displayContent.visionValues}
        visionValuesText={displayContent.visionValuesText}
        bodyFont={settings?.bodyFont}
        headingFont={settings?.headingFont}
        primaryFont={settings?.primaryFont}
      />

      {/* Quote Section - OUD Style */}
      <AnimatedQuote
        title={validLocale === "ar" ? "في ظلال المدينة" : "At City Shadows"}
        text={validLocale === "ar" 
          ? "نؤمن أن العقارات هي أكثر بكثير من المباني والمساحات. إنها فن تشكيل أنماط الحياة المكررة وبناء مجتمعات تعكس الأناقة الخالدة والعيش الراقي."
          : "We believe that real estate is far more than structures and spaces. It's the art of shaping refined lifestyles and cultivating communities that reflect timeless elegance and elevated living."}
        author={validLocale === "ar" ? "المدير التنفيذي" : "Managing Director"}
        bodyFont={settings?.bodyFont}
        headingFont={settings?.headingFont}
        primaryFont={settings?.primaryFont}
      />

      <AnimatedServices
        title={displayContent.servicesTitle || t.services.title}
        subtitle={displayContent.servicesSubtitle || t.services.subtitle}
        services={[
          {
            icon: 'Home',
            title: displayContent.service1Title || t.services.service1,
            description: displayContent.service1Desc || t.services.service1Desc,
          },
          {
            icon: 'Layers',
            title: displayContent.service2Title || t.services.service2,
            description: displayContent.service2Desc || t.services.service2Desc,
          },
          {
            icon: 'Activity',
            title: displayContent.service3Title || t.services.service3,
            description: displayContent.service3Desc || t.services.service3Desc,
          },
          {
            icon: 'HelpCircle',
            title: displayContent.service4Title || t.services.service4,
            description: displayContent.service4Desc || t.services.service4Desc,
          },
        ]}
        bodyFont={settings?.bodyFont}
        headingFont={settings?.headingFont}
        primaryFont={settings?.primaryFont}
      />

      {projects.length > 0 && (
        <AnimatedProjects
          title={displayContent.projectsTitle || t.projectsSection.title}
          subtitle={displayContent.projectsSubtitle || t.projectsSection.subtitle}
          projects={projects}
          viewMoreText={displayContent.projectsViewMore || t.projectsSection.viewMore}
          viewMoreLink={`/${validLocale}/our-projects`}
          bodyFont={settings?.bodyFont}
          headingFont={settings?.headingFont}
          primaryFont={settings?.primaryFont}
        />
      )}

      <AnimatedStats
        title={displayContent.statsTitle}
        stats={[
          {
            number: displayContent.statsProjectsNum,
            label: displayContent.statsProjects,
          },
          {
            number: displayContent.statsYearsNum,
            label: displayContent.statsYears,
          },
        ]}
        bodyFont={settings?.bodyFont}
        headingFont={settings?.headingFont}
        primaryFont={settings?.primaryFont}
      />

      <section 
        id="contact"
        className="scroll-snap-section"
        style={{ 
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <HomeContactForm
          locale={validLocale}
          settings={settings}
          content={displayContactContent}
        />
      </section>

      <section 
        className="scroll-snap-section"
        style={{ 
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
        }}
      >
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
      </section>
      </ScrollSnapContainer>
    </FontsProvider>
  );
}
