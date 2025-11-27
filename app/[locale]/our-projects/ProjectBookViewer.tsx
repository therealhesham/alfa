"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Tag } from "lucide-react";

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Combine main image with additional images
  const allImages = project.images && project.images.length > 0 
    ? [project.image, ...project.images]
    : [project.image];
  
  const totalPages = allImages.length;
  const isRTL = locale === "ar";

  const playPageFlipSound = () => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/pagesound.mp3');
        audioRef.current.volume = 0.4;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((e) => console.log('Audio autoplay blocked', e));
    } catch (e) { console.log(e); }
  };

  const changePage = (direction: 'next' | 'prev') => {
    if (isFlipping) return;
    
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    
    if (newPage >= 0 && newPage < totalPages) {
      playPageFlipSound();
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(newPage);
        setIsFlipping(false);
      }, 300); // Matches CSS animation duration
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

  return (
    <div 
      className="book-viewer-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "2000px",
        overflow: "hidden"
      }}
    >
      {/* --- 1. ATMOSPHERIC BACKGROUND --- */}
      <div 
        style={{
          position: "absolute",
          inset: "-20px", // Negative margin to prevent blur edge artifacts
          zIndex: -1,
        }}
      >
        <Image
          src={project.image}
          alt="Background atmosphere"
          fill
          style={{ 
            objectFit: "cover", 
            filter: "blur(30px) brightness(0.4)",
            transform: "scale(1.1)" // Zoom in slightly to enhance abstract feel
          }}
          priority
        />
        {/* Noise Texture Overlay for grain */}
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* --- CLICK OUTSIDE LAYER --- */}
      <div 
        onClick={onClose} 
        style={{ position: "absolute", inset: 0, cursor: "pointer" }} 
      />

      {/* --- STYLES --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bookIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pageFlip {
          0% { transform: rotateY(0deg); filter: brightness(1); }
          50% { transform: rotateY(${isRTL ? '90deg' : '-90deg'}); filter: brightness(0.8); }
          100% { transform: rotateY(0deg); filter: brightness(1); }
        }
        .book-container { animation: bookIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .flipping-page { animation: pageFlip 0.6s ease-in-out; }
        .glass-btn {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.2s ease;
        }
        .glass-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        /* Custom scrollbar for description if it gets too long */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(212, 193, 157, 0.3); border-radius: 4px; }
      `}} />

      {/* --- MAIN BOOK CONTAINER --- */}
      <div
    className="book-container"
    style={{
      position: "relative",
      
      // 1. التعديلات هنا:
      width: "95vw",          // كان 90vw (خليناه يعرض أكتر)
      maxWidth: "1600px",     // كان 1100px (ده اللي كان حاجمه في الشاشات الكبيرة)
      maxHeight: "90vh",      // كان 85vh (عشان يطول شوية)
      
      aspectRatio: "16/9",    // بيحافظ على شكل المستطيل السينمائي للكتاب
      display: "flex",
      boxShadow: "0 50px 100px -20px rgba(0,0,0,0.7)",
    }}
      >
        {/* --- CLOSE BUTTON --- */}
        <button
          onClick={onClose}
          className="glass-btn"
          style={{
            position: "absolute",
            top: "-60px",
            [isRTL ? "left" : "right"]: "0",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            zIndex: 50
          }}
        >
          <X size={20} />
        </button>

        {/* ================= LEFT PAGE (INFO) ================= */}
        <div
          style={{
            flex: 1,
            background: "#1a1a1a", // Slightly lighter dark for contrast
            position: "relative",
            borderRadius: isRTL ? "0 8px 8px 0" : "8px 0 0 8px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            // The Gutter Shadow (Inner spine)
            boxShadow: `inset ${isRTL ? "15px" : "-15px"} 0 40px -10px rgba(0,0,0,0.6)`
          }}
        >
          {/* Subtle Paper Grain Overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.05,
            pointerEvents: "none"
          }}/>

          {/* Golden Border Line */}
          <div style={{
            position: "absolute",
            top: "20px", bottom: "20px",
            [isRTL ? "right" : "left"]: "20px",
            [isRTL ? "left" : "right"]: "30px", // More space on spine side
            border: "1px solid rgba(212, 193, 157, 0.2)",
            pointerEvents: "none"
          }} />

          {/* Content Area */}
          <div className="custom-scroll" style={{
            padding: "3.5rem",
            paddingRight: isRTL ? "3.5rem" : "4.5rem", // Extra padding near spine
            paddingLeft: isRTL ? "4.5rem" : "3.5rem",
            height: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            zIndex: 2
          }}>
            
            {/* Header Meta */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              {project.category && (
                <span style={{ 
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "2px",
                  color: "var(--gold)", border: "1px solid rgba(212, 193, 157, 0.4)",
                  padding: "6px 12px", borderRadius: "100px"
                }}>
                  <Tag size={12} /> {project.category}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
              fontFamily: "var(--font-heading, serif)", // Fallback to serif
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)"
            }}>
              {project.title}
            </h2>

            {/* Description */}
            <p style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.75)",
              marginBottom: "auto", // Pushes meta to bottom
              textAlign: "justify"
            }}>
              {project.description}
            </p>

            {/* Footer Meta */}
            <div style={{ 
              marginTop: "2.5rem", 
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem"
            }}>
              {project.location && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.6)" }}>
                  <MapPin size={18} color="var(--gold)" />
                  <span style={{ fontSize: "0.9rem" }}>{project.location}</span>
                </div>
              )}
              {project.year && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "rgba(255,255,255,0.6)" }}>
                  <Calendar size={18} color="var(--gold)" />
                  <span style={{ fontSize: "0.9rem" }}>{project.year}</span>
                </div>
              )}
            </div>

            {/* Page Counter */}
            <div style={{ 
              marginTop: "1.5rem", 
              fontSize: "0.8rem", 
              color: "rgba(255,255,255,0.3)",
              textAlign: isRTL ? "left" : "right"
            }}>
              {currentPage + 1} / {totalPages}
            </div>
          </div>
        </div>

        {/* ================= RIGHT PAGE (IMAGE) ================= */}
        <div
          className={isFlipping ? "flipping-page" : ""}
          style={{
            flex: 1,
            position: "relative",
            background: "#000",
            borderRadius: isRTL ? "8px 0 0 8px" : "0 8px 8px 0",
            overflow: "hidden",
            cursor: "pointer",
            transformOrigin: isRTL ? "right center" : "left center",
            // The Gutter Shadow for the right page
            boxShadow: `inset ${isRTL ? "-15px" : "15px"} 0 40px -10px rgba(0,0,0,0.6)`
          }}
          onClick={() => changePage('next')}
        >
          <Image
            src={allImages[currentPage] || project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
            priority={currentPage === 0}
          />
          
          {/* Subtle vignette for depth */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, transparent 80%, rgba(0,0,0,0.4) 100%)",
            pointerEvents: "none"
          }} />

          {/* Hint Overlay (Only on first page hover usually, but keeping simple) */}
          {currentPage < totalPages - 1 && (
            <div style={{
              position: "absolute",
              bottom: "20px",
              [isRTL ? "left" : "right"]: "20px",
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              padding: "8px",
              borderRadius: "50%",
              color: "white",
              opacity: 0.7,
              pointerEvents: "none"
            }}>
             {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </div>
          )}
        </div>

        {/* --- NAVIGATION ARROWS (Floating) --- */}
        {currentPage > 0 && (
          <button
            onClick={() => changePage('prev')}
            className="glass-btn"
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "right" : "left"]: "-70px",
              transform: "translateY(-50%)",
              width: "50px", height: "50px",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", zIndex: 10
            }}
          >
            {isRTL ? <ChevronRight /> : <ChevronLeft />}
          </button>
        )}

        {currentPage < totalPages - 1 && (
          <button
            onClick={() => changePage('next')}
            className="glass-btn"
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "left" : "right"]: "-70px",
              transform: "translateY(-50%)",
              width: "50px", height: "50px",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", zIndex: 10
            }}
          >
            {isRTL ? <ChevronLeft /> : <ChevronRight />}
          </button>
        )}
      </div>

      {/* --- BOTTOM THUMBNAILS (Optional) --- */}
      <div style={{
        position: "absolute",
        bottom: "3vh",
        display: "flex",
        gap: "8px",
        zIndex: 10
      }}>
        {allImages.map((_, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (idx !== currentPage) {
                playPageFlipSound();
                setCurrentPage(idx);
              }
            }}
            style={{
              width: currentPage === idx ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: currentPage === idx ? "var(--gold)" : "rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
            }}
          />
        ))}
      </div>
    </div>
  );
}