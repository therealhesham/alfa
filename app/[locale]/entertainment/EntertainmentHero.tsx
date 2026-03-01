'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Star, Clapperboard, Globe, Building2, Award, Layers } from 'lucide-react';

const iconMap: { [key: string]: any } = {
  Sparkles, Star, Clapperboard, Globe, Building2, Award, Layers,
};

interface EntertainmentHeroProps {
  locale: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImages?: string[];
  showStats: boolean;
  stat1Icon: string;
  stat1Number: string;
  stat1Label: string;
  stat2Icon: string;
  stat2Number: string;
  stat2Label: string;
  stat3Icon: string;
  stat3Number: string;
  stat3Label: string;
}

export default function EntertainmentHero({
  locale,
  heroTitle,
  heroSubtitle,
  heroImages,
  showStats,
  stat1Icon, stat1Number, stat1Label,
  stat2Icon, stat2Number, stat2Label,
  stat3Icon, stat3Number, stat3Label,
}: EntertainmentHeroProps) {
  const Stat1Icon = iconMap[stat1Icon] || Sparkles;
  const Stat2Icon = iconMap[stat2Icon] || Star;
  const Stat3Icon = iconMap[stat3Icon] || Clapperboard;

  const images = heroImages?.filter(img => img && img.trim() !== '') || [];
  const hasImages = images.length > 0;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: {
      opacity: 1, scale: 1, rotate: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    },
  };

  return (
    <section style={{
      paddingTop: '160px',
      paddingBottom: '100px',
      textAlign: 'center',
      fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
      background: hasImages
        ? 'none'
        : 'radial-gradient(ellipse at center top, rgba(212, 193, 157, 0.18) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.06) 0%, transparent 50%), #000000',
      position: 'relative',
      overflow: 'hidden',
      minHeight: hasImages ? '80vh' : 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Background Images Carousel */}
      {hasImages && (
        <>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image
                src={images[activeIndex]}
                alt={heroTitle}
                fill
                style={{ objectFit: 'cover' }}
                priority={activeIndex === 0}
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.4) 100%)',
          }} />
        </>
      )}

      {/* Decorative orbs (only when no images) */}
      {!hasImages && (
        <>
          <motion.div
            style={{
              position: 'absolute', top: '10%', left: '5%',
              width: '200px', height: '200px',
              background: 'radial-gradient(circle, rgba(212, 193, 157, 0.2) 0%, transparent 70%)',
              borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            style={{
              position: 'absolute', bottom: '10%', right: '5%',
              width: '250px', height: '250px',
              background: 'radial-gradient(circle, rgba(212, 193, 157, 0.15) 0%, transparent 70%)',
              borderRadius: '50%', filter: 'blur(40px)', zIndex: 0
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 2 }}
      >
        {/* Icon (only when no background images) */}
        {!hasImages && (
          <motion.div variants={iconVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '90px', height: '90px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold) 0%, rgba(212, 193, 157, 0.7) 100%)',
                boxShadow: '0 10px 40px rgba(212, 193, 157, 0.4)',
              }}
            >
              <Clapperboard size={42} color="var(--dark)" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        )}

        <motion.div
          variants={itemVariants}
          style={{
            display: 'inline-block', width: '80px', height: '4px',
            background: 'var(--gold)', marginBottom: '2rem', borderRadius: '2px'
          }}
        />

        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
            fontWeight: 700,
            color: 'var(--gold)',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            textShadow: '0 2px 20px rgba(212, 193, 157, 0.3)'
          }}
        >
          {heroTitle}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            color: 'rgba(212, 193, 157, 0.9)',
            fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
            lineHeight: 1.8,
            maxWidth: '750px',
            margin: '0 auto 2rem',
            opacity: 0.9
          }}
        >
          {heroSubtitle}
        </motion.p>

        {/* Carousel indicators */}
        {hasImages && images.length > 1 && (
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem',
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                style={{
                  width: i === activeIndex ? '2rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '0.25rem',
                  border: 'none',
                  cursor: 'pointer',
                  background: i === activeIndex ? 'var(--gold)' : 'rgba(212, 193, 157, 0.4)',
                  transition: 'all 0.4s ease',
                }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </motion.div>
        )}

        {/* Stats */}
        {showStats && (
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex', justifyContent: 'center', gap: '2.5rem',
              flexWrap: 'wrap', marginTop: '3rem', paddingTop: '2rem',
              borderTop: '1px solid rgba(212, 193, 157, 0.2)'
            }}
          >
            {[
              { Icon: Stat1Icon, num: stat1Number, label: stat1Label },
              { Icon: Stat2Icon, num: stat2Number, label: stat2Label },
              { Icon: Stat3Icon, num: stat3Number, label: stat3Label },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, y: -5 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: 'rgba(212, 193, 157, 0.9)',
                  fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                  cursor: 'default'
                }}
              >
                <stat.Icon size={20} style={{ color: 'var(--gold)' }} />
                <span style={{ fontSize: '0.95rem' }}>{stat.num} {stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
