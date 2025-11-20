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
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getTranslations(locale);

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
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  return (
    <div lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      {children}
    </div>
  );
}

