"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Tag, Bookmark } from "lucide-react";

interface ProjectBookViewerProps {
  project: {
    id: string;
    title: string;
    description: string;
    image: string;
    images?: string[];
    location?: string | null;
    year?: string | null;
    category?: string | null;
  };
  locale: "ar" | "en";
  onClose: () => void;
}

export default function ProjectBookViewer({ project, locale, onClose }: ProjectBookViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [flipProgress, setFlipProgress] = useState(0);
  const [showNextContent, setShowNextContent] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Combine main image with additional images
  const allImages = project.images && project.images.length > 0 
    ? [project.image, ...project.images]
    : [project.image];
  
  const isRTL = locale === "ar";
  
  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const actualIsMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : isMobile;
  
  const totalBookPages = actualIsMobile 
    ? 1 + allImages.length
    : 1 + Math.ceil((allImages.length - 1) / 2);
  
  const getPageContent = () => {
    const checkMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : isMobile;
    
    if (checkMobile) {
      if (currentPage === 0) {
        return { type: 'info', imageIndex: null };
      }
      return { type: 'image', imageIndex: currentPage - 1 };
    } else {
      if (currentPage === 0) {
        return { type: 'info+image', left: null, right: allImages[0] };
      }
      const leftIndex = (currentPage - 1) * 2 + 1;
      const rightIndex = (currentPage - 1) * 2 + 2;
      return {
        type: 'images',
        left: leftIndex < allImages.length ? allImages[leftIndex] : null,
        right: rightIndex < allImages.length ? allImages[rightIndex] : null
      };
    }
  };
  
  const pageContent = getPageContent();

  const playPageFlipSound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/pagesound.mp3');
        audioRef.current.volume = 0.3;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log('Audio autoplay blocked', e));
    } catch (e) { console.log(e); }
  };

  const changePage = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    
    if (newPage >= 0 && newPage < totalBookPages) {
      playPageFlipSound();
      setFlipDirection(direction);
      setIsFlipping(true);
      setFlipProgress(0);
      setShowNextContent(false);
      
      // Animate flip progress
      const duration = 400;
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const eased = 1 - Math.pow(1 - progress, 3);
        setFlipProgress(eased);
        
        // Switch content at halfway point
        if (progress >= 0.5 && !showNextContent) {
          setShowNextContent(true);
          setCurrentPage(newPage);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsFlipping(false);
          setFlipProgress(0);
          setShowNextContent(false);
        }
      };
      
      requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") isRTL ? changePage('prev') : changePage('next');
      if (e.key === "ArrowLeft") isRTL ? changePage('next') : changePage('prev');
    };

    window.addEventListener("keydown", handleKeyPress);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [currentPage, isRTL, onClose]);

  // Corner flourish SVG
  const CornerFlourish = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
    const rotations = { tl: 0, tr: 90, br: 180, bl: 270 };
    return (
      <svg 
        width="60" 
        height="60" 
        viewBox="0 0 60 60" 
        style={{
          position: 'absolute',
          top: position.includes('t') ? '15px' : 'auto',
          bottom: position.includes('b') ? '15px' : 'auto',
          left: position.includes('l') ? '15px' : 'auto',
          right: position.includes('r') ? '15px' : 'auto',
          transform: `rotate(${rotations[position]}deg)`,
          opacity: 0.4,
          pointerEvents: 'none'
        }}
      >
        <path 
          d="M2 2 Q2 30 30 30 Q15 30 15 15 Q15 2 2 2 M30 30 Q30 45 45 45 Q38 45 38 38 Q38 30 30 30" 
          fill="none" 
          stroke="url(#goldGradient)" 
          strokeWidth="1"
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c9a962" />
            <stop offset="50%" stopColor="#f4e4bc" />
            <stop offset="100%" stopColor="#a08339" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div 
      className="book-viewer-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "2500px",
        overflow: "hidden",
        isolation: "isolate"
      }}
    >
      {/* --- ATMOSPHERIC BACKGROUND --- */}
      <div 
        style={{
          position: "absolute",
          inset: "-30px",
          zIndex: -1,
        }}
      >
        <Image
          src={project.image}
          alt="Background atmosphere"
          fill
          style={{ 
            objectFit: "cover", 
            filter: "blur(40px) brightness(0.25) saturate(0.8)",
            transform: "scale(1.15)"
          }}
          priority
          unoptimized
        />
        {/* Dark gradient overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)"
        }} />
        {/* Premium noise texture */}
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* --- CLICK OUTSIDE LAYER --- */}
      <div 
        onClick={onClose} 
        style={{ position: "absolute", inset: 0, cursor: "pointer" }} 
      />

      {/* --- STYLES --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Spectral:ital,wght@0,300;0,400;1,300&display=swap');

        :root {
          --book-gold: #c9a962;
          --book-gold-light: #f4e4bc;
          --book-gold-dark: #8a7033;
          --book-cream: #f8f4eb;
          --book-leather: #2a1f1a;
          --book-leather-light: #3d2e26;
          --book-paper: #fdfbf7;
        }

        @keyframes bookEnter {
          from { 
            opacity: 0; 
            transform: scale(0.85) rotateX(10deg) translateY(40px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) rotateX(0) translateY(0); 
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes floatIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pageLift {
          0% { transform: translateZ(0); }
          50% { transform: translateZ(30px); }
          100% { transform: translateZ(0); }
        }

        @keyframes contentFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .book-container { 
          animation: bookEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
          transform-style: preserve-3d;
        }

        .page-wrapper {
          transform-style: preserve-3d;
          transition: transform 0.1s linear;
        }

        .page-content-enter {
          animation: contentFadeIn 0.4s ease-out;
        }

        .page-shadow {
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .nav-btn {
          background: linear-gradient(135deg, rgba(201, 169, 98, 0.15) 0%, rgba(201, 169, 98, 0.05) 100%);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(201, 169, 98, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .nav-btn:hover {
          background: linear-gradient(135deg, rgba(201, 169, 98, 0.3) 0%, rgba(201, 169, 98, 0.15) 100%);
          transform: scale(1.08);
          border-color: rgba(201, 169, 98, 0.5);
          box-shadow: 0 8px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        
        .close-btn {
          background: linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.3s ease;
        }
        .close-btn:hover {
          background: linear-gradient(135deg, rgba(201, 169, 98, 0.3) 0%, rgba(201, 169, 98, 0.1) 100%);
          border-color: rgba(201, 169, 98, 0.4);
          transform: rotate(90deg) scale(1.05);
        }
        
        .elegant-scroll::-webkit-scrollbar { width: 5px; }
        .elegant-scroll::-webkit-scrollbar-track { background: transparent; }
        .elegant-scroll::-webkit-scrollbar-thumb { 
          background: linear-gradient(180deg, var(--book-gold-dark), var(--book-gold)); 
          border-radius: 10px; 
        }

        .page-indicator {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .page-indicator:hover {
          transform: scale(1.3);
        }
        .page-indicator.active {
          background: linear-gradient(90deg, var(--book-gold-dark), var(--book-gold), var(--book-gold-dark));
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        @media (max-width: 768px) {
          .book-page-image-left {
            display: none !important;
          }
          .book-page-image {
            width: 100% !important;
            flex: 1 1 100% !important;
            border-radius: 12px !important;
          }
          .book-container {
            width: 94vw !important;
            max-width: 94vw !important;
          }
        }
      `}} />

      {/* --- MAIN BOOK CONTAINER --- */}
      <div
        className="book-container"
        style={{
          position: "relative",
          width: "94vw",
          maxWidth: "1500px",
          maxHeight: "88vh",
          aspectRatio: "16/9",
          display: "flex",
          borderRadius: "6px",
          boxShadow: `
            0 60px 120px -30px rgba(0,0,0,0.8),
            0 30px 60px -20px rgba(0,0,0,0.6),
            0 0 1px rgba(201, 169, 98, 0.3),
            inset 0 0 80px rgba(0,0,0,0.1)
          `,
        }}
      >
        {/* --- BOOK SPINE --- */}
        <div style={{
          position: "absolute",
          top: "-3px",
          bottom: "-3px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "12px",
          background: "linear-gradient(90deg, #1a1410 0%, #2a201a 30%, #3a2e26 50%, #2a201a 70%, #1a1410 100%)",
          zIndex: 20,
          borderRadius: "2px",
          boxShadow: "0 0 20px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.3)"
        }}>
          {/* Spine gold lines */}
          <div style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "2px",
            height: "calc(100% - 40px)",
            background: "linear-gradient(180deg, transparent, rgba(201, 169, 98, 0.3), rgba(201, 169, 98, 0.5), rgba(201, 169, 98, 0.3), transparent)"
          }} />
        </div>

        {/* --- CLOSE BUTTON --- */}
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            position: "absolute",
            top: "-55px",
            [isRTL ? "left" : "right"]: "0",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.9)",
            zIndex: 50,
            cursor: "pointer"
          }}
        >
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* --- BOOKMARK RIBBON --- */}
        <div style={{
          position: "absolute",
          top: "-8px",
          [isRTL ? "left" : "right"]: "40px",
          zIndex: 25,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
        }}>
          <Bookmark 
            size={32} 
            fill="linear-gradient(180deg, #b8860b, #daa520)"
            color="#c9a962"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
          />
        </div>

        {/* ================= MOBILE VIEW ================= */}
        {actualIsMobile ? (
          <>
            {currentPage === 0 ? (
              <div
                className={`book-page-info ${!isFlipping ? 'page-content-enter' : ''}`}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #1c1816 0%, #0f0d0b 100%)",
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transformStyle: "preserve-3d",
                  transformOrigin: isRTL ? "right center" : "left center",
                  transform: isFlipping 
                    ? `perspective(2000px) rotateY(${flipDirection === 'next' 
                        ? (isRTL ? -flipProgress * 180 : flipProgress * 180) 
                        : (isRTL ? flipProgress * 180 : -flipProgress * 180)}deg) scale(${1 - flipProgress * 0.05})`
                    : 'none',
                  transition: isFlipping ? 'none' : 'transform 0.3s ease',
                }}
              >
                {/* Leather texture overlay */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  opacity: 0.06,
                  pointerEvents: "none"
                }}/>

                {/* Decorative corners */}
                <CornerFlourish position="tl" />
                <CornerFlourish position="tr" />
                <CornerFlourish position="bl" />
                <CornerFlourish position="br" />

                {/* Inner golden frame */}
                <div style={{
                  position: "absolute",
                  top: "25px", bottom: "25px",
                  left: "25px", right: "25px",
                  border: "1px solid rgba(201, 169, 98, 0.25)",
                  borderRadius: "4px",
                  pointerEvents: "none"
                }}>
                  <div style={{
                    position: "absolute",
                    inset: "4px",
                    border: "1px solid rgba(201, 169, 98, 0.12)",
                    borderRadius: "2px"
                  }} />
                </div>

                {/* Content */}
                <div className="elegant-scroll" style={{
                  padding: "2.5rem",
                  height: "100%",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 2
                }}>
                  {/* Category badge */}
                  {project.category && (
                    <div style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "8px",
                      fontSize: "0.7rem", 
                      textTransform: "uppercase", 
                      letterSpacing: "3px",
                      color: "var(--book-gold)",
                      marginBottom: "1.5rem",
                      fontFamily: "'Spectral', serif",
                      animation: "floatIn 0.6s ease 0.2s both"
                    }}>
                      <span style={{ 
                        width: "20px", 
                        height: "1px", 
                        background: "linear-gradient(90deg, transparent, var(--book-gold))" 
                      }} />
                      <Tag size={11} />
                      {project.category}
                      <span style={{ 
                        width: "20px", 
                        height: "1px", 
                        background: "linear-gradient(90deg, var(--book-gold), transparent)" 
                      }} />
                    </div>
                  )}

                  {/* Title */}
                  <h2 style={{
                    fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    color: "var(--book-cream)",
                    lineHeight: 1.15,
                    marginBottom: "1.5rem",
                    letterSpacing: "-0.02em",
                    animation: "floatIn 0.6s ease 0.3s both"
                  }}>
                    {project.title}
                  </h2>

                  {/* Decorative divider */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "1.5rem",
                    animation: "floatIn 0.6s ease 0.4s both"
                  }}>
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.3))" }} />
                    <div style={{ width: "6px", height: "6px", background: "var(--book-gold)", transform: "rotate(45deg)", opacity: 0.6 }} />
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(201, 169, 98, 0.3), transparent)" }} />
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    color: "rgba(248, 244, 235, 0.7)",
                    marginBottom: "auto",
                    textAlign: "justify",
                    fontFamily: "'Spectral', serif",
                    fontWeight: 300,
                    animation: "floatIn 0.6s ease 0.5s both"
                  }}>
                    {project.description}
                  </p>

                  {/* Footer */}
                  <div style={{ 
                    marginTop: "2rem", 
                    paddingTop: "1.5rem",
                    borderTop: "1px solid rgba(201, 169, 98, 0.15)",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1.5rem",
                    animation: "floatIn 0.6s ease 0.6s both"
                  }}>
                    {project.location && (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(248, 244, 235, 0.5)" }}>
                        <MapPin size={16} color="var(--book-gold)" strokeWidth={1.5} />
                        <span style={{ fontSize: "0.85rem", fontFamily: "'Spectral', serif" }}>{project.location}</span>
                      </div>
                    )}
                    {project.year && (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(248, 244, 235, 0.5)" }}>
                        <Calendar size={16} color="var(--book-gold)" strokeWidth={1.5} />
                        <span style={{ fontSize: "0.85rem", fontFamily: "'Spectral', serif" }}>{project.year}</span>
                      </div>
                    )}
                  </div>

                  {/* Page number */}
                  <div style={{ 
                    marginTop: "1.5rem", 
                    fontSize: "0.75rem", 
                    color: "rgba(201, 169, 98, 0.4)",
                    textAlign: "center",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic"
                  }}>
                    — {currentPage + 1} —
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile Image Page */
              <div
                className={`book-page-image ${!isFlipping ? 'page-content-enter' : ''}`}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  background: "#0a0908",
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transformStyle: "preserve-3d",
                  transformOrigin: isRTL ? "right center" : "left center",
                  transform: isFlipping 
                    ? `perspective(2000px) rotateY(${flipDirection === 'next' 
                        ? (isRTL ? -flipProgress * 180 : flipProgress * 180) 
                        : (isRTL ? flipProgress * 180 : -flipProgress * 180)}deg) scale(${1 - flipProgress * 0.05})`
                    : 'none',
                  transition: isFlipping ? 'none' : 'transform 0.3s ease',
                }}
                onClick={() => changePage('next')}
              >
                <Image
                  src={allImages[pageContent.imageIndex!]}
                  alt={project.title}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
                
                {/* Elegant vignette */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%),
                    linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.3) 100%)
                  `,
                  pointerEvents: "none"
                }} />

                {/* Page number overlay */}
                <div style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(8px)",
                  padding: "8px 20px",
                  borderRadius: "30px",
                  color: "var(--book-cream)",
                  fontSize: "0.75rem",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  border: "1px solid rgba(201, 169, 98, 0.2)",
                  pointerEvents: "none"
                }}>
                  — {currentPage + 1} —
                </div>
              </div>
            )}
          </>
        ) : (
          /* ================= DESKTOP VIEW ================= */
          <>
            {/* ================= LEFT PAGE (INFO) ================= */}
            {currentPage === 0 && (
              <div
                className={`book-page-info ${!isFlipping ? 'page-content-enter' : ''}`}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #1c1816 0%, #0f0d0b 100%)",
                  position: "relative",
                  borderRadius: isRTL ? "0 6px 6px 0" : "6px 0 0 6px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: `inset ${isRTL ? "20px" : "-20px"} 0 50px -15px rgba(0,0,0,0.7)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Leather texture */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  opacity: 0.06,
                  pointerEvents: "none"
                }}/>

                {/* Decorative corners */}
                <CornerFlourish position="tl" />
                <CornerFlourish position="bl" />
                {!isRTL && <CornerFlourish position="tr" />}
                {!isRTL && <CornerFlourish position="br" />}

                {/* Inner golden frame */}
                <div style={{
                  position: "absolute",
                  top: "25px", bottom: "25px",
                  [isRTL ? "right" : "left"]: "25px",
                  [isRTL ? "left" : "right"]: "35px",
                  border: "1px solid rgba(201, 169, 98, 0.25)",
                  borderRadius: "4px",
                  pointerEvents: "none"
                }}>
                  <div style={{
                    position: "absolute",
                    inset: "4px",
                    border: "1px solid rgba(201, 169, 98, 0.12)",
                    borderRadius: "2px"
                  }} />
                </div>

                {/* Content */}
                <div className="elegant-scroll" style={{
                  padding: "3.5rem",
                  paddingRight: isRTL ? "3.5rem" : "4.5rem",
                  paddingLeft: isRTL ? "4.5rem" : "3.5rem",
                  height: "100%",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 2
                }}>
                  
                  {/* Category badge */}
                  {project.category && (
                    <div style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "10px",
                      fontSize: "0.7rem", 
                      textTransform: "uppercase", 
                      letterSpacing: "3px",
                      color: "var(--book-gold)",
                      marginBottom: "2rem",
                      fontFamily: "'Spectral', serif",
                      animation: "floatIn 0.6s ease 0.2s both"
                    }}>
                      <span style={{ 
                        width: "30px", 
                        height: "1px", 
                        background: "linear-gradient(90deg, transparent, var(--book-gold))" 
                      }} />
                      <Tag size={12} />
                      {project.category}
                      <span style={{ 
                        width: "30px", 
                        height: "1px", 
                        background: "linear-gradient(90deg, var(--book-gold), transparent)" 
                      }} />
                    </div>
                  )}

                  {/* Title */}
                  <h2 style={{
                    fontSize: "clamp(2rem, 3.5vw, 3rem)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    color: "var(--book-cream)",
                    lineHeight: 1.1,
                    marginBottom: "2rem",
                    letterSpacing: "-0.02em",
                    animation: "floatIn 0.6s ease 0.3s both"
                  }}>
                    {project.title}
                  </h2>

                  {/* Decorative divider */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "2rem",
                    animation: "floatIn 0.6s ease 0.4s both"
                  }}>
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.3))" }} />
                    <div style={{ width: "8px", height: "8px", background: "var(--book-gold)", transform: "rotate(45deg)", opacity: 0.6 }} />
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(201, 169, 98, 0.3), transparent)" }} />
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: "1.1rem",
                    lineHeight: 1.85,
                    color: "rgba(248, 244, 235, 0.7)",
                    marginBottom: "auto",
                    textAlign: "justify",
                    fontFamily: "'Spectral', serif",
                    fontWeight: 300,
                    animation: "floatIn 0.6s ease 0.5s both"
                  }}>
                    {project.description}
                  </p>

                  {/* Footer */}
                  <div style={{ 
                    marginTop: "2.5rem", 
                    paddingTop: "1.5rem",
                    borderTop: "1px solid rgba(201, 169, 98, 0.15)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    animation: "floatIn 0.6s ease 0.6s both"
                  }}>
                    {project.location && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "rgba(248, 244, 235, 0.5)" }}>
                        <MapPin size={18} color="var(--book-gold)" strokeWidth={1.5} />
                        <span style={{ fontSize: "0.9rem", fontFamily: "'Spectral', serif" }}>{project.location}</span>
                      </div>
                    )}
                    {project.year && (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "rgba(248, 244, 235, 0.5)" }}>
                        <Calendar size={18} color="var(--book-gold)" strokeWidth={1.5} />
                        <span style={{ fontSize: "0.9rem", fontFamily: "'Spectral', serif" }}>{project.year}</span>
                      </div>
                    )}
                  </div>

                  {/* Page number */}
                  <div style={{ 
                    marginTop: "1.5rem", 
                    fontSize: "0.8rem", 
                    color: "rgba(201, 169, 98, 0.4)",
                    textAlign: isRTL ? "left" : "right",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic"
                  }}>
                    — {currentPage + 1} —
                  </div>
                </div>
              </div>
            )}

            {/* ================= LEFT IMAGE PAGE ================= */}
            {currentPage > 0 && pageContent.type === 'images' && pageContent.left && (
              <div
                className={`book-page-image book-page-image-left ${!isFlipping ? 'page-content-enter' : ''}`}
                style={{
                  flex: 1,
                  position: "relative",
                  background: "#0a0908",
                  borderRadius: isRTL ? "0 6px 6px 0" : "6px 0 0 6px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transformOrigin: isRTL ? "right center" : "left center",
                  boxShadow: `inset ${isRTL ? "20px" : "-20px"} 0 50px -15px rgba(0,0,0,0.7)`,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => changePage('prev')}
              >
                <Image
                  src={pageContent.left}
                  alt={project.title}
                  fill
                  sizes="50vw"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
                
                {/* Elegant vignette */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%),
                    linear-gradient(${isRTL ? '270deg' : '90deg'}, rgba(0,0,0,0.2) 0%, transparent 15%)
                  `,
                  pointerEvents: "none"
                }} />

                {/* Subtle frame */}
                <div style={{
                  position: "absolute",
                  top: "15px", bottom: "15px",
                  left: "15px", right: "15px",
                  border: "1px solid rgba(201, 169, 98, 0.15)",
                  borderRadius: "2px",
                  pointerEvents: "none"
                }} />
              </div>
            )}

            {/* ================= RIGHT PAGE ================= */}
            {pageContent.type === 'info+image' ? (
              <div
                className={`book-page-image page-flip-container ${!isFlipping ? 'page-content-enter' : ''}`}
                style={{
                  flex: 1,
                  position: "relative",
                  background: "#0a0908",
                  borderRadius: isRTL ? "6px 0 0 6px" : "0 6px 6px 0",
                  overflow: "hidden",
                  cursor: "pointer",
                  transformOrigin: isRTL ? "right center" : "left center",
                  boxShadow: `inset ${isRTL ? "-20px" : "20px"} 0 50px -15px rgba(0,0,0,0.7)`,
                  transformStyle: "preserve-3d",
                  transform: isFlipping && flipDirection === 'next'
                    ? `perspective(2500px) rotateY(${isRTL ? flipProgress * 180 : -flipProgress * 180}deg)`
                    : 'none',
                  transition: isFlipping ? 'none' : 'transform 0.3s ease',
                  zIndex: isFlipping ? 30 : 1,
                }}
                onClick={() => changePage('next')}
              >
                <Image
                  src={pageContent.right!}
                  alt={project.title}
                  fill
                  sizes="50vw"
                  style={{ objectFit: "cover" }}
                  priority
                  unoptimized
                />
            
                {/* Elegant vignette */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%),
                    linear-gradient(${isRTL ? '90deg' : '270deg'}, rgba(0,0,0,0.2) 0%, transparent 15%)
                  `,
                  pointerEvents: "none"
                }} />

                {/* Subtle frame */}
                <div style={{
                  position: "absolute",
                  top: "15px", bottom: "15px",
                  left: "15px", right: "15px",
                  border: "1px solid rgba(201, 169, 98, 0.15)",
                  borderRadius: "2px",
                  pointerEvents: "none"
                }} />

                {/* Dynamic page flip shadow */}
                {isFlipping && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, 
                      rgba(0,0,0,${0.6 * Math.sin(flipProgress * Math.PI)}) 0%, 
                      transparent 50%)`,
                    pointerEvents: "none",
                    zIndex: 5
                  }} />
                )}

                {/* Page back side effect */}
                {isFlipping && flipProgress > 0.5 && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #e8e4dc 0%, #d4cfc5 50%, #c8c2b8 100%)",
                    pointerEvents: "none",
                    zIndex: 4
                  }} />
                )}

                {/* Navigation hint */}
                {currentPage < totalBookPages - 1 && !isFlipping && (
                  <div style={{
                    position: "absolute",
                    bottom: "30px",
                    [isRTL ? "left" : "right"]: "30px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(8px)",
                    padding: "10px 16px",
                    borderRadius: "30px",
                    color: "var(--book-cream)",
                    fontSize: "0.75rem",
                    fontFamily: "'Spectral', serif",
                    border: "1px solid rgba(201, 169, 98, 0.2)",
                    opacity: 0.8
                  }}>
                    {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                    <span style={{ fontStyle: "italic" }}>
                      {locale === 'ar' ? 'اسحب للمتابعة' : 'Continue'}
                    </span>
                  </div>
                )}
              </div>
            ) : pageContent.type === 'images' && pageContent.right ? (
              <div
                className={`book-page-image ${!isFlipping ? 'page-content-enter' : ''}`}
                style={{
                  flex: 1,
                  position: "relative",
                  background: "#0a0908",
                  borderRadius: isRTL ? "6px 0 0 6px" : "0 6px 6px 0",
                  overflow: "hidden",
                  cursor: "pointer",
                  transformOrigin: isRTL ? "right center" : "left center",
                  boxShadow: `inset ${isRTL ? "-20px" : "20px"} 0 50px -15px rgba(0,0,0,0.7)`,
                  transformStyle: "preserve-3d",
                  transform: isFlipping && flipDirection === 'next'
                    ? `perspective(2500px) rotateY(${isRTL ? flipProgress * 180 : -flipProgress * 180}deg)`
                    : 'none',
                  transition: isFlipping ? 'none' : 'transform 0.3s ease',
                  zIndex: isFlipping ? 30 : 1,
                }}
                onClick={() => changePage('next')}
              >
                <Image
                  src={pageContent.right}
                  alt={project.title}
                  fill
                  sizes="50vw"
                  style={{ objectFit: "cover" }}
                  unoptimized
                />
                
                {/* Elegant vignette */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: `
                    radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%),
                    linear-gradient(${isRTL ? '90deg' : '270deg'}, rgba(0,0,0,0.2) 0%, transparent 15%)
                  `,
                  pointerEvents: "none"
                }} />

                {/* Subtle frame */}
                <div style={{
                  position: "absolute",
                  top: "15px", bottom: "15px",
                  left: "15px", right: "15px",
                  border: "1px solid rgba(201, 169, 98, 0.15)",
                  borderRadius: "2px",
                  pointerEvents: "none"
                }} />

                {/* Dynamic page flip shadow */}
                {isFlipping && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, 
                      rgba(0,0,0,${0.6 * Math.sin(flipProgress * Math.PI)}) 0%, 
                      transparent 50%)`,
                    pointerEvents: "none",
                    zIndex: 5
                  }} />
                )}

                {/* Page back side effect */}
                {isFlipping && flipProgress > 0.5 && (
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #e8e4dc 0%, #d4cfc5 50%, #c8c2b8 100%)",
                    pointerEvents: "none",
                    zIndex: 4
                  }} />
                )}

                {/* Navigation hint */}
                {currentPage < totalBookPages - 1 && !isFlipping && (
                  <div style={{
                    position: "absolute",
                    bottom: "25px",
                    [isRTL ? "left" : "right"]: "25px",
                    background: "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(8px)",
                    padding: "10px",
                    borderRadius: "50%",
                    color: "var(--book-cream)",
                    border: "1px solid rgba(201, 169, 98, 0.2)",
                    opacity: 0.7
                  }}>
                   {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                  </div>
                )}
              </div>
            ) : (
              /* End page with elegant summary */
              <div
                className={`book-page-info ${!isFlipping ? 'page-content-enter' : ''}`}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #1c1816 0%, #0f0d0b 100%)",
                  position: "relative",
                  borderRadius: isRTL ? "6px 0 0 6px" : "0 6px 6px 0",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: `inset ${isRTL ? "-20px" : "20px"} 0 50px -15px rgba(0,0,0,0.7)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Leather texture */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  opacity: 0.06,
                  pointerEvents: "none"
                }}/>

                {/* Decorative corners */}
                <CornerFlourish position="tl" />
                <CornerFlourish position="tr" />
                <CornerFlourish position="bl" />
                <CornerFlourish position="br" />

                {/* Inner frame */}
                <div style={{
                  position: "absolute",
                  top: "25px", bottom: "25px",
                  left: "25px", right: "25px",
                  border: "1px solid rgba(201, 169, 98, 0.25)",
                  borderRadius: "4px",
                  pointerEvents: "none"
                }}>
                  <div style={{
                    position: "absolute",
                    inset: "4px",
                    border: "1px solid rgba(201, 169, 98, 0.12)",
                    borderRadius: "2px"
                  }} />
                </div>

                {/* Centered content */}
                <div className="elegant-scroll" style={{
                  padding: "3.5rem",
                  height: "100%",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 2,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center"
                }}>
                  {/* Decorative element */}
                  <div style={{
                    width: "60px",
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, var(--book-gold), transparent)",
                    marginBottom: "2rem"
                  }} />
                  
                  {/* Title */}
                  <h2 style={{
                    fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 500,
                    color: "var(--book-cream)",
                    lineHeight: 1.15,
                    marginBottom: "1.5rem",
                    letterSpacing: "-0.02em"
                  }}>
                    {project.title}
                  </h2>

                  {/* Decorative diamond */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "2rem"
                  }}>
                    <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(201, 169, 98, 0.4))" }} />
                    <div style={{ width: "8px", height: "8px", background: "var(--book-gold)", transform: "rotate(45deg)", opacity: 0.5 }} />
                    <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, rgba(201, 169, 98, 0.4), transparent)" }} />
                  </div>

                  {/* Thank you message */}
                  <p style={{
                    fontSize: "1rem",
                    lineHeight: 1.8,
                    color: "rgba(248, 244, 235, 0.6)",
                    fontFamily: "'Spectral', serif",
                    fontStyle: "italic",
                    maxWidth: "400px"
                  }}>
                    {locale === 'ar' 
                      ? 'شكراً لاطلاعكم على هذا المشروع' 
                      : 'Thank you for viewing this project'}
                  </p>

                  {/* Page number */}
                  <div style={{ 
                    marginTop: "3rem", 
                    fontSize: "0.8rem", 
                    color: "rgba(201, 169, 98, 0.4)",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic"
                  }}>
                    — {currentPage + 1} —
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- NAVIGATION ARROWS --- */}
        {currentPage > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              changePage('prev');
            }}
            className="nav-btn book-nav-arrow-prev"
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "right" : "left"]: actualIsMobile ? "15px" : "-65px",
              transform: "translateY(-50%)",
              width: "48px", 
              height: "48px",
              borderRadius: "50%",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "var(--book-cream)", 
              zIndex: 10,
              cursor: "pointer"
            }}
          >
            {isRTL ? <ChevronRight size={22} strokeWidth={1.5} /> : <ChevronLeft size={22} strokeWidth={1.5} />}
          </button>
        )}

        {currentPage < totalBookPages - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              changePage('next');
            }}
            className="nav-btn book-nav-arrow-next"
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "left" : "right"]: actualIsMobile ? "15px" : "-65px",
              transform: "translateY(-50%)",
              width: "48px", 
              height: "48px",
              borderRadius: "50%",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "var(--book-cream)", 
              zIndex: 10,
              cursor: "pointer"
            }}
          >
            {isRTL ? <ChevronLeft size={22} strokeWidth={1.5} /> : <ChevronRight size={22} strokeWidth={1.5} />}
          </button>
        )}
      </div>

      {/* --- PAGE INDICATORS --- */}
      <div style={{
        position: "absolute",
        bottom: "3.5vh",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        zIndex: 10,
        padding: "10px 18px",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(10px)",
        borderRadius: "30px",
        border: "1px solid rgba(201, 169, 98, 0.15)"
      }}>
        {/* Page number */}
        <span style={{
          color: "var(--book-gold)",
          fontSize: "0.8rem",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 500,
          minWidth: "35px",
          textAlign: "center"
        }}>
          {currentPage + 1}/{totalBookPages}
        </span>
        
        {/* Separator */}
        <div style={{
          width: "1px",
          height: "16px",
          background: "rgba(201, 169, 98, 0.3)"
        }} />
        
        {/* Dots */}
        <div style={{ display: "flex", gap: "6px" }}>
          {Array.from({ length: totalBookPages }).map((_, idx) => (
            <div
              key={idx}
              onClick={() => {
                if (idx !== currentPage) {
                  playPageFlipSound();
                  setFlipDirection(idx > currentPage ? 'next' : 'prev');
                  setCurrentPage(idx);
                }
              }}
              className={`page-indicator ${currentPage === idx ? 'active' : ''}`}
              style={{
                width: currentPage === idx ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: currentPage === idx 
                  ? "var(--book-gold)" 
                  : "rgba(248, 244, 235, 0.25)",
                cursor: "pointer",
                boxShadow: currentPage === idx 
                  ? "0 0 8px rgba(201, 169, 98, 0.4)" 
                  : "none",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
