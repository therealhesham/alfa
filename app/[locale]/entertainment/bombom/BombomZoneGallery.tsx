'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface BombomZoneGalleryProps {
  images: { image: string; caption: string }[];
  thumbnailSize?: number;
  variant?: 'main' | 'card';
}

export default function BombomZoneGallery({ images, thumbnailSize, variant = 'card' }: BombomZoneGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => setMounted(true), []);

  // Auto-advance carousel
  useEffect(() => {
    if (variant !== 'main' || images.length <= 1 || paused) return;
    intervalRef.current = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [variant, images.length, paused]);

  const close = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxIndex, close]);

  if (!images?.length) return null;

  const open = (i: number) => {
    setLightboxIndex(i);
    document.body.style.overflow = 'hidden';
  };
  const go = (dir: number) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + dir + images.length) % images.length);
  };

  const goCarousel = (dir: number) => {
    setCarouselIndex((prev) => (prev + dir + images.length) % images.length);
  };

  const lightboxContent = lightboxIndex !== null && (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => close()}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(0,0,0,0.92)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          isolation: 'isolate',
        }}
      >
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); close(); }}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
          aria-label="Close"
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          <X size={24} />
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go(-1); }}
          style={{
            position: 'absolute',
            left: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'background 0.2s',
          }}
          aria-label="Previous"
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          <ChevronLeft size={28} />
        </button>
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: 'min(90vw, 1000px)', maxHeight: '85vh' }}>
          <motion.div
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ position: 'relative', width: '100%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
          >
            <img
              src={images[lightboxIndex]?.image || ''}
              alt={images[lightboxIndex]?.caption || ''}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '75vh',
                objectFit: 'contain',
                display: 'block',
                backgroundColor: '#1a1a1a',
              }}
            />
          </motion.div>
          {images[lightboxIndex]?.caption && (
            <p style={{ color: '#fff', fontSize: '1.1rem', textAlign: 'center', marginTop: 16, fontWeight: 500 }}>
              {images[lightboxIndex].caption}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); go(1); }}
          style={{
            position: 'absolute',
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'background 0.2s',
          }}
          aria-label="Next"
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          <ChevronRight size={28} />
        </button>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      <style>{`
        .bb-carousel-hero:hover .bb-carousel-overlay { opacity: 1; }
        .bb-carousel-hero:hover .bb-carousel-hero-img { transform: scale(1.03); }
        .bb-carousel-thumb { transition: all 0.3s ease; }
        .bb-carousel-thumb:hover { transform: translateY(-4px) scale(1.08); }
        .bb-carousel-progress { animation: bbProgress 4s linear; }
        @keyframes bbProgress { from { width: 0%; } to { width: 100%; } }
      `}</style>
      {variant === 'main' ? (
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* ── Auto Carousel (Large Featured Image) ── */}
          <div
            className="bb-carousel-hero"
            onClick={() => open(carouselIndex)}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/7',
              borderRadius: '2.5rem',
              overflow: 'hidden',
              border: '6px solid #ffffff',
              boxShadow: '0 30px 60px rgba(0, 191, 255, 0.15)',
              cursor: 'pointer',
              background: '#f3f4f6',
              marginBottom: '2rem',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <Image
                  className="bb-carousel-hero-img"
                  src={images[carouselIndex]?.image || ''}
                  alt={images[carouselIndex]?.caption || ''}
                  fill
                  style={{ objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' }}
                  sizes="(max-width: 768px) 100vw, 80vw"
                  unoptimized
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />

            {/* Caption */}
            {images[carouselIndex]?.caption && (
              <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '2.5rem',
                right: '2.5rem',
                color: '#fff',
                fontSize: '1.4rem',
                fontWeight: 800,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                zIndex: 2,
              }}>
                {images[carouselIndex].caption}
              </div>
            )}

            {/* Zoom icon overlay */}
            <div
              className="bb-carousel-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(255,20,147,0.25) 0%, rgba(0,191,255,0.08) 100%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
              }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.9)',
                padding: '1.2rem',
                borderRadius: '50%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <ZoomIn color="#FF1493" size={36} strokeWidth={2.5} />
              </div>
            </div>

            {/* Nav arrows */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goCarousel(-1); }}
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.85)',
                border: 'none',
                cursor: 'pointer',
                color: '#FF1493',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s, background 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(-50%)'; }}
              aria-label="Previous"
            >
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goCarousel(1); }}
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.85)',
                border: 'none',
                cursor: 'pointer',
                color: '#FF1493',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                transition: 'transform 0.2s, background 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(-50%)'; }}
              aria-label="Next"
            >
              <ChevronRight size={24} strokeWidth={2.5} />
            </button>

            {/* Progress bar */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.2)', zIndex: 4 }}>
              <div
                key={`progress-${carouselIndex}-${paused}`}
                className={paused ? '' : 'bb-carousel-progress'}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #FF1493, #FFD700)',
                  borderRadius: 2,
                  width: paused ? '0%' : undefined,
                }}
              />
            </div>
          </div>

          {/* ── Thumbnails Strip ── */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            padding: '0.5rem 0',
          }}>
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                className="bb-carousel-thumb"
                onClick={() => setCarouselIndex(i)}
                style={{
                  position: 'relative',
                  width: 100,
                  height: 72,
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  border: carouselIndex === i ? '4px solid #FF1493' : '4px solid #fff',
                  boxShadow: carouselIndex === i
                    ? '0 8px 25px rgba(255,20,147,0.3)'
                    : '0 6px 16px rgba(0,191,255,0.1)',
                  padding: 0,
                  cursor: 'pointer',
                  background: '#f3f4f6',
                  flexShrink: 0,
                  opacity: carouselIndex === i ? 1 : 0.7,
                }}
              >
                <Image
                  src={img.image}
                  alt={img.caption || ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="100px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {images.map((img, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => open(i)}
              whileHover={{ scale: 1.15, y: -6, rotate: (i % 2 === 0 ? 3 : -3) }}
              whileTap={{ scale: 0.9 }}
              style={{
                position: 'relative',
                width: thumbnailSize || 96,
                height: thumbnailSize || 96,
                borderRadius: '1.5rem',
                overflow: 'hidden',
                border: '4px solid #fff',
                boxShadow: '0 10px 20px rgba(0,191,255,0.15)',
                padding: 0,
                cursor: 'pointer',
                background: '#f3f4f6',
                flexShrink: 0,
              }}
            >
              <Image
                src={img.image}
                alt={img.caption || ''}
                fill
                style={{ objectFit: 'cover' }}
                sizes={`${thumbnailSize || 96}px`}
                unoptimized
              />
            </motion.button>
          ))}
        </div>
      )}

      {mounted && lightboxContent && createPortal(lightboxContent, document.body)}
    </>
  );
}
