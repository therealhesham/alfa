import Image from "next/image";
import { getSiteSettings, getFooterContent } from "@/lib/data";
import { getTranslations } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
import type { Locale } from "@/i18n";
import { Calendar, PinIcon } from "lucide-react";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface OurProjectsPageProps {
  params: Promise<{ locale: string }>;
}

async function getProjects(locale: Locale) {
  try {
    const { prisma } = await import('@/lib/prisma');
    const projects = await prisma.project.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    
    // Map projects based on locale
    return projects.map((project) => {
      if (locale === 'en') {
        return {
          id: project.id,
          title: project.titleEn || project.title,
          description: project.descriptionEn || project.description,
          image: project.image,
          location: project.locationEn || project.location,
          category: project.categoryEn || project.category,
          year: project.year,
          order: project.order,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      }
      
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image,
        location: project.location,
        category: project.category,
        year: project.year,
        order: project.order,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function OurProjectsPage({ params }: OurProjectsPageProps) {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);

  // Fetch data in parallel
  const [projects, settings, footerContent] = await Promise.all([
    getProjects(validLocale),
    getSiteSettings(),
    getFooterContent(validLocale),
  ]);

  return (
    <FontsProvider settings={settings}>
      <Header 
        locale={validLocale} 
        settings={settings} 
        headerLogo="https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"
        isHomePage={false}
      />

      {/* Hero Section */}
      <section className="hero-projects" style={{ 
        paddingTop: '140px',
        paddingBottom: '80px',
        textAlign: 'center',
        fontFamily: settings?.bodyFont,
        background: 'linear-gradient(135deg, rgba(250, 247, 242, 0.95) 0%, rgba(232, 217, 192, 0.85) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-block',
            width: '80px',
            height: '4px',
            background: 'var(--gold)',
            marginBottom: '2rem',
            borderRadius: '2px'
          }} />
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', 
            marginBottom: '1.5rem',
            fontFamily: settings?.headingFont || settings?.primaryFont,
            fontWeight: 700,
            color: 'var(--dark)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em'
          }}>
            {validLocale === 'ar' ? 'مشاريعنا' : 'Our Projects'}
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', 
            color: '#555',
            fontFamily: settings?.bodyFont,
            lineHeight: 1.8,
            maxWidth: '700px',
            margin: '0 auto',
            opacity: 0.9
          }}>
            {validLocale === 'ar' 
              ? 'نفخر بتقديم مشاريع استثنائية حول العالم' 
              : 'We are proud to present exceptional projects around the world'}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="projects" style={{ 
        padding: '5rem 2rem',
        fontFamily: settings?.bodyFont,
        background: 'var(--light)'
      }}>
        {projects.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '5rem 2rem',
            color: '#666' 
          }}>
            <p style={{ 
              fontSize: '1.2rem',
              fontFamily: settings?.bodyFont,
              opacity: 0.8
            }}>
              {validLocale === 'ar' 
                ? 'لا توجد مشاريع متاحة حالياً' 
                : 'No projects available at the moment'}
            </p>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project: any) => (
              <div 
                key={project.id}
                className="project-card"
                style={{
                  position: 'relative'
                }}
              >
                <div className="project-image" style={{
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={project.image || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
                    alt={project.title}
                    fill
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    unoptimized
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(15, 28, 42, 0.1) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease'
                  }} className="project-overlay" />
                </div>
                <div className="project-content" style={{
                  padding: '2rem'
                }}>
                  {project.category && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--gold)',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontFamily: settings?.bodyFont
                    }}>
                      {project.category}
                    </div>
                  )}
                  <h3 style={{ 
                    fontFamily: settings?.headingFont || settings?.primaryFont,
                    fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
                    fontWeight: 700,
                    color: 'var(--dark)',
                    marginBottom: '1rem',
                    lineHeight: 1.3,
                    letterSpacing: '-0.01em'
                  }}>
                    {project.title}
                  </h3>
                  <p style={{ 
                    fontFamily: settings?.bodyFont,
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: '#555',
                    marginBottom: '1.5rem',
                    opacity: 0.9
                  }}>
                    {project.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid rgba(15, 28, 42, 0.08)'
                  }}>
                    {project.location && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        color: '#666',
                        fontFamily: settings?.bodyFont
                      }}>
                        <PinIcon size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <span>{project.location}</span>
                      </div>
                    )}
                    {project.year && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        color: '#666',
                        fontFamily: settings?.bodyFont
                      }}>
                        <Calendar size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                        <span>{project.year}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

