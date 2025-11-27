import type { Metadata } from "next";
import "./globals.css";
import { PT_Serif, Aboreto, Montserrat } from "next/font/google";

const ptSerif = PT_Serif({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-pt-serif",
});

const aboreto = Aboreto({
  weight: ["400"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-aboreto",
});

const montserrat = Montserrat({
  weight: ["400", "500"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// Default metadata for root layout
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cityshadows.com"),
  title: {
    default: "ظلال المدينة | Madina Shadows - التصميم المعماري الفاخر",
    template: "%s | ظلال المدينة",
  },
  description: "شركة رائدة في التصميم المعماري والهندسة الفاخرة، نجمع بين الأصالة العربية واللمسات العصرية العالمية. أكثر من 250 مشروع في 48 دولة.",
  keywords: [
    "تصميم معماري",
    "هندسة معمارية",
    "تصميم داخلي",
    "مشاريع معمارية",
    "Madina Shadows",
    "Architectural Design",
    "Interior Design",
    "Luxury Architecture",
  ],
  authors: [{ name: "ظلال المدينة" }],
  creator: "ظلال المدينة",
  publisher: "ظلال المدينة",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Aboreto:ital,wght@0,400&family=Montserrat:ital,wght@0,400;0,500&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://cityshadows.com"} />
      </head>
      <body
        className={`${ptSerif.variable} ${aboreto.variable} ${montserrat.variable} antialiased`}
        style={{
          fontFamily: "var(--font-kufi), 'DG Kufi', 'Noto Kufi Arabic', Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
