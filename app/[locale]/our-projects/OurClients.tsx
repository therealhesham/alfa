'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, Award, Users, Globe } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Locale } from '@/i18n';

interface OurClientsProps {
  locale: 'ar' | 'en';
  settings?: any;
  content?: {
    statsTitle: string;
    statsSubtitle: string;
    showStats?: boolean;
    statsStat1Icon: string;
    statsStat1Number: string;
    statsStat1Label: string;
    statsStat2Icon: string;
    statsStat2Number: string;
    statsStat2Label: string;
    statsStat3Icon: string;
    statsStat3Number: string;
    statsStat3Label: string;
    statsStat4Icon: string;
    statsStat4Number: string;
    statsStat4Label: string;
    clientsTitle: string;
    clientsSubtitle: string;
    clientLogos: Array<{ name: string; logo: string }>;
  };
}

const iconMap: { [key: string]: any } = {
  Globe,
  Building2,
  Award,
  Users,
  Layers: Building2,
  Sparkles: Award,
};

export default function OurClients({ locale, settings, content }: OurClientsProps) {
  // Default content if not provided
  const defaultContent = {
    statsTitle: locale === 'ar' ? 'إنجازاتنا بالأرقام' : 'Our Achievements in Numbers',
    statsSubtitle: locale === 'ar' 
      ? 'سنوات من الخبرة والتميز في التصميم المعماري الفاخر'
      : 'Years of experience and excellence in luxury architectural design',
    showStats: true,
    statsStat1Icon: 'Building2',
    statsStat1Number: '250+',
    statsStat1Label: locale === 'ar' ? 'مشروع مكتمل' : 'Completed Projects',
    statsStat2Icon: 'Globe',
    statsStat2Number: '48',
    statsStat2Label: locale === 'ar' ? 'دولة حول العالم' : 'Countries Worldwide',
    statsStat3Icon: 'Award',
    statsStat3Number: '22',
    statsStat3Label: locale === 'ar' ? 'جائزة دولية' : 'International Awards',
    statsStat4Icon: 'Users',
    statsStat4Number: '500+',
    statsStat4Label: locale === 'ar' ? 'عميل راضٍ' : 'Satisfied Clients',
    clientsTitle: locale === 'ar' ? 'عملاؤنا' : 'Our Clients',
    clientsSubtitle: locale === 'ar' 
      ? 'نفتخر بثقة عملائنا الكرام من حول العالم'
      : 'We are proud of the trust of our valued clients from around the world',
    clientLogos: [
      { name: 'Client 1', logo: 'https://via.placeholder.com/150x80?text=Client+1' },
      { name: 'Client 2', logo: 'https://via.placeholder.com/150x80?text=Client+2' },
      { name: 'Client 3', logo: 'https://via.placeholder.com/150x80?text=Client+3' },
      { name: 'Client 4', logo: 'https://via.placeholder.com/150x80?text=Client+4' },
      { name: 'Client 5', logo: 'https://via.placeholder.com/150x80?text=Client+5' },
      { name: 'Client 6', logo: 'https://via.placeholder.com/150x80?text=Client+6' },
    ],
  };

  const displayContent = content || defaultContent;

  // Calculate animation distance
  const clientCount = displayContent.clientLogos?.length || 0;
  const itemWidth = 180; // width of each client box
  const gap = 24; // gap between items (1.5rem = 24px)
  const scrollDistance = clientCount * (itemWidth + gap);

  // Add animation styles dynamically
  useEffect(() => {
    if (clientCount === 0) return;
    
    const styleId = 'client-scroll-animation';
    let style = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }
    
    style.textContent = `
      @keyframes clientScroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-${scrollDistance}px);
        }
      }
    `;
    
    return () => {
      // Don't remove on cleanup to avoid flicker
    };
  }, [clientCount, scrollDistance]);

  const stats = [
    { 
      icon: iconMap[displayContent.statsStat1Icon] || Building2, 
      number: displayContent.statsStat1Number, 
      label: displayContent.statsStat1Label 
    },
    { 
      icon: iconMap[displayContent.statsStat2Icon] || Globe, 
      number: displayContent.statsStat2Number, 
      label: displayContent.statsStat2Label 
    },
    { 
      icon: iconMap[displayContent.statsStat3Icon] || Award, 
      number: displayContent.statsStat3Number, 
      label: displayContent.statsStat3Label 
    },
    { 
      icon: iconMap[displayContent.statsStat4Icon] || Users, 
      number: displayContent.statsStat4Number, 
      label: displayContent.statsStat4Label 
    },
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
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
    <>
      {/* Stats Section */}
      {displayContent.showStats !== false && (
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          style={{
            padding: '5rem 2rem',
            background: 'radial-gradient(ellipse at center top, rgba(212, 193, 157, 0.15) 0%, transparent 60%), radial-gradient(ellipse at center bottom, rgba(232, 217, 192, 0.12) 0%, transparent 60%), #000000',
            color: 'var(--gold)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <motion.div 
            variants={headerVariants}
            style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '80px' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'inline-block',
                height: '4px',
                background: 'var(--gold)',
                marginBottom: '2rem',
                borderRadius: '2px'
              }} 
            />
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--gold)',
              textShadow: '0 2px 20px rgba(212, 193, 157, 0.3)'
            }}>
              {displayContent.statsTitle}
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
              color: 'rgba(212, 193, 157, 0.9)',
              maxWidth: '600px',
              margin: '0 auto',
              opacity: 0.9
            }}>
              {displayContent.statsSubtitle}
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginTop: '3rem'
            }}
          >
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  custom={index}
                  variants={statCardVariants}
                  whileHover={{ 
                    y: -5, 
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    textAlign: 'center',
                    padding: '2rem 1rem',
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '20px',
                    border: '1px solid rgba(212, 193, 157, 0.3)',
                    cursor: 'default'
                  }}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '1rem'
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--gold) 0%, rgba(212, 193, 157, 0.8) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--dark)',
                      border: '2px solid var(--dark)'
                    }}>
                      <IconComponent size={28} />
                    </div>
                  </motion.div>
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    style={{
                      fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                      fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                      fontWeight: 700,
                      marginBottom: '0.5rem',
                      color: 'var(--gold)'
                    }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p style={{
                    fontSize: '1rem',
                    fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                    opacity: 0.9,
                    color: 'rgba(212, 193, 157, 0.9)'
                  }}>
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>
      )}

      {/* Clients Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        style={{
          padding: '5rem 2rem',
          background: 'radial-gradient(ellipse at center top, rgba(212, 193, 157, 0.15) 0%, transparent 60%), radial-gradient(ellipse at center bottom, rgba(232, 217, 192, 0.12) 0%, transparent 60%), #000000',
                    fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
          position: 'relative'
        }}
      >
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <motion.div 
            variants={headerVariants}
            style={{
              textAlign: 'center',
              marginBottom: '3rem'
            }}
          >
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '80px' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'inline-block',
                height: '4px',
                background: 'var(--gold)',
                marginBottom: '2rem',
                borderRadius: '2px'
              }} 
            />
            <h2 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
              fontWeight: 700,
              marginBottom: '1rem',
              color: 'var(--gold)',
              textShadow: '0 2px 20px rgba(212, 193, 157, 0.3)'
            }}>
              {displayContent.clientsTitle}
            </h2>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
              color: 'rgba(212, 193, 157, 0.9)',
              maxWidth: '600px',
              margin: '0 auto',
              opacity: 0.9
            }}>
              {displayContent.clientsSubtitle}
            </p>
          </motion.div>

          {displayContent.clientLogos && displayContent.clientLogos.length > 0 ? (
            <div style={{
              overflow: 'hidden',
              position: 'relative',
              padding: '2rem 0',
              maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
            }}>
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  animation: clientCount > 0 ? `clientScroll ${Math.max(20, clientCount * 3)}s linear infinite` : 'none',
                  width: 'fit-content'
                }}
              >
                {/* Duplicate clients for seamless loop */}
                {[...displayContent.clientLogos, ...displayContent.clientLogos].map((client, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (index % displayContent.clientLogos.length) * 0.1 }}
                    whileHover={{ 
                      y: -5, 
                      scale: 1.05,
                      transition: { duration: 0.3 }
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.5rem',
                      background: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '12px',
                      border: '1px solid rgba(212, 193, 157, 0.3)',
                      cursor: 'default',
                      minWidth: '180px',
                      width: '180px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div style={{
                      width: '120px',
                      height: '120px',
                      marginBottom: '1rem',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: 'rgba(0, 0, 0, 0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(212, 193, 157, 0.2)'
                    }}>
                      <Image
                        src={client.logo}
                        alt={client.name}
                        width={120}
                        height={120}
                        style={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%',
                          transition: 'all 0.3s ease'
                        }}
                        unoptimized
                      />
                    </div>
                    <p style={{
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
                      color: 'rgba(212, 193, 157, 0.9)',
                      fontWeight: 500,
                      textAlign: 'center',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {client.name}
                    </p>
                  </motion.div>
                  ))}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'rgba(212, 193, 157, 0.7)',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
            }}>
              {locale === 'ar' ? 'لا توجد شعارات عملاء متاحة' : 'No client logos available'}
            </div>
          )}
        </div>
      </motion.section>
    </>
  );
}

