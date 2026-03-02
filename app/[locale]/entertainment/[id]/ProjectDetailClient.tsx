'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  MapPin, Calendar, ArrowRight, ArrowLeft, X,
  ChevronLeft, ChevronRight, Sparkles, Tag, Clock,
  Sliders,
  SlidersHorizontal
} from 'lucide-react';

interface GalleryImage {
  image: string;
  caption: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  category: string;
  location: string;
  year: string;
  status: string;
  gallery: GalleryImage[];
}

interface ProjectDetailClientProps {
  project: Project;
  locale: string;
}

export default function ProjectDetailClient({ project, locale }: ProjectDetailClientProps) {
  const isAr = locale === 'ar';
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages = [{ image: project.image, caption: project.title }, ...project.gallery];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const navigateLightbox = (direction: number) => {
    if (lightboxIndex === null) return;
    const newIndex = (lightboxIndex + direction + allImages.length) % allImages.length;
    setLightboxIndex(newIndex);
  };

  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <>
      {/* Hero Section with Cover Image */}
      <section style={{
        position: 'relative', minHeight: '85vh', display: 'flex',
        alignItems: 'flex-end', overflow: 'hidden',
        paddingTop: '120px',
        fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
      }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
            priority
            unoptimized
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.25) 100%)'
          }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            position: 'relative', zIndex: 1, width: '100%',
            maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 5rem'
          }}
        >
          {/* Back Link */}
          <Link
            href={`/${locale}/entertainment`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              color: 'var(--gold)', textDecoration: 'none', fontSize: '0.9rem',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
              marginBottom: '2rem', opacity: 0.8, transition: 'opacity 0.3s'
            }}
            className="entertainment-back-link"
          >
            <BackIcon size={18} />
            {isAr ? 'العودة لعالم الترفيه' : 'Back to Entertainment'}
          </Link>

          {/* Category & Status */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span style={{
              background: 'rgba(212, 193, 157, 0.15)', border: '1px solid rgba(212, 193, 157, 0.3)',
              padding: '0.35rem 1rem', borderRadius: '50px', fontSize: '0.8rem',
              color: 'var(--gold)', fontWeight: 600
            }}>
              {project.category}
            </span>
            <span style={{
              background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)',
              padding: '0.35rem 1rem', borderRadius: '50px', fontSize: '0.8rem',
              color: 'rgb(134, 239, 172)', fontWeight: 600
            }}>
              {project.status}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700,
            color: 'var(--gold)', marginBottom: '1rem', lineHeight: 1.2,
            textShadow: '0 2px 20px rgba(212, 193, 157, 0.3)',
            fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
          }}>
            {project.title}
          </h1>

          <div style={{
            display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center',
            color: 'rgba(212, 193, 157, 0.8)', fontSize: '0.95rem',
            fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} style={{ color: 'var(--gold)' }} />
              <span>{project.location}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--gold)' }} />
              <span>{project.year}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Description Section */}
      <section style={{
        padding: '5rem 2rem',
        background: 'radial-gradient(ellipse at center top, rgba(212, 193, 157, 0.12) 0%, transparent 60%), #000000',
        fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: '900px', margin: '0 auto' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem'
          }}>
<SlidersHorizontal size={24} style={{ color: 'var(--gold)' }} />
            {/* <Sparkles size={24} style={{ color: 'var(--gold)' }} /> */}
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700,
              color: 'var(--gold)', margin: 0
            }}>
              {isAr ? 'عن المشروع' : 'About the Project'}
            </h2>
          </div>

          <p style={{
            fontSize: '1.1rem', lineHeight: 2, color: 'rgba(212, 193, 157, 0.85)',
            marginBottom: '2.5rem'
          }}>
            {project.fullDescription}
          </p>

          {/* Info Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { icon: Tag, label: isAr ? 'الفئة' : 'Category', value: project.category },
              { icon: MapPin, label: isAr ? 'الموقع' : 'Location', value: project.location },
              { icon: Calendar, label: isAr ? 'السنة' : 'Year', value: project.year },
              { icon: Clock, label: isAr ? 'الحالة' : 'Status', value: project.status },
            ].map((info, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  background: 'rgba(15, 28, 42, 0.5)',
                  border: '1px solid rgba(212, 193, 157, 0.15)',
                  borderRadius: '12px', padding: '1.25rem',
                  textAlign: 'center'
                }}
              >
                <info.icon size={22} style={{ color: 'var(--gold)', marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.75rem', color: 'rgba(212, 193, 157, 0.5)', marginBottom: '0.25rem' }}>
                  {info.label}
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--gold)', fontWeight: 600 }}>
                  {info.value}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section style={{
        padding: '5rem 2rem',
        background: 'radial-gradient(ellipse at center bottom, rgba(212, 193, 157, 0.1) 0%, transparent 60%), #000000',
        fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700,
              color: 'var(--gold)', marginBottom: '0.75rem',
              textShadow: '0 2px 20px rgba(212, 193, 157, 0.3)'
            }}>
              {isAr ? 'معرض الصور' : 'Photo Gallery'}
            </h2>
            <p style={{
              fontSize: '1rem', color: 'rgba(212, 193, 157, 0.6)', maxWidth: '500px', margin: '0 auto'
            }}>
              {isAr ? 'استكشف تفاصيل المشروع من خلال معرض الصور' : 'Explore project details through the photo gallery'}
            </p>
          </motion.div>

          <div className="entertainment-detail-gallery">
            {allImages.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`entertainment-gallery-item ${index === 0 ? 'entertainment-gallery-featured' : ''}`}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={img.image}
                  alt={img.caption}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  unoptimized
                />
                <div className="entertainment-gallery-overlay">
                  <p style={{
                    color: '#fff', fontSize: '0.9rem', textAlign: 'center',
                    padding: '0 1rem', lineHeight: 1.6, maxWidth: '90%'
                  }}>
                    {img.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
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
              style={{ position: 'relative', width: '100%', maxWidth: '950px', aspectRatio: '16/10' }}
            >
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden' }}
              >
                <Image
                  src={allImages[lightboxIndex]?.image || ''}
                  alt={allImages[lightboxIndex]?.caption || ''}
                  fill
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </motion.div>

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

            <motion.p
              key={`caption-${lightboxIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: 'rgba(212, 193, 157, 0.9)', fontSize: '1.05rem',
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                textAlign: 'center', marginTop: '1.5rem', maxWidth: '700px', lineHeight: 1.7
              }}
            >
              {allImages[lightboxIndex]?.caption}
            </motion.p>

            <p style={{
              color: 'rgba(212, 193, 157, 0.5)', fontSize: '0.85rem', marginTop: '0.5rem'
            }}>
              {lightboxIndex + 1} / {allImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
