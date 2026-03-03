'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (variant !== 'main' || !images?.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [variant, images?.length]);

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
        .bb-main-gallery-item:hover .bb-gallery-overlay { opacity: 1; }
        .bb-main-gallery-item:hover img { transform: scale(1.08); }
      `}</style>
      {variant === 'main' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem 0' }}>
          <div
            className="bb-main-gallery-item"
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              maxHeight: '70vh',
              borderRadius: '2rem',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 191, 255, 0.15)',
              border: '6px solid #ffffff'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ position: 'absolute', inset: 0, cursor: 'zoom-in' }}
                onClick={() => open(currentSlide)}
              >
                <Image
                  src={images[currentSlide]?.image}
                  alt={images[currentSlide]?.caption || ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
                {images[currentSlide]?.caption && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    padding: '3rem 2rem 1.5rem',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                  }}>
                    {images[currentSlide].caption}
                  </div>
                )}
                <div
                  className="bb-gallery-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(255, 20, 147, 0.3) 0%, rgba(0, 191, 255, 0.1) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{
                    background: 'rgba(255,255,255,0.9)',
                    padding: '1rem',
                    borderRadius: '50%',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'scale(0.8)',
                    transition: 'transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275)'
                  }}>
                    <ZoomIn color="#FF1493" size={32} strokeWidth={2.5} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => (prev - 1 + images.length) % images.length); }}
                  style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={24} color="#1f2937" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentSlide(prev => (prev + 1) % images.length); }}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  aria-label="Next slide"
                >
                  <ChevronRight size={24} color="#1f2937" />
                </button>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                style={{
                  position: 'relative',
                  width: thumbnailSize || 80,
                  height: thumbnailSize || 80,
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  border: currentSlide === i ? '4px solid #FF1493' : '4px solid #fff',
                  boxShadow: currentSlide === i ? '0 8px 16px rgba(255,20,147,0.3)' : '0 4px 10px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  opacity: currentSlide === i ? 1 : 0.6,
                  transform: currentSlide === i ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.175,0.885,0.32,1.275)',
                  flexShrink: 0
                }}
              >
                <Image src={img.image} alt={img.caption || ''} fill style={{ objectFit: 'cover' }} unoptimized />
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
