"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getTranslations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n";

interface AboutUsContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  storyTitle: string;
  storyContent: string;
  storyImage: string;
  missionTitle: string;
  missionContent: string;
  visionTitle: string;
  visionContent: string;
  whyChooseTitle: string;
  whyChoosePoint1: string;
  whyChoosePoint2: string;
  whyChoosePoint3: string;
  whyChoosePoint4: string;
  valuesTitle: string;
  valuesContent: string;
  milestone1Year: string;
  milestone1Title: string;
  milestone1Desc: string;
  milestone2Year: string;
  milestone2Title: string;
  milestone2Desc: string;
  milestone3Year: string;
  milestone3Title: string;
  milestone3Desc: string;
  milestone4Year: string;
  milestone4Title: string;
  milestone4Desc: string;
  foundersTitle: string;
  founder1Name: string;
  founder1Position: string;
  founder1Image: string;
  founder1Bio: string;
  founder2Name: string;
  founder2Position: string;
  founder2Image: string;
  founder2Bio: string;
}

interface SiteSettings {
  id: string;
  primaryFont: string;
  headingFont: string;
  bodyFont: string;
  showHome: boolean;
  showAbout: boolean;
  showServices: boolean;
  showProjects: boolean;
  showContact: boolean;
  showLanguageSwitcher: boolean;
}

