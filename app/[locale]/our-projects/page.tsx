import type { Metadata } from "next";
import { getSiteSettings, getFooterContent, getHomeContent } from "@/lib/data";
import { getTranslations } from "@/lib/i18n";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
import OurClients from "./OurClients";
import ProjectsClient from "./ProjectsClient";
import HeroSection from "./HeroSection";
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

  const title = validLocale === "ar"
    ? "مشاريعنا - ظلال المدينة | معرض المشاريع المعمارية"
    : "Our Projects - City Shadows | Architectural Projects Portfolio";

  const description = validLocale === "ar"
    ? "استعرض مجموعة من مشاريعنا الاستثنائية في التصميم المعماري والهندسة الفاخرة حول العالم. أكثر من 250 مشروع في 48 دولة."
    : "Browse our exceptional portfolio of architectural design and luxury engineering projects around the world. Over 250 projects in 48 countries.";

  return generateSEOMetadata({
    title,
    description,
    locale: validLocale,
    path: "/our-projects",
    keywords: validLocale === "ar"
      ? ["مشاريع معمارية", "معرض المشاريع", "تصميم معماري", "مشاريع فاخرة", "ظلال المدينة"]
      : ["Architectural Projects", "Projects Portfolio", "Architectural Design", "Luxury Projects", "City Shadows"],
    type: "website",
  });
}

interface OurProjectsPageProps {
  params: Promise<{ locale: string }>;
}

async function getProjects(locale: Locale) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/projects?locale=${locale}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

async function getOurProjectsContent(locale: Locale) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/our-projects-content?locale=${locale}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch our-projects content');
    }
    
    const content = await response.json();
    
    // Map content based on locale
    if (locale === 'en') {
      return {
        heroLogo: content.heroLogo,
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        showStats: content.showStats ?? true,
        stat1Icon: content.stat1Icon,
        stat1Number: content.stat1Number,
        stat1Label: content.stat1Label,
        stat2Icon: content.stat2Icon,
        stat2Number: content.stat2Number,
        stat2Label: content.stat2Label,
        stat3Icon: content.stat3Icon,
        stat3Number: content.stat3Number,
        stat3Label: content.stat3Label,
        galleryIcon: content.galleryIcon,
        galleryTitle: content.galleryTitle,
        gallerySubtitle: content.gallerySubtitle,
        emptyMessage: content.emptyMessage,
      };
    }
    
    return {
      heroLogo: content.heroLogo,
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      showStats: content.showStats ?? true,
      stat1Icon: content.stat1Icon,
      stat1Number: content.stat1Number,
      stat1Label: content.stat1Label,
      stat2Icon: content.stat2Icon,
      stat2Number: content.stat2Number,
      stat2Label: content.stat2Label,
      stat3Icon: content.stat3Icon,
      stat3Number: content.stat3Number,
      stat3Label: content.stat3Label,
      galleryIcon: content.galleryIcon,
      galleryTitle: content.galleryTitle,
      gallerySubtitle: content.gallerySubtitle,
      emptyMessage: content.emptyMessage,
    };
  } catch (error) {
    console.error('Error fetching our-projects content:', error);
    // Return defaults on error
    return {
      heroLogo: "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png",
      heroTitle: locale === 'ar' ? 'مشاريعنا' : 'Our Projects',
      heroSubtitle: locale === 'ar' 
        ? 'نفخر بتقديم مشاريع استثنائية حول العالم' 
        : 'We are proud to present exceptional projects around the world',
      showStats: true,
      stat1Icon: 'Globe',
      stat1Number: '48',
      stat1Label: locale === 'ar' ? 'دولة' : 'Countries',
      stat2Icon: 'Building2',
      stat2Number: '250+',
      stat2Label: locale === 'ar' ? 'مشروع' : 'Projects',
      stat3Icon: 'Award',
      stat3Number: '22',
      stat3Label: locale === 'ar' ? 'جائزة' : 'Awards',
      galleryIcon: 'Layers',
      galleryTitle: locale === 'ar' ? 'معرض المشاريع' : 'Projects Gallery',
      gallerySubtitle: locale === 'ar' 
        ? 'استكشف مجموعة من أروع مشاريعنا المعمارية' 
        : 'Explore a collection of our finest architectural projects',
      emptyMessage: locale === 'ar' 
        ? 'لا توجد مشاريع متاحة حالياً' 
        : 'No projects available at the moment',
    };
  }
}

