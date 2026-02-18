"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Tag, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Combine main image with additional images
  const allImages = project.images && project.images.length > 0
    ? [project.image, ...project.images]
    : [project.image];

  const isRTL = locale === "ar";
  const totalSlides = allImages.length; // Each slide is an image, first one has info

  const paginate = (newDirection: number) => {
    const nextIndex = currentIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < totalSlides) {
      setDirection(newDirection);
      setCurrentIndex(nextIndex);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") isRTL ? paginate(-1) : paginate(1);
      if (e.key === "ArrowLeft") isRTL ? paginate(1) : paginate(-1);
    };

    window.addEventListener("keydown", handleKeyPress);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document.body.style.overflow = "unset";
    };
  }, [currentIndex, isRTL, onClose]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isRTL ? -1000 : 1000) : (isRTL ? 1000 : -1000),
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? (isRTL ? -1000 : 1000) : (isRTL ? 1000 : -1000),
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 }
      }
    })
  };

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
      className="carousel-viewer-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
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
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)"
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
      </div>

      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, cursor: "pointer" }}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Spectral:ital,wght@0,300;0,400;1,300&display=swap');

        :root {
          --book-gold: #c9a962;
          --book-gold-light: #f4e4bc;
          --book-gold-dark: #8a7033;
          --book-cream: #f8f4eb;
          --book-paper: #fdfbf7;
        }

        .viewer-container {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
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
      `}} />

      <div
        className="viewer-container"
        style={{
          position: "relative",
          width: "94vw",
          maxWidth: "1400px",
          height: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* --- CLOSE BUTTON --- */}
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            position: "absolute",
            top: "-60px",
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
          <X size={20} strokeWidth={1.5} />
        </button>

        {/* --- CAROUSEL CONTENT --- */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: "0 50px 100px -20px rgba(0,0,0,0.8)",
        }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
              }}
            >
              {currentIndex === 0 ? (
                /* --- INFO SLIDE --- */
                <div style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: typeof window !== 'undefined' && window.innerWidth < 768 ? "column" : (isRTL ? "row-reverse" : "row"),
                  background: "linear-gradient(135deg, #1c1816 0%, #0f0d0b 100%)",
                }}>
                  {/* Info Text */}
                  <div style={{
                    flex: 1,
                    padding: "3rem",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}>
                    <CornerFlourish position="tl" />
                    <CornerFlourish position="bl" />

                    {/* Category */}
                    {project.category && (
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "3px",
                        color: "var(--book-gold)",
                        marginBottom: "2rem",
                        fontFamily: "'Spectral', serif",
                      }}>
                        <Tag size={14} />
                        {project.category}
                      </div>
                    )}

                    <h2 style={{
                      fontSize: "clamp(2rem, 4vw, 3.5rem)",
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "var(--book-cream)",
                      lineHeight: 1.1,
                      marginBottom: "2rem",
                    }}>
                      {project.title}
                    </h2>

                    <div style={{
                      width: "60px",
                      height: "2px",
                      background: "linear-gradient(90deg, var(--book-gold), transparent)",
                      marginBottom: "2rem"
                    }} />

                    <div className="elegant-scroll" style={{
                      overflowY: "auto",
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      color: "rgba(248, 244, 235, 0.7)",
                      fontFamily: "'Spectral', serif",
                      paddingRight: "1rem"
                    }}>
                      {project.description}
                    </div>

                    <div style={{
                      marginTop: "auto",
                      paddingTop: "2rem",
                      display: "flex",
                      gap: "2rem"
                    }}>
                      {project.location && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(248, 244, 235, 0.5)" }}>
                          <MapPin size={18} color="var(--book-gold)" />
                          <span style={{ fontSize: "0.9rem" }}>{project.location}</span>
                        </div>
                      )}
                      {project.year && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(248, 244, 235, 0.5)" }}>
                          <Calendar size={18} color="var(--book-gold)" />
                          <span style={{ fontSize: "0.9rem" }}>{project.year}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Image */}
                  <div style={{
                    flex: 1.2,
                    position: "relative",
                  }}>
                    <Image
                      src={allImages[0]}
                      alt={project.title}
                      fill
                      style={{ objectFit: "cover" }}
                      priority
                      unoptimized
                    />
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: isRTL
                        ? "linear-gradient(90deg, rgba(15,13,11,1) 0%, transparent 20%)"
                        : "linear-gradient(-90deg, rgba(15,13,11,1) 0%, transparent 20%)"
                    }} />
                  </div>
                </div>
              ) : (
                /* --- IMAGE SLIDES --- */
                <div style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  background: "#000"
                }}>
                  <Image
                    src={allImages[currentIndex]}
                    alt={`${project.title} - ${currentIndex}`}
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />

                  {/* Overlay for premium feel */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)"
                  }} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- NAVIGATION ARROWS --- */}
        {currentIndex > 0 && (
          <button
            onClick={() => paginate(-1)}
            className="nav-btn"
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "right" : "left"]: "-80px",
              transform: "translateY(-50%)",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--book-cream)",
              zIndex: 10,
              cursor: "pointer"
            }}
          >
            {isRTL ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
          </button>
        )}

        {currentIndex < totalSlides - 1 && (
          <button
            onClick={() => paginate(1)}
            className="nav-btn"
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "left" : "right"]: "-80px",
              transform: "translateY(-50%)",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--book-cream)",
              zIndex: 10,
              cursor: "pointer"
            }}
          >
            {isRTL ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
          </button>
        )}

        {/* --- INDICATORS --- */}
        <div style={{
          position: "absolute",
          bottom: "-60px",
          display: "flex",
          gap: "8px",
        }}>
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <div
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              style={{
                width: currentIndex === idx ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: currentIndex === idx ? "var(--book-gold)" : "rgba(201,169,98,0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
