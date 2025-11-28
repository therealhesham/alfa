'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Home, Layers, Activity, HelpCircle, Calendar, MapPin, Sparkles, Target, Heart } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import type { Locale } from '@/i18n';
import DustParticles from '@/components/DustParticles';

const iconMap: { [key: string]: any } = {
  Home,
  Layers,
  Activity,
  HelpCircle,
};

interface AnimatedHeroProps {
  heroLogo: string;
  heroTitle: string;
  heroSubtitle: string;
  logoAlt: string;
  bodyFont?: string;
  headingFont?: string;
  primaryFont?: string;
}

export function AnimatedHero({ heroLogo, heroTitle, heroSubtitle, logoAlt, bodyFont, headingFont, primaryFont }: AnimatedHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Elegant scroll-based animations
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      id="hero"
      className="hero scroll-snap-section"
      style={{ 
        fontFamily: bodyFont,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        opacity,
        scale,
        y,
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Image
        src="/gemin.png"
        alt="Hero background"
        fill
        className="hero-video"
        style={{ objectFit: 'cover' }}
        priority
        unoptimized
      />
      <div className="hero-overlay"></div>
      <motion.div variants={logoVariants}>
        <Image
          src={heroLogo}
          alt={logoAlt}
          width={300}
          height={300}
          className="hero-logo"
          unoptimized
        />
      </motion.div>
      <motion.h1
        variants={itemVariants}
        style={{ fontFamily: headingFont || primaryFont }}
      >
        {heroTitle}
      </motion.h1>
      <motion.p
        variants={itemVariants}
        style={{ fontFamily: bodyFont }}
      >
        {heroSubtitle}
      </motion.p>
    </motion.section>
  );
}

interface AnimatedAboutProps {
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  readMoreText: string;
  readMoreLink: string;
  bodyFont?: string;
  headingFont?: string;
  primaryFont?: string;
}

export function AnimatedAbout({
  aboutTitle,
  aboutP1,
  aboutP2,
  readMoreText,
  readMoreLink,
  bodyFont,
  headingFont,
  primaryFont,
}: AnimatedAboutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Track scroll progress from about section start to document end
  // This will track from when about section enters viewport until the end of the page
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end end'], // Start tracking when section enters center, end at document end
  });

  // Calculate intensity: starts at 1 (full) and decreases to 0 as you scroll down
  // The intensity decreases gradually from the about section to the footer
  const dustIntensity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1], // Gradual decrease: full at start, start fading at 20%, mostly gone at 80%, zero at end
    [1, 1, 0.3, 0]    // Full intensity until 20%, then fade to 30% at 80%, zero at end
  );

  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    const unsubscribe = dustIntensity.on('change', (latest) => {
      setIntensity(Math.max(0, Math.min(1, latest))); // Clamp between 0 and 1
    });
    return () => unsubscribe();
  }, [dustIntensity]);

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
    hidden: { opacity: 0, x: -100, y: 30 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      id="about"
      className="about scroll-snap-section"
      style={{ 
        fontFamily: bodyFont,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        position: 'relative',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <DustParticles 
        id="about-dust" 
        direction="right" 
        intensity={intensity}
      />
      <motion.h2
        variants={itemVariants}
        style={{ fontFamily: headingFont || primaryFont }}
      >
        {aboutTitle}
      </motion.h2>
      <motion.p
        variants={itemVariants}
        style={{ fontFamily: bodyFont }}
      >
        {aboutP1}
      </motion.p>
      <motion.p
        variants={itemVariants}
        style={{ fontFamily: bodyFont }}
      >
        {aboutP2}
      </motion.p>
      <motion.div
        variants={itemVariants}
        className="about-read-more-container"
        style={{ fontFamily: bodyFont }}
      >
        <Link href={readMoreLink} className="about-read-more-btn" style={{ fontFamily: bodyFont }}>
          {readMoreText}
        </Link>
      </motion.div>
    </motion.section>
  );
}

interface AnimatedVisionProps {
  visionTitle: string;
  visionVision: string;
  visionVisionText: string;
  visionMission: string;
  visionMissionText: string;
  visionValues: string;
  visionValuesText: string;
  bodyFont?: string;
  headingFont?: string;
  primaryFont?: string;
}

export function AnimatedVision({
  visionTitle,
  visionVision,
  visionVisionText,
  visionMission,
  visionMissionText,
  visionValues,
  visionValuesText,
  bodyFont,
  headingFont,
  primaryFont,
}: AnimatedVisionProps) {
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
    hidden: { opacity: 0, x: 100, y: 30 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: (i: number) => ({ 
      opacity: 0, 
      x: i % 2 === 0 ? -100 : 100, 
      y: 50, 
      scale: 0.9 
    }),
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.7,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <motion.section
      id="vision"
      className="vision scroll-snap-section"
      style={{ 
        fontFamily: bodyFont,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        position: 'relative',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <DustParticles id="vision-dust" />
      <motion.h2
        variants={itemVariants}
        style={{ fontFamily: headingFont || primaryFont }}
      >
        {visionTitle}
      </motion.h2>
      <motion.div
        className="cards"
        style={{ fontFamily: bodyFont }}
        variants={containerVariants}
      >
        <motion.div
          className="card"
          custom={0}
          variants={cardVariants}
          whileHover={{ y: -10, scale: 1.02 }}
          style={{ fontFamily: bodyFont }}
        >
          <motion.div
            className="card-icon"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Sparkles size={48} strokeWidth={1.5} />
          </motion.div>
          <h3 style={{ fontFamily: headingFont || primaryFont }}>{visionVision}</h3>
          <p style={{ fontFamily: bodyFont }}>{visionVisionText}</p>
        </motion.div>
        <motion.div
          className="card"
          custom={1}
          variants={cardVariants}
          whileHover={{ y: -10, scale: 1.02 }}
          style={{ fontFamily: bodyFont }}
        >
          <motion.div
            className="card-icon"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Target size={48} strokeWidth={1.5} />
          </motion.div>
          <h3 style={{ fontFamily: headingFont || primaryFont }}>{visionMission}</h3>
          <p style={{ fontFamily: bodyFont }}>{visionMissionText}</p>
        </motion.div>
        <motion.div
          className="card"
          custom={2}
          variants={cardVariants}
          whileHover={{ y: -10, scale: 1.02 }}
          style={{ fontFamily: bodyFont }}
        >
          <motion.div
            className="card-icon"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Heart size={48} strokeWidth={1.5} />
          </motion.div>
          <h3 style={{ fontFamily: headingFont || primaryFont }}>{visionValues}</h3>
          <p style={{ fontFamily: bodyFont }}>{visionValuesText}</p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

interface AnimatedPillarsProps {
  title: string;
  pillars: Array<{ title: string }>;
  bodyFont?: string;
  headingFont?: string;
  primaryFont?: string;
}

export function AnimatedPillars({ title, pillars, bodyFont, headingFont, primaryFont }: AnimatedPillarsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const pillarVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <motion.section
      id="pillars"
      className="pillars-section"
      style={{ fontFamily: bodyFont }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <motion.h2
        className="quote-title"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ fontFamily: headingFont || primaryFont }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="pillars-grid"
        style={{ fontFamily: bodyFont }}
        variants={containerVariants}
      >
        {pillars.map((pillar, index) => (
          <motion.div
            key={index}
            className="pillar-item"
            custom={index}
            variants={pillarVariants}
            whileHover={{ scale: 1.1, y: -5 }}
            style={{ fontFamily: bodyFont }}
          >
            <h3 style={{ fontFamily: headingFont || primaryFont }}>{pillar.title}</h3>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

interface AnimatedQuoteProps {
  title: string;
  text: string;
  author: string;
  bodyFont?: string;
  headingFont?: string;
  primaryFont?: string;
}

export function AnimatedQuote({ title, text, author, bodyFont, headingFont, primaryFont }: AnimatedQuoteProps) {
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
    hidden: { opacity: 0, x: -100, y: 30 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.section
      id="quote"
      className="quote-section scroll-snap-section"
      style={{ 
        fontFamily: bodyFont,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        position: 'relative',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <DustParticles id="quote-dust" />
      <motion.div className="quote-content" style={{ fontFamily: bodyFont }} variants={containerVariants}>
        <motion.h2
          className="quote-title"
          variants={itemVariants}
          style={{ fontFamily: headingFont || primaryFont }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="quote-text"
          variants={itemVariants}
          style={{ fontFamily: bodyFont }}
        >
          {text}
        </motion.p>
        <motion.p
          className="quote-author"
          variants={itemVariants}
          style={{ fontFamily: headingFont || primaryFont }}
        >
          {author}
        </motion.p>
      </motion.div>
    </motion.section>
  );
}

interface AnimatedServicesProps {
  title: string;
  subtitle: string;
  services: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  bodyFont?: string;
  headingFont?: string;
  primaryFont?: string;
}

export function AnimatedServices({
  title,
  subtitle,
  services,
  bodyFont,
  headingFont,
  primaryFont,
}: AnimatedServicesProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 100, y: 30 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: (i: number) => ({ 
      opacity: 0, 
      x: i % 2 === 0 ? -100 : 100, 
      y: 50, 
      scale: 0.9 
    }),
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <motion.section
      id="services"
      className="services scroll-snap-section"
      style={{ 
        fontFamily: bodyFont,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        position: 'relative',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <DustParticles id="services-dust" />
      <motion.h2
        variants={itemVariants}
        style={{ fontFamily: headingFont || primaryFont }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        variants={itemVariants}
        style={{ fontFamily: bodyFont }}
      >
        {subtitle}
      </motion.p>
      <motion.div
        className="services-grid"
        style={{ fontFamily: bodyFont }}
        variants={containerVariants}
      >
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon] || Home;
          return (
            <motion.div
              key={index}
              className="service-card"
              custom={index}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              style={{ fontFamily: bodyFont }}
            >
              <motion.div
                className="service-icon"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <IconComponent size={48} strokeWidth={1.5} />
              </motion.div>
              <h3 style={{ fontFamily: headingFont || primaryFont }}>{service.title}</h3>
              <p style={{ fontFamily: bodyFont }}>{service.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  location?: string | null;
  category?: string | null;
  year?: string | null;
}

interface AnimatedProjectsProps {
  title: string;
  subtitle: string;
  projects: Project[];
  viewMoreText: string;
  viewMoreLink: string;
  bodyFont?: string;
  headingFont?: string;
  primaryFont?: string;
}

export function AnimatedProjects({
  title,
  subtitle,
  projects,
  viewMoreText,
  viewMoreLink,
  bodyFont,
  headingFont,
  primaryFont,
}: AnimatedProjectsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -100, y: 30 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    },
  };

  const cardVariants = {
    hidden: (i: number) => ({ 
      opacity: 0, 
      x: i % 2 === 0 ? -100 : 100, 
      y: 50, 
      scale: 0.9 
    }),
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <motion.section
      id="projects"
      className="projects scroll-snap-section"
      style={{ 
        fontFamily: bodyFont,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        position: 'relative',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <DustParticles id="projects-dust" />
      <motion.h2
        variants={itemVariants}
        style={{ fontFamily: headingFont || primaryFont }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="section-subtitle"
        variants={itemVariants}
        style={{ fontFamily: bodyFont }}
      >
        {subtitle}
      </motion.p>
      <motion.div
        className="projects-grid"
        style={{ fontFamily: bodyFont }}
        variants={containerVariants}
      >
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="project-card"
            custom={index}
            variants={cardVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            style={{ fontFamily: bodyFont }}
          >
            <div className="project-image">
              <Image
                src={project.image || 'https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png'}
                alt={project.title}
                width={400}
                height={300}
                unoptimized
              />
            </div>
            <div className="project-content" style={{ fontFamily: bodyFont }}>
              {project.category && (
                <div
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--gold)',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: bodyFont,
                  }}
                >
                  {project.category}
                </div>
              )}
              <h3 style={{ fontFamily: headingFont || primaryFont }}>{project.title}</h3>
              <p style={{ fontFamily: bodyFont }}>{project.description}</p>
              {(project.location || project.year) && (
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    fontSize: '0.9rem',
                    color: '#999',
                    marginTop: '0.5rem',
                    fontFamily: bodyFont,
                  }}
                >
                  {project.location && (
                    <span style={{ fontFamily: bodyFont, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={16} />
                      {project.location}
                    </span>
                  )}
                  {project.year && (
                    <span style={{ fontFamily: bodyFont }}>
                      <Calendar />
                      {project.year}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="view-more-container"
        variants={itemVariants}
        style={{ fontFamily: bodyFont }}
      >
        <motion.a
          href={viewMoreLink}
          className="view-more-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ fontFamily: bodyFont }}
        >
          {viewMoreText} →
        </motion.a>
      </motion.div>
    </motion.section>
  );
}

interface AnimatedStatsProps {
  title: string;
  stats: Array<{
    number: string;
    label: string;
  }>;
  bodyFont?: string;
  headingFont?: string;
  primaryFont?: string;
}

export function AnimatedStats({ title, stats, bodyFont, headingFont, primaryFont }: AnimatedStatsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 100, y: 30 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    },
  };

  const statVariants = {
    hidden: (i: number) => ({ 
      opacity: 0, 
      x: i % 2 === 0 ? -100 : 100, 
      scale: 0.8, 
      y: 30 
    }),
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.7,
        type: "tween" as const,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <motion.section
      id="stats"
      className="stats scroll-snap-section"
      style={{ 
        fontFamily: bodyFont,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
        position: 'relative',
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
    >
      <DustParticles id="stats-dust" />
      <motion.h2
        variants={itemVariants}
        style={{ fontFamily: headingFont || primaryFont }}
      >
        {title}
      </motion.h2>
      <motion.div
        className="stats-grid"
        style={{ fontFamily: bodyFont }}
        variants={containerVariants}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat"
            custom={index}
            variants={statVariants}
            whileHover={{ scale: 1.1, y: -5 }}
            style={{ fontFamily: bodyFont }}
          >
            <h3 style={{ fontFamily: headingFont || primaryFont }}>{stat.number}</h3>
            <p style={{ fontFamily: bodyFont }}>{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