async function getOurClientsContent(locale: Locale) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/our-clients-content?locale=${locale}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch our-clients content');
    }
    
    const content = await response.json();
    
    // Map content based on locale
    if (locale === 'en') {
      return {
        statsTitle: content.statsTitle,
        statsSubtitle: content.statsSubtitle,
        showStats: content.showStats ?? true,
        statsStat1Icon: content.statsStat1Icon,
        statsStat1Number: content.statsStat1Number,
        statsStat1Label: content.statsStat1Label,
        statsStat2Icon: content.statsStat2Icon,
        statsStat2Number: content.statsStat2Number,
        statsStat2Label: content.statsStat2Label,
        statsStat3Icon: content.statsStat3Icon,
        statsStat3Number: content.statsStat3Number,
        statsStat3Label: content.statsStat3Label,
        statsStat4Icon: content.statsStat4Icon,
        statsStat4Number: content.statsStat4Number,
        statsStat4Label: content.statsStat4Label,
        clientsTitle: content.clientsTitle,
        clientsSubtitle: content.clientsSubtitle,
        clientLogos: content.clientLogos || [],
      };
    }
    
    return {
      statsTitle: content.statsTitle,
      statsSubtitle: content.statsSubtitle,
      showStats: content.showStats ?? true,
      statsStat1Icon: content.statsStat1Icon,
      statsStat1Number: content.statsStat1Number,
      statsStat1Label: content.statsStat1Label,
      statsStat2Icon: content.statsStat2Icon,
      statsStat2Number: content.statsStat2Number,
      statsStat2Label: content.statsStat2Label,
      statsStat3Icon: content.statsStat3Icon,
      statsStat3Number: content.statsStat3Number,
      statsStat3Label: content.statsStat3Label,
      statsStat4Icon: content.statsStat4Icon,
      statsStat4Number: content.statsStat4Number,
      statsStat4Label: content.statsStat4Label,
      clientsTitle: content.clientsTitle,
      clientsSubtitle: content.clientsSubtitle,
      clientLogos: content.clientLogos || [],
    };
  } catch (error) {
    console.error('Error fetching our-clients content:', error);
    // Return defaults on error
    return {
      statsTitle: locale === 'ar' ? 'إنجازاتنا بالأرقام' : 'Our Achievements in Numbers',
      statsSubtitle: locale === 'ar' 
        ? 'سنوات من الخبرة والتميز في التصميم المعماري الفاخر'
        : 'Years of experience and excellence in luxury architectural design',
      showStats: true,
      statsStat1Icon: 'Building2',
      statsStat1Number: '250+',
      statsStat1Label: locale === 'ar' ? 'مشروع مكتمل' : 'Completed Projects',
      statsStat2Icon: 'Globe',
      statsStat2Number: '48',
      statsStat2Label: locale === 'ar' ? 'دولة حول العالم' : 'Countries Worldwide',
      statsStat3Icon: 'Award',
      statsStat3Number: '22',
      statsStat3Label: locale === 'ar' ? 'جائزة دولية' : 'International Awards',
      statsStat4Icon: 'Users',
      statsStat4Number: '500+',
      statsStat4Label: locale === 'ar' ? 'عميل راضٍ' : 'Satisfied Clients',
      clientsTitle: locale === 'ar' ? 'عملاؤنا' : 'Our Clients',
      clientsSubtitle: locale === 'ar' 
        ? 'نفتخر بثقة عملائنا الكرام من حول العالم'
        : 'We are proud of the trust of our valued clients from around the world',
      clientLogos: [],
    };
  }
}

export default async function OurProjectsPage({ params }: OurProjectsPageProps) {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);

  // Fetch data in parallel
  const [projects, settings, footerContent, pageContent, homeContent, clientsContent] = await Promise.all([
    getProjects(validLocale),
    getSiteSettings(),
    getFooterContent(validLocale),
    getOurProjectsContent(validLocale),
    getHomeContent(validLocale),
    getOurClientsContent(validLocale),
  ]);

  return (
    <FontsProvider settings={settings}>
      <Header 
        locale={validLocale} 
        settings={settings} 
        headerLogo={homeContent?.headerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
        isHomePage={false}
      />

      {/* Hero Section */}
      <HeroSection
        heroLogo={pageContent.heroLogo}
        heroTitle={pageContent.heroTitle}
        heroSubtitle={pageContent.heroSubtitle}
        showStats={pageContent.showStats}
        stat1Icon={pageContent.stat1Icon}
        stat1Number={pageContent.stat1Number}
        stat1Label={pageContent.stat1Label}
        stat2Icon={pageContent.stat2Icon}
        stat2Number={pageContent.stat2Number}
        stat2Label={pageContent.stat2Label}
        stat3Icon={pageContent.stat3Icon}
        stat3Number={pageContent.stat3Number}
        stat3Label={pageContent.stat3Label}
        settings={settings}
        locale={validLocale}
      />

      {/* Projects Section */}
      <section className="projects" style={{ 
        padding: '5rem 2rem',
        fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
        background: 'radial-gradient(ellipse at center top, rgba(212, 193, 157, 0.15) 0%, transparent 60%), radial-gradient(ellipse at center bottom, rgba(232, 217, 192, 0.12) 0%, transparent 60%), #000000',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Section Icon */}
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
           
         
          </div>

          {/* Projects Grid - Client Component */}
          <ProjectsClient 
            projects={projects}
            locale={validLocale}
            settings={settings}
            pageContent={pageContent}
          />
        </div>
      </section>

      {/* Our Clients & Stats Section */}
      <OurClients locale={validLocale} settings={settings} content={clientsContent} />

      <Footer
        locale={validLocale}
        settings={settings}
        footerLogo={footerContent?.footerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
        footerCopyright={footerContent?.footerCopyright || (validLocale === "ar" ? "© 2025 اسم الشركة – جميع الحقوق محفوظة" : "© 2025 Company Name – All Rights Reserved")}
        companyName={footerContent?.companyName}
        addressLabel={footerContent?.addressLabel}
        addressValue={footerContent?.addressValue}
        phoneLabelInfo={footerContent?.phoneLabelInfo}
        phoneValue={footerContent?.phoneValue}
      />
    </FontsProvider>
  );
}

