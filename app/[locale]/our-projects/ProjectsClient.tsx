"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Globe, Award, Building2, Home, BookOpen } from "lucide-react";
import ProjectBookViewer from "./ProjectBookViewer";
import type { Locale } from "@/i18n";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  location?: string | null;
  year?: string | null;
  category?: string | null;
  projectType?: string | null; // "commercial" or "residential"
  images?: string[]; // Additional images array
}

interface ProjectsClientProps {
  projects: Project[];
  locale: Locale;
  settings: any;
  pageContent: any;
}

export default function ProjectsClient({ projects, locale, settings, pageContent }: ProjectsClientProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Categorize projects by projectType
  const categorizedProjects = useMemo(() => {
    const commercial = projects.filter(project => 
      (project.projectType || 'commercial').toLowerCase() === 'commercial'
    );
    
    const residential = projects.filter(project => 
      (project.projectType || '').toLowerCase() === 'residential'
    );

    return { commercial, residential };
  }, [projects]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    }),
  };

  const renderProjectCard = (project: Project, index: number) => (
    <motion.div 
      key={project.id}
      className="project-card"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      onClick={() => setSelectedProject(project)}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
      }}
      style={{
        position: 'relative',
        background: 'rgba(15, 28, 42, 0.6)',
        border: '1px solid rgba(212, 193, 157, 0.3)',
        cursor: 'pointer',
      }}
    >
      <div className="project-image" style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--dark)'
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
          background: 'linear-gradient(to bottom, transparent 0%, var(--dark) 100%)',
          opacity: 0.6,
          transition: 'opacity 0.4s ease'
        }} className="project-overlay" />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'var(--gold)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 0 20px rgba(212, 193, 157, 0.5))'
        }} className="project-hover-icon">
          <BookOpen size={48} strokeWidth={1.5} />
        </div>
      </div>
      <div className="project-content" style={{
        padding: '2rem',
        background: 'transparent'
      }}>
        {project.category && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--gold)',
            fontWeight: '700',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
          }}>
            {project.category}
          </div>
        )}
        <h3 style={{ 
          fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          fontWeight: 700,
          color: 'var(--gold)',
          marginBottom: '1rem',
          lineHeight: 1.3,
          letterSpacing: '-0.01em'
        }}>
          {project.title}
        </h3>
        <p style={{ 
          fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'rgba(212, 193, 157, 0.8)',
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
          borderTop: '1px solid rgba(212, 193, 157, 0.2)'
        }}>
          {project.location && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              color: 'rgba(212, 193, 157, 0.8)',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
            }}>
              <Globe size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <span>{project.location}</span>
            </div>
          )}
          {project.year && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              color: 'rgba(212, 193, 157, 0.8)',
              fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
            }}>
              <Award size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
              <span>{project.year}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  const renderSection = (title: string, titleEn: string, icon: any, projects: Project[]) => {
    if (projects.length === 0) return null;
    
    const IconComponent = icon;
    const displayTitle = locale === 'ar' ? title : titleEn;
    
    return (
      <motion.div 
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        style={{ marginBottom: '5rem' }}
      >
        {/* Section Header */}
        <motion.div 
          variants={headerVariants}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '3rem',
            paddingBottom: '1.5rem',
            borderBottom: '2px solid rgba(212, 193, 157, 0.3)'
          }}
        >
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--gold) 0%, rgba(212, 193, 157, 0.8) 100%)',
              boxShadow: '0 10px 30px rgba(212, 193, 157, 0.3)',
              border: '2px solid var(--dark)'
            }}
          >
            <IconComponent size={35} color="var(--dark)" strokeWidth={1.5} />
          </motion.div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
            fontWeight: 700,
            color: 'var(--gold)',
            margin: 0,
            textShadow: '0 2px 20px rgba(212, 193, 157, 0.3)'
          }}>
            {displayTitle}
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              flex: 1,
              height: '2px',
              background: 'linear-gradient(to right, rgba(212, 193, 157, 0.3), transparent)',
              marginLeft: '1rem'
            }} 
          />
        </motion.div>
        
        {/* Projects Grid */}
        <motion.div 
          variants={sectionVariants}
          className="projects-grid"
        >
          {projects.map((project, index) => renderProjectCard(project, index))}
        </motion.div>
      </motion.div>
    );
  };

  if (projects.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '5rem 2rem',
        color: 'var(--gold)' 
      }}>
        <p style={{ 
          fontSize: '1.2rem',
          fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
          opacity: 0.8
        }}>
          {pageContent.emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Commercial Projects Section */}
      {renderSection('تجاري', 'Commercial', Building2, categorizedProjects.commercial)}
      
      {/* Residential Projects Section */}
      {renderSection('سكني', 'Residential', Home, categorizedProjects.residential)}

      {selectedProject && (
        <ProjectBookViewer
          project={selectedProject}
          locale={locale}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .project-card:hover .project-overlay {
          opacity: 0.8 !important;
        }
        .project-card:hover .project-hover-icon {
          opacity: 1 !important;
        }
        .project-card:hover .project-image img {
          transform: scale(1.1);
        }
        .project-card {
          border-radius: 12px;
          overflow: hidden;
        }
      `}} />
    </>
  );
}

