import type { Metadata } from "next";
import "./globals.css";
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
  weight: ["300", "400", "700", "900"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
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
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || "https://cityshadows.com"} />
      </head>
      <body
        className={`${tajawal.variable} antialiased`}
        style={{
          fontFamily: "var(--font-tajawal), 'Tajawal', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
