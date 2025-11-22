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
        headerLogo={settings?.headerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
        isHomePage={false}
      />

      {/* Hero Section */}
      <section className="hero" style={{ 
        paddingTop: '120px',
        paddingBottom: '60px',
        textAlign: 'center',
        fontFamily: settings?.bodyFont 
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          marginBottom: '1rem',
          fontFamily: settings?.headingFont || settings?.primaryFont 
        }}>
          {validLocale === 'ar' ? 'مشاريعنا' : 'Our Projects'}
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          {validLocale === 'ar' 
            ? 'نفخر بتقديم مشاريع استثنائية حول العالم' 
            : 'We are proud to present exceptional projects around the world'}
        </p>
      </section>

      {/* Projects Grid */}
      <section className="projects" style={{ 
        padding: '4rem 2rem',
        fontFamily: settings?.bodyFont 
      }}>
        {projects.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: '#666' 
          }}>
            <p style={{ fontSize: '1.2rem' }}>
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
              >
                <div className="project-image">
                  <Image
                    src={project.image || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
                    alt={project.title}
                    fill
                    style={{
                      objectFit: 'cover'
                    }}
                    unoptimized
                  />
                </div>
                <div className="project-content">
                  {project.category && (
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'var(--gold)',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {project.category}
                    </div>
                  )}
                  <h3 style={{ 
                    fontFamily: settings?.headingFont || settings?.primaryFont
                  }}>
                    {project.title}
                  </h3>
                  <p>
                    {project.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    fontSize: '0.9rem',
                    color: '#999',
                    marginTop: '1rem'
                  }}>
                    {project.location && (
                      <span><PinIcon/> {project.location}</span>
                    )}
                    {project.year && (
                      <span><Calendar/> {project.year}</span>
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

