import { Metadata } from "next";
import { Locale } from "@/i18n";

// Base URL - يجب تحديثه عند النشر
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cityshadows.com";

interface SEOProps {
  title: string;
  description: string;
  locale: Locale;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
  noindex?: boolean;
  nofollow?: boolean;
}

export function generateSEOMetadata({
  title,
  description,
  locale,
  path = "",
  image,
  keywords = [],
  type = "website",
  noindex = false,
  nofollow = false,
}: SEOProps): Metadata {
  const url = `${baseUrl}${path ? `/${locale}${path}` : `/${locale}`}`;
  const defaultImage = `${baseUrl}/og-image.jpg`; // يمكن إضافة صورة افتراضية
  const ogImage = image || defaultImage;
  const alternateLocale = locale === "ar" ? "en" : "ar";
  const alternatePath = path || "";
  const alternateUrl = `${baseUrl}/${alternateLocale}${alternatePath}`;

  // Keywords for SEO
  const defaultKeywords = [
    "تصميم معماري",
    "هندسة معمارية",
    "تصميم داخلي",
    "مشاريع معمارية",
    "ظلال المدينة",
    "Madina Shadows",
    "Architectural Design",
    "Interior Design",
    "Luxury Architecture",
  ];
  const allKeywords = [...defaultKeywords, ...keywords].join(", ");

  return {
    title: {
      default: title,
      template: `%s | ${locale === "ar" ? "ظلال المدينة" : "Madina Shadows"}`,
    },
    description,
    keywords: allKeywords,
    authors: [{ name: locale === "ar" ? "ظلال المدينة" : "Madina Shadows" }],
    creator: locale === "ar" ? "ظلال المدينة" : "City Shadows",
    publisher: locale === "ar" ? "ظلال المدينة" : "Madina Shadows",
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      url,
      title,
      description,
      siteName: locale === "ar" ? "ظلال المدينة" : "City Shadows",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      alternateLocale: alternateLocale === "ar" ? "ar_SA" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@cityshadows", // يمكن تحديثه
    },
    alternates: {
      canonical: url,
      languages: {
        [locale === "ar" ? "ar" : "en"]: url,
        [alternateLocale === "ar" ? "ar" : "en"]: alternateUrl,
      },
    },
    metadataBase: new URL(baseUrl),
    verification: {
      // يمكن إضافة Google Search Console verification
      // google: "your-google-verification-code",
    },
  };
}

// Helper function to get structured data for Organization
export function getOrganizationStructuredData(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: locale === "ar" ? "ظلال المدينة" : "City Shadows",
    alternateName: locale === "ar" ? "City Shadows" : "ظلال المدينة",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      locale === "ar"
        ? "شركة رائدة في التصميم المعماري والهندسة الفاخرة، نجمع بين الأصالة العربية واللمسات العصرية العالمية"
        : "A leading company in architectural design and luxury engineering, combining Arabic authenticity with modern global touches",
    foundingDate: "2008",
    address: {
      "@type": "PostalAddress",
      addressCountry: locale === "ar" ? "SA" : "SA",
    },
    sameAs: [
      // يمكن إضافة روابط وسائل التواصل الاجتماعي
      // "https://www.facebook.com/cityshadows",
      // "https://www.instagram.com/cityshadows",
      // "https://www.linkedin.com/company/cityshadows",
    ],
  };
}

// Helper function to get structured data for WebSite
export function getWebSiteStructuredData(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: locale === "ar" ? "ظلال المدينة" : "City Shadows",
    url: baseUrl,
    description:
      locale === "ar"
        ? "شركة رائدة في التصميم المعماري والهندسة الفاخرة"
        : "A leading company in architectural design and luxury engineering",
    inLanguage: locale === "ar" ? "ar-SA" : "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/${locale}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// Helper function to get structured data for BreadcrumbList
export function getBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>,
  locale: Locale
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

