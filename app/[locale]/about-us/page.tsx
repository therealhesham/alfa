import Image from "next/image";
import { getAboutUsContent, getSiteSettings, getFooterContent } from "@/lib/data";
import { getTranslations } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
import type { Locale } from "@/i18n";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface AboutUsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutUsPage({ params }: AboutUsPageProps) {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);

  // Fetch data in parallel
  const [content, settings, footerContent] = await Promise.all([
    getAboutUsContent(validLocale),
    getSiteSettings(),
    getFooterContent(validLocale),
  ]);

  if (!content) {
    return (
      <FontsProvider settings={settings}>
        <Header locale={validLocale} settings={settings} />
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>{validLocale === "ar" ? "حدث خطأ في تحميل المحتوى" : "Error loading content"}</p>
        </div>
      </FontsProvider>
    );
  }

  return (
    <FontsProvider settings={settings}>
      <Header locale={validLocale} settings={settings} />

      {/* Hero Section */}
      <section className="hero" style={{ 
        backgroundImage: `url(${content.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            {content.heroTitle}
          </h1>
          <p style={{ fontSize: '1.5rem' }}>{content.heroSubtitle}</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
          {content.storyTitle}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <Image
              src={content.storyImage}
              alt={content.storyTitle}
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              unoptimized
            />
          </div>
          <div>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: validLocale === 'ar' ? 'right' : 'left' }}>
              {content.storyContent}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="vision" style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="card" style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(15, 28, 42, 0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--gold)' }}>
              {content.missionTitle}
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
              {content.missionContent}
            </p>
          </div>
          <div className="card" style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '20px',
            boxShadow: '0 20px 50px rgba(15, 28, 42, 0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--gold)' }}>
              {content.visionTitle}
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}>
              {content.visionContent}
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          {content.whyChooseTitle}
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(1, 1fr)', 
          gap: '2rem' 
        }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            borderLeft: '4px solid var(--gold)'
          }}>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>✓</h4>
            <p style={{ fontSize: '1.1rem' }}>{content.whyChoosePoint1}</p>
          </div>
        
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--beige)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--dark)' }}>
            {content.valuesTitle}
          </h2>
          <p style={{ fontSize: '1.5rem', lineHeight: '2', color: '#333' }}>
            {content.valuesContent}
          </p>
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
      />
    </FontsProvider>
  );
}
