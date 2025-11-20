import "./globals.css";
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
  weight: ["300", "400", "700", "900"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
});

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
