'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, ArrowRight, ArrowLeft, Sparkles, X, ChevronLeft, ChevronRight, PartyPopper, Sliders } from 'lucide-react';

const BOMBOM_CARD_IMAGE =
  "/logo.jpg";

interface GalleryImage {
  image: string;
  caption: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  location: string;
  year: string;
  status: string;
  gallery: GalleryImage[];
}

interface PageContent {
  sectionTitle: string;
  sectionSubtitle: string;
  emptyMessage: string;
  showBombom?: boolean;
}

interface EntertainmentClientProps {
  projects: Project[];
  locale: string;
  pageContent?: PageContent;
}

export default function EntertainmentClient({ projects, locale, pageContent }: EntertainmentClientProps) {
  const isAr = locale === 'ar';
  const [lightbox, setLightbox] = useState<{ projectId: string; imageIndex: number } | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>({});

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const openLightbox = (projectId: string, imageIndex: number) => {
    setLightbox({ projectId, imageIndex });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(null);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction: number) => {
    if (!lightbox) return;
    const project = projects.find(p => p.id === lightbox.projectId);
    if (!project) return;
    const allImages = [{ image: project.image, caption: project.title }, ...project.gallery];
    const newIndex = (lightbox.imageIndex + direction + allImages.length) % allImages.length;
    setLightbox({ ...lightbox, imageIndex: newIndex });
  };

  // Auto-rotate project images (mini carousel inside each card)
  useEffect(() => {
    if (!projects.length) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) => {
        const next: Record<string, number> = { ...prev };

        projects.forEach((project) => {
          const total = 1 + (project.gallery?.length || 0);
          if (total <= 1) {
            next[project.id] = 0;
            return;
          }
          const current = prev[project.id] ?? 0;
          next[project.id] = (current + 1) % total;
        });

        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [projects]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1, y: 0, scale: 1,
      transition: { delay: i * 0.15, duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    }),
  };

  const currentProject = lightbox ? projects.find(p => p.id === lightbox.projectId) : null;
  const currentAllImages = currentProject
    ? [{ image: currentProject.image, caption: currentProject.title }, ...currentProject.gallery]
    : [];

  return (
    <>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
          background: 'rgba(212, 193, 157, 0.1)', border: '1px solid rgba(212, 193, 157, 0.2)',
          padding: '0.5rem 1.5rem', borderRadius: '50px', marginBottom: '1.5rem'
        }}>
          <Sliders size={18} style={{ color: 'var(--gold)' }} />
          <span style={{
            color: 'var(--gold)', fontSize: '0.9rem',
            fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
          }}>
            {pageContent?.sectionTitle || (isAr ? 'مشاريعنا الترفيهية' : 'Our Entertainment Projects')}
          </span>
        </div>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
          fontWeight: 700, color: 'var(--gold)', marginBottom: '1rem',
          textShadow: '0 2px 20px rgba(212, 193, 157, 0.3)'
        }}>
          {pageContent?.sectionTitle || (isAr ? 'تجارب ترفيهية لا تُنسى' : 'Unforgettable Entertainment Experiences')}
        </h2>
        <p style={{
          fontSize: '1.1rem', color: 'rgba(212, 193, 157, 0.7)',
          fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
          maxWidth: '600px', margin: '0 auto', lineHeight: 1.8
        }}>
          {pageContent?.sectionSubtitle || (isAr
            ? 'اكتشف مجموعة مشاريعنا الترفيهية المتنوعة التي تلبي جميع الأذواق'
            : 'Explore our diverse entertainment projects that cater to all tastes')}
        </p>
      </motion.div>

      {/* Projects Grid */}
      <div className="entertainment-grid">
        {projects.map((project, index) => {
          const allImages = [{ image: project.image, caption: project.title }, ...(project.gallery || [])];
          const activeIndex = carouselIndex[project.id] ?? 0;
          const activeImage = allImages[activeIndex] || allImages[0];

          return (
            <motion.div
              key={project.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="entertainment-card"
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {/* Main Image as auto carousel */}
              <div
                className="entertainment-card-image"
                onClick={() => openLightbox(project.id, activeIndex)}
                style={{ cursor: 'pointer' }}
              >
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{ position: 'relative', width: '100%', height: '100%' }}
                >
                  <Image
                    src={activeImage?.image || project.image}
                    alt={activeImage?.caption || project.title}
                    fill
                    style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    unoptimized
                  />
                  <div className="entertainment-card-overlay" />
                </motion.div>

                {/* Small position dots */}
                {allImages.length > 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.9rem',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '0.35rem',
                      zIndex: 3,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {allImages.map((_, dotIndex) => (
                      <button
                        key={dotIndex}
                        type="button"
                        onClick={() => {
                          setCarouselIndex((prev) => ({
                            ...prev,
                            [project.id]: dotIndex,
                          }));
                        }}
                        style={{
                          width: dotIndex === activeIndex ? 10 : 7,
                          height: dotIndex === activeIndex ? 10 : 7,
                          borderRadius: '999px',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          background:
                            dotIndex === activeIndex ? 'var(--gold)' : 'rgba(212, 193, 157, 0.4)',
                          opacity: dotIndex === activeIndex ? 1 : 0.7,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content + button area, fills height */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem 2rem 2rem' }}>
                <div style={{
                  fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700,
                  marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px',
                  fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
                }}>
                  {project.category}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                  fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', fontWeight: 700,
                  color: 'var(--gold)', marginBottom: '0.75rem', lineHeight: 1.3
                }}>
                  {project.title}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                  fontSize: '0.95rem', lineHeight: 1.7,
                  color: 'rgba(212, 193, 157, 0.75)', marginBottom: '1rem',
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                }}>
                  {project.description}
                </p>
                <div style={{
                  display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center',
                  marginBottom: '1.25rem', fontSize: '0.85rem', color: 'rgba(212, 193, 157, 0.7)',
                  fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} style={{ color: 'var(--gold)' }} />
                    <span>{project.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={14} style={{ color: 'var(--gold)' }} />
                    <span>{project.year}</span>
                  </div>
                </div>

                {/* View Details Button pinned to bottom */}
                <div style={{ marginTop: 'auto' }}>
                  <Link
                    href={`/${locale}/entertainment/${project.id}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      width: '100%', padding: '0.9rem 1.5rem',
                      background: 'linear-gradient(135deg, var(--gold) 0%, rgba(212, 193, 157, 0.85) 100%)',
                      color: 'var(--dark)', fontWeight: 700, fontSize: '0.95rem',
                      borderRadius: '10px', textDecoration: 'none',
                      fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(212, 193, 157, 0.3)'
                    }}
                    className="entertainment-details-btn"
                  >
                    {isAr ? 'عرض التفاصيل' : 'View Details'}
                    <ArrowIcon size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Bom Bom Play Kid — static page card */}
        {pageContent?.showBombom && (
          <motion.div
            custom={projects.length}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="entertainment-card"
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div
              className="entertainment-card-image"
              style={{ cursor: 'pointer' }}
            >
              <Image
                src={BOMBOM_CARD_IMAGE}
                alt={isAr ? 'بوم بوم بلاي كيد' : 'Bom Bom Play Kid'}
                fill
                style={{ objectFit: 'cover', transform: 'scale(1.02)' }}
                unoptimized
              />
              <div
                className="entertainment-card-overlay"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
              />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.5rem 2rem 2rem' }}>
              <div style={{
                fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700,
                marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px',
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
              }}>
                {isAr ? 'مركز ترفيهي' : 'Entertainment Center'}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                fontSize: 'clamp(1.3rem, 3vw, 1.7rem)', fontWeight: 700,
                color: 'var(--gold)', marginBottom: '0.75rem', lineHeight: 1.3
              }}>
                {isAr ? 'بوم بوم بلاي كيد' : 'Bom Bom Play Kid'}
              </h3>
              <p style={{
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                fontSize: '0.95rem', lineHeight: 1.7,
                color: 'rgba(212, 193, 157, 0.75)', marginBottom: '1rem',
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {isAr
                  ? 'عالم من المرح والمغامرة للأطفال! مناطق لعب متنوعة، قلاع قفز، تزحلق، وركن الأذكياء مع باقات أعياد ميلاد مميزة.'
                  : 'A world of fun and adventure for kids! Diverse play zones, jump castles, skating, smart corners, and special birthday packages.'}
              </p>
              <div style={{
                display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center',
                marginBottom: '1.25rem', fontSize: '0.85rem', color: 'rgba(212, 193, 157, 0.7)',
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} style={{ color: 'var(--gold)' }} />
                  <span>{isAr ? 'المملكة العربية السعودية' : 'Saudi Arabia'}</span>
                </div>
              </div>

              {/* Bom Bom button aligned with others */}
              <div style={{ marginTop: 'auto' }}>
                <Link
                  href={`/${locale}/entertainment/bombom`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    width: '100%', padding: '0.9rem 1.5rem',
                    background: 'linear-gradient(135deg, #FF1493 0%, #00BFFF 100%)',
                    color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                    borderRadius: '10px', textDecoration: 'none',
                    fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(255, 20, 147, 0.3)'
                  }}
                  className="entertainment-details-btn"
                >
                  {isAr ? 'اكتشف عالم بوم بوم' : 'Explore Bom Bom World'}
                  <ArrowIcon size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && currentProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', padding: '2rem'
            }}
          >
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem',
                background: 'rgba(212, 193, 157, 0.2)', border: '1px solid rgba(212, 193, 157, 0.3)',
                borderRadius: '50%', width: '48px', height: '48px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 10, color: 'var(--gold)'
              }}
            >
              <X size={24} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', width: '100%', maxWidth: '900px', aspectRatio: '16/10' }}
            >
              <motion.div
                key={lightbox.imageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}
              >
                <Image
                  src={currentAllImages[lightbox.imageIndex]?.image || ''}
                  alt={currentAllImages[lightbox.imageIndex]?.caption || ''}
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </motion.div>

              {/* Nav Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                style={{
                  position: 'absolute', left: '-60px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(212, 193, 157, 0.2)', border: '1px solid rgba(212, 193, 157, 0.3)',
                  borderRadius: '50%', width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--gold)'
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                style={{
                  position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)',
                  background: 'rgba(212, 193, 157, 0.2)', border: '1px solid rgba(212, 193, 157, 0.3)',
                  borderRadius: '50%', width: '48px', height: '48px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--gold)'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Caption */}
            <motion.p
              key={`caption-${lightbox.imageIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: 'rgba(212, 193, 157, 0.9)', fontSize: '1rem',
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                textAlign: 'center', marginTop: '1.5rem', maxWidth: '700px', lineHeight: 1.6
              }}
            >
              {currentAllImages[lightbox.imageIndex]?.caption}
            </motion.p>

            {/* Counter */}
            <p style={{
              color: 'rgba(212, 193, 157, 0.5)', fontSize: '0.85rem', marginTop: '0.5rem'
            }}>
              {lightbox.imageIndex + 1} / {currentAllImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