export default function AboutUsPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const t = getTranslations(locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [content, setContent] = useState<AboutUsContent | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
    fetchSettings();
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchContent();
        fetchSettings();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [locale]);

  useEffect(() => {
    if (settings) {
      applyFonts();
    }
  }, [settings]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/about-us?locale=${locale}`);
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/site-settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const applyFonts = () => {
    if (!settings) return;
    
    const root = document.documentElement;
    root.style.setProperty('--primary-font', settings.primaryFont);
    root.style.setProperty('--heading-font', settings.headingFont);
    root.style.setProperty('--body-font', settings.bodyFont);
    
    document.body.style.fontFamily = settings.bodyFont;
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{locale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{locale === "ar" ? "حدث خطأ في تحميل المحتوى" : "Error loading content"}</p>
      </div>
    );
  }

  return (
    <>
      <header className={isMenuOpen ? "menu-active" : ""}>
        <Image
          src="https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"
          alt={t.common.logoAlt}
          width={75}
          height={75}
          className="logo"
          unoptimized
        />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={t.common.menuLabel}
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {isMenuOpen && (
          <div
            className="menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        <nav className={isMenuOpen ? "nav-open" : ""}>
          {settings?.showHome !== false && (
            <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
              {t.nav.home}
            </Link>
          )}
          {settings?.showAbout !== false && (
            <Link href={`/${locale}/about-us`} onClick={() => setIsMenuOpen(false)}>
              {t.nav.about}
            </Link>
          )}
          {settings?.showServices !== false && (
            <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
              {t.nav.services}
            </Link>
          )}
          {settings?.showProjects !== false && (
            <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
              {t.nav.projects}
            </Link>
          )}
          {settings?.showContact !== false && (
            <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
              {t.nav.contact}
            </Link>
          )}
          {settings?.showLanguageSwitcher !== false && (
            <LanguageSwitcher currentLocale={locale} />
          )}
        </nav>
      </header>

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
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', textAlign: locale === 'ar' ? 'right' : 'left' }}>
              {content.storyContent}
            </p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
            {content.foundersTitle}
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '3rem',
            justifyContent: 'center'
          }}>
            {/* Founder 1 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                overflow: 'hidden',
                border: '4px solid #0070f3',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              }}>
                <Image
                  src={content.founder1Image || '/capture.png'}
                  alt={content.founder1Name}
                  width={200}
                  height={200}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  unoptimized
                />
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#333' }}>
                {content.founder1Name}
              </h3>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#0070f3', 
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                {content.founder1Position}
              </p>
              <p style={{ 
                fontSize: '1rem', 
                color: '#666', 
                lineHeight: '1.6',
                textAlign: locale === 'ar' ? 'right' : 'left'
              }}>
                {content.founder1Bio}
              </p>
            </div>

            {/* Founder 2 */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                overflow: 'hidden',
                border: '4px solid #0070f3',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              }}>
                <Image
                  src={content.founder2Image || '/capture.png'}
                  alt={content.founder2Name}
                  width={200}
                  height={200}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  unoptimized
                />
              </div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#333' }}>
                {content.founder2Name}
              </h3>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#0070f3', 
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                {content.founder2Position}
              </p>
              <p style={{ 
                fontSize: '1rem', 
                color: '#666', 
                lineHeight: '1.6',
                textAlign: locale === 'ar' ? 'right' : 'left'
              }}>
                {content.founder2Bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="vision" style={{ padding: '4rem 2rem', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="card" style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0070f3' }}>
              {content.missionTitle}
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              {content.missionContent}
            </p>
          </div>
          <div className="card" style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#0070f3' }}>
              {content.visionTitle}
            </h3>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
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
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '2rem' 
        }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            borderLeft: '4px solid #0070f3'
          }}>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>✓</h4>
            <p style={{ fontSize: '1.1rem' }}>{content.whyChoosePoint1}</p>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            borderLeft: '4px solid #0070f3'
          }}>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>✓</h4>
            <p style={{ fontSize: '1.1rem' }}>{content.whyChoosePoint2}</p>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            borderLeft: '4px solid #0070f3'
          }}>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>✓</h4>
            <p style={{ fontSize: '1.1rem' }}>{content.whyChoosePoint3}</p>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            borderLeft: '4px solid #0070f3'
          }}>
            <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>✓</h4>
            <p style={{ fontSize: '1.1rem' }}>{content.whyChoosePoint4}</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
            {content.valuesTitle}
          </h2>
          <p style={{ fontSize: '1.5rem', lineHeight: '2', color: '#666' }}>
            {content.valuesContent}
          </p>
        </div>
      </section>

      {/* Timeline/Milestones Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          {locale === 'ar' ? 'محطاتنا المهمة' : 'Our Milestones'}
        </h2>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem',
          position: 'relative',
          paddingLeft: locale === 'ar' ? '0' : '2rem',
          paddingRight: locale === 'ar' ? '2rem' : '0'
        }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute',
            [locale === 'ar' ? 'right' : 'left']: '0',
            top: '0',
            bottom: '0',
            width: '3px',
            backgroundColor: '#0070f3',
          }}></div>
          
          {/* Milestone 1 */}
          <div style={{ 
            position: 'relative',
            paddingLeft: locale === 'ar' ? '0' : '3rem',
            paddingRight: locale === 'ar' ? '3rem' : '0',
          }}>
            <div style={{
              position: 'absolute',
              [locale === 'ar' ? 'right' : 'left']: '-8px',
              top: '0',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#0070f3',
              border: '3px solid white',
              boxShadow: '0 0 0 3px #0070f3',
            }}></div>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3', marginBottom: '0.5rem' }}>
                {content.milestone1Year}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {content.milestone1Title}
              </h3>
              <p style={{ color: '#666' }}>{content.milestone1Desc}</p>
            </div>
          </div>

          {/* Milestone 2 */}
          <div style={{ 
            position: 'relative',
            paddingLeft: locale === 'ar' ? '0' : '3rem',
            paddingRight: locale === 'ar' ? '3rem' : '0',
          }}>
            <div style={{
              position: 'absolute',
              [locale === 'ar' ? 'right' : 'left']: '-8px',
              top: '0',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#0070f3',
              border: '3px solid white',
              boxShadow: '0 0 0 3px #0070f3',
            }}></div>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3', marginBottom: '0.5rem' }}>
                {content.milestone2Year}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {content.milestone2Title}
              </h3>
              <p style={{ color: '#666' }}>{content.milestone2Desc}</p>
            </div>
          </div>

          {/* Milestone 3 */}
          <div style={{ 
            position: 'relative',
            paddingLeft: locale === 'ar' ? '0' : '3rem',
            paddingRight: locale === 'ar' ? '3rem' : '0',
          }}>
            <div style={{
              position: 'absolute',
              [locale === 'ar' ? 'right' : 'left']: '-8px',
              top: '0',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#0070f3',
              border: '3px solid white',
              boxShadow: '0 0 0 3px #0070f3',
            }}></div>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3', marginBottom: '0.5rem' }}>
                {content.milestone3Year}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {content.milestone3Title}
              </h3>
              <p style={{ color: '#666' }}>{content.milestone3Desc}</p>
            </div>
          </div>

          {/* Milestone 4 */}
          <div style={{ 
            position: 'relative',
            paddingLeft: locale === 'ar' ? '0' : '3rem',
            paddingRight: locale === 'ar' ? '3rem' : '0',
          }}>
            <div style={{
              position: 'absolute',
              [locale === 'ar' ? 'right' : 'left']: '-8px',
              top: '0',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#0070f3',
              border: '3px solid white',
              boxShadow: '0 0 0 3px #0070f3',
            }}></div>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3', marginBottom: '0.5rem' }}>
                {content.milestone4Year}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {content.milestone4Title}
              </h3>
              <p style={{ color: '#666' }}>{content.milestone4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <Image
          src="https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"
          alt={t.common.logoAlt}
          width={80}
          height={80}
          unoptimized
        />
        <p>{locale === "ar" ? "© 2025 اسم الشركة – جميع الحقوق محفوظة" : "© 2025 Company Name – All Rights Reserved"}</p>
      </footer>
    </>
  );
}

