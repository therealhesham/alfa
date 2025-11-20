import type { Metadata } from "next";
import { Tajawal, Amiri } from "next/font/google";
import "../globals.css";
import { Locale } from "@/i18n";
import { getTranslations } from "@/lib/i18n";

const tajawal = Tajawal({
  weight: ["300", "400", "700", "900"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);

  return {
    title: t.hero.title,
    description: t.hero.subtitle,
  };
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

  return (
    <div lang={validLocale} dir={isRTL ? "rtl" : "ltr"}>
      {children}
    </div>
  );
}

