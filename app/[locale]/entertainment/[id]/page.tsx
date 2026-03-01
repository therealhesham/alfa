import type { Metadata } from "next";
import { getSiteSettings, getFooterContent, getHomeContent } from "@/lib/data";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
import ProjectDetailClient from "./ProjectDetailClient";
import type { Locale } from "@/i18n";
import { getEntertainmentProjectLocalized } from "@/lib/entertainment-data";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const project = await getEntertainmentProjectLocalized(id, validLocale);

  if (!project) {
    return { title: "Not Found" };
  }

  return generateSEOMetadata({
    title: `${project.title} - ${validLocale === "ar" ? "ظلال المدينة" : "City Shadows"}`,
    description: project.description,
    locale: validLocale,
    path: `/entertainment/${id}`,
    keywords: validLocale === "ar"
      ? ["مشروع ترفيهي", project.category, "ظلال المدينة", project.location]
      : ["Entertainment Project", project.category, "City Shadows", project.location],
    type: "article",
  });
}

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, id } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;

  const project = await getEntertainmentProjectLocalized(id, validLocale);

  if (!project) {
    notFound();
  }

  const [settings, footerContent, homeContent] = await Promise.all([
    getSiteSettings(),
    getFooterContent(validLocale),
    getHomeContent(validLocale),
  ]);

  return (
    <FontsProvider settings={settings}>
      <Header
        locale={validLocale}
        settings={settings}
        headerLogo={homeContent?.headerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
        isHomePage={false}
      />

      <ProjectDetailClient project={project} locale={validLocale} />

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
