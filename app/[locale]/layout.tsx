import type { Metadata } from "next";
import { PT_Serif, Aboreto, Montserrat } from "next/font/google";
import "../globals.css";
import { Locale } from "@/i18n";
import { getTranslations } from "@/lib/i18n";
import { generateSEOMetadata, getOrganizationStructuredData, getWebSiteStructuredData } from "@/lib/seo";
import WhatsAppButtonWrapper from "@/components/WhatsAppButtonWrapper";

const ptSerif = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-pt-serif",
  display: "swap",
});

const aboreto = Aboreto({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-aboreto",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["400", "500"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);

  const title = validLocale === "ar" 
    ? "ظلال المدينة - التصميم المعماري الفاخر والهندسة المتميزة"
    : "City Shadows - Luxury Architectural Design & Engineering";
  
  const description = validLocale === "ar"
    ? "شركة رائدة في التصميم المعماري والهندسة الفاخرة، نجمع بين الأصالة العربية واللمسات العصرية العالمية. أكثر من 250 مشروع في 48 دولة و 22 جائزة عالمية."
    : "A leading company in architectural design and luxury engineering, combining Arabic authenticity with modern global touches. Over 250 projects in 48 countries and 22 international awards.";

  return generateSEOMetadata({
    title,
    description,
    locale: validLocale,
    keywords: validLocale === "ar"
      ? ["تصميم معماري", "هندسة معمارية", "تصميم داخلي", "مشاريع معمارية", "فخامة", "تميز"]
      : ["Architectural Design", "Interior Design", "Luxury Architecture", "Engineering", "Projects"],
    type: "website",
  });
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const isRTL = validLocale === "ar";

  // Generate structured data
  const organizationData = getOrganizationStructuredData(validLocale);
  const websiteData = getWebSiteStructuredData(validLocale);

  return (
    <div lang={validLocale} dir={isRTL ? "rtl" : "ltr"} className={`${ptSerif.variable} ${aboreto.variable} ${montserrat.variable}`}>
      {/* DG Kufi Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
      {children}
      <WhatsAppButtonWrapper />
    </div>
  );
}

