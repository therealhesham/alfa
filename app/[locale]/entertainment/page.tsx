import type { Metadata } from "next";
import { getSiteSettings, getFooterContent, getHomeContent } from "@/lib/data";
import { getTranslations } from "@/lib/i18n";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
import EntertainmentHero from "./EntertainmentHero";
import EntertainmentClient from "./EntertainmentClient";
import type { Locale } from "@/i18n";
import { getAllEntertainmentProjectsLocalized, getEntertainmentContent } from "@/lib/entertainment-data";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;

  const title = validLocale === "ar"
    ? "عالم الترفيه - ظلال المدينة | مشاريع ترفيهية متميزة"
    : "Entertainment World - City Shadows | Distinguished Entertainment Projects";

  const description = validLocale === "ar"
    ? "اكتشف مشاريعنا الترفيهية المتميزة التي تجمع بين الابتكار والفخامة. مدن ترفيهية، منتجعات، مراكز رقمية وحدائق عائلية."
    : "Discover our distinguished entertainment projects combining innovation and luxury. Entertainment cities, resorts, digital centers, and family parks.";

  return generateSEOMetadata({
    title,
    description,
    locale: validLocale,
    path: "/entertainment",
    keywords: validLocale === "ar"
      ? ["مشاريع ترفيهية", "مدن ترفيهية", "منتجعات", "ألعاب رقمية", "حدائق ترفيهية", "ظلال المدينة"]
      : ["Entertainment Projects", "Entertainment Cities", "Resorts", "Digital Gaming", "Entertainment Parks", "City Shadows"],
    type: "website",
  });
}

interface EntertainmentPageProps {
  params: Promise<{ locale: string }>;
}

export default async function EntertainmentPage({ params }: EntertainmentPageProps) {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);

  const [settings, footerContent, homeContent, projects, pageContent] = await Promise.all([
    getSiteSettings(),
    getFooterContent(validLocale),
    getHomeContent(validLocale),
    getAllEntertainmentProjectsLocalized(validLocale),
    getEntertainmentContent(validLocale),
  ]);

  return (
    <FontsProvider settings={settings}>
      <Header
        locale={validLocale}
        settings={settings}
        headerLogo={homeContent?.headerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
        isHomePage={false}
      />

      <EntertainmentHero
        locale={validLocale}
        heroTitle={pageContent.heroTitle}
        heroSubtitle={pageContent.heroSubtitle}
        heroImages={pageContent.heroImages}
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
      />

      <section style={{
        padding: '5rem 2rem',
        fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
        background: 'radial-gradient(ellipse at center top, rgba(212, 193, 157, 0.15) 0%, transparent 60%), radial-gradient(ellipse at center bottom, rgba(232, 217, 192, 0.12) 0%, transparent 60%), #000000',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <EntertainmentClient
            projects={projects}
            locale={validLocale}
            pageContent={pageContent}
          />
        </div>
      </section>

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
        showSocialMedia={footerContent?.showSocialMedia}
        instagramLink={footerContent?.instagramLink}
        facebookLink={footerContent?.facebookLink}
        xLink={footerContent?.xLink}
      />
    </FontsProvider>
  );
}
