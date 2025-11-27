'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Building2, Globe, Award, Sparkles, Layers } from 'lucide-react';

const iconMap: { [key: string]: any } = {
  Globe,
  Building2,
  Award,
  Layers,
  Sparkles,
};

interface HeroSectionProps {
  heroLogo: string;
  heroTitle: string;
  heroSubtitle: string;
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
  settings: any;
  locale: string;
}

export default function HeroSection({
  heroLogo,
  heroTitle,
  heroSubtitle,
  showStats,
  stat1Icon,
  stat1Number,
  stat1Label,
  stat2Icon,
  stat2Number,
  stat2Label,
  stat3Icon,
  stat3Number,
  stat3Label,
  settings,
  locale,
}: HeroSectionProps) {
  const Stat1Icon = iconMap[stat1Icon] || Globe;
  const Stat2Icon = iconMap[stat2Icon] || Building2;
  const Stat3Icon = iconMap[stat3Icon] || Award;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section className="hero-projects" style={{ 
      paddingTop: '140px',
      paddingBottom: '100px',
      textAlign: 'center',
      fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
      background: 'radial-gradient(ellipse at center top, rgba(212, 193, 157, 0.15) 0%, transparent 60%), radial-gradient(ellipse at center bottom, rgba(232, 217, 192, 0.12) 0%, transparent 60%), #000000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      <motion.div 
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(212, 193, 157, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div 
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(212, 193, 157, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          zIndex: 0
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Logo */}
        <motion.div 
          variants={logoVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2.5rem'
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={heroLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
              alt={locale === 'ar' ? 'شعار الشركة' : 'Company Logo'}
              width={90}
              height={90}
              style={{
                objectFit: 'contain'
              }}
              unoptimized
            />
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          style={{
            display: 'inline-block',
            width: '80px',
            height: '4px',
            background: 'var(--gold)',
            marginBottom: '2rem',
            borderRadius: '2px'
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
            maxWidth: '700px',
            margin: '0 auto 2rem',
            opacity: 0.9
          }}
        >
          {heroSubtitle}
        </motion.p>

        {/* Quick Stats */}
        {showStats !== false && (
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(212, 193, 157, 0.2)'
            }}
          >
            <motion.div
              custom={0}
              variants={statsVariants}
              whileHover={{ scale: 1.1, y: -5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(212, 193, 157, 0.9)',
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                cursor: 'default'
              }}
            >
              <Stat1Icon size={20} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.95rem' }}>
                {stat1Number} {stat1Label}
              </span>
            </motion.div>
            <motion.div
              custom={1}
              variants={statsVariants}
              whileHover={{ scale: 1.1, y: -5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(212, 193, 157, 0.9)',
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                cursor: 'default'
              }}
            >
              <Stat2Icon size={20} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.95rem' }}>
                {stat2Number} {stat2Label}
              </span>
            </motion.div>
            <motion.div
              custom={2}
              variants={statsVariants}
              whileHover={{ scale: 1.1, y: -5 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(212, 193, 157, 0.9)',
                fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                cursor: 'default'
              }}
            >
              <Stat3Icon size={20} style={{ color: 'var(--gold)' }} />
              <span style={{ fontSize: '0.95rem' }}>
                {stat3Number} {stat3Label}
              </span>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

