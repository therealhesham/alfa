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
    // Check immediately
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Ensure mobile detection is correct
  const actualIsMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : isMobile;
  
  // Calculate total pages based on device type
  // Desktop: first page (info + image) + pairs of images
  // Mobile: info page + all images (one per page)
  const totalBookPages = actualIsMobile 
    ? 1 + allImages.length  // Info + all images
    : 1 + Math.ceil((allImages.length - 1) / 2);  // Info + pairs
  
  // Get content for current page (mobile vs desktop)
  const getPageContent = () => {
    // Double check mobile status
    const checkMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : isMobile;
    
    if (checkMobile) {
      // Mobile: Page 0 = info, Page 1+ = images
      if (currentPage === 0) {
        return { type: 'info', imageIndex: null };
      }
      return { type: 'image', imageIndex: currentPage - 1 };
    } else {
      // Desktop: original logic
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
        audioRef.current.volume = 0.4;
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
          unoptimized
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
        
        /* Mobile: Single page view */
        @media (max-width: 768px) {
          /* Don't hide book-page-info on mobile - it's needed for first page */
          /* Hide left image page on mobile, show only right */
          .book-page-image-left {
            display: none !important;
          }
          .book-page-image {
            width: 100% !important;
            flex: 1 1 100% !important;
            border-radius: 8px !important;
            box-shadow: none !important;
          }
          .book-container {
            width: 95vw !important;
            max-width: 95vw !important;
          }
          /* Show navigation arrows on mobile */
          .book-nav-arrow-prev,
          .book-nav-arrow-next {
            display: flex !important;
            left: 10px !important;
            right: 10px !important;
          }
          .book-nav-arrow-prev {
            left: 10px !important;
            right: auto !important;
          }
          .book-nav-arrow-next {
            right: 10px !important;
            left: auto !important;
          }
        }
        
        /* Desktop: Full width image when no left page */
        @media (min-width: 769px) {
          .book-page-image-full {
            width: 100% !important;
            flex: 1 1 100% !important;
          }
        }
        
        /* Mobile navigation arrows positioning */
        @media (max-width: 768px) {
          .book-nav-arrow-prev {
            left: 10px !important;
            right: auto !important;
          }
          .book-nav-arrow-next {
            right: 10px !important;
            left: auto !important;
          }
        }
      `}} />

      {/* --- MAIN BOOK CONTAINER --- */}
      <div
    className="book-container"
    style={{
      position: "relative",
      width: "95vw",
      maxWidth: "1600px",
      maxHeight: "90vh",
      aspectRatio: "16/9",
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

        {/* ================= MOBILE VIEW ================= */}
        {actualIsMobile ? (
          <>
            {currentPage === 0 ? (
              /* Mobile Info Page - Always show on page 0 */
              <div
                className={`book-page-info ${isFlipping ? "flipping-page" : ""}`}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#1a1a1a",
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
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
                  left: "20px", right: "20px",
                  border: "1px solid rgba(212, 193, 157, 0.2)",
                  pointerEvents: "none"
                }} />

                {/* Content Area */}
                <div className="custom-scroll" style={{
                  padding: "2rem",
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
                    fontSize: "clamp(1.5rem, 5vw, 2rem)",
                    fontFamily: "var(--font-heading, serif)",
                    color: "#fff",
                    lineHeight: 1.1,
                    marginBottom: "1.5rem",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)"
                  }}>
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "rgba(255,255,255,0.75)",
                    marginBottom: "auto",
                    textAlign: "justify"
                  }}>
                    {project.description}
                  </p>

                  {/* Footer Meta */}
                  <div style={{ 
                    marginTop: "2rem", 
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
                    textAlign: "center"
                  }}>
                    {currentPage + 1} / {totalBookPages}
                  </div>
                </div>
              </div>
            ) : (
              /* Mobile Image Page */
              <div
                className={`book-page-image ${isFlipping ? "flipping-page" : ""}`}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  background: "#000",
                  borderRadius: "8px",
                  overflow: "hidden",
                  cursor: "pointer",
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
                
                {/* Subtle vignette for depth */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at center, transparent 80%, rgba(0,0,0,0.4) 100%)",
                  pointerEvents: "none"
                }} />

                {/* Page Counter */}
                <div style={{
                  position: "absolute",
                  bottom: "20px",
                  [isRTL ? "left" : "right"]: "20px",
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(4px)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  color: "white",
                  fontSize: "0.8rem",
                  pointerEvents: "none"
                }}>
                  {currentPage + 1} / {totalBookPages}
                </div>

                {/* Hint Overlay */}
                {currentPage < totalBookPages - 1 && (
                  <div style={{
                    position: "absolute",
                    bottom: "60px",
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
            )}
          </>
        ) : (
          /* ================= DESKTOP VIEW ================= */
          <>
            {/* ================= LEFT PAGE (INFO) - Only on first page ================= */}
            {currentPage === 0 && (
              <div
                className="book-page-info"
                style={{
                  flex: 1,
                  background: "#1a1a1a",
                  position: "relative",
                  borderRadius: isRTL ? "0 8px 8px 0" : "8px 0 0 8px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
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
              {currentPage + 1} / {totalBookPages}
            </div>
          </div>
        </div>
        )}

            {/* ================= LEFT IMAGE PAGE (for pages after first) ================= */}
            {currentPage > 0 && pageContent.type === 'images' && pageContent.left && (
          <div
            className={`book-page-image book-page-image-left ${isFlipping ? "flipping-page" : ""}`}
            style={{
              flex: 1,
              position: "relative",
              background: "#000",
              borderRadius: isRTL ? "0 8px 8px 0" : "8px 0 0 8px",
              overflow: "hidden",
              cursor: "pointer",
              transformOrigin: isRTL ? "right center" : "left center",
              boxShadow: `inset ${isRTL ? "15px" : "-15px"} 0 40px -10px rgba(0,0,0,0.6)`
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
            
            {/* Subtle vignette for depth */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at center, transparent 80%, rgba(0,0,0,0.4) 100%)",
              pointerEvents: "none"
            }} />
          </div>
        )}

            {/* ================= RIGHT PAGE (IMAGE or INFO/WHITE) ================= */}
            {pageContent.type === 'info+image' ? (
              /* Desktop: First page right image */
              <div
                className={`book-page-image ${isFlipping ? "flipping-page" : ""}`}
                style={{
                  flex: 1,
                  position: "relative",
                  background: "#000",
                  borderRadius: isRTL ? "8px 0 0 8px" : "0 8px 8px 0",
                  overflow: "hidden",
                  cursor: "pointer",
                  transformOrigin: isRTL ? "right center" : "left center",
                  boxShadow: `inset ${isRTL ? "-15px" : "15px"} 0 40px -10px rgba(0,0,0,0.6)`
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
            
            {/* Subtle vignette for depth */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at center, transparent 80%, rgba(0,0,0,0.4) 100%)",
              pointerEvents: "none"
            }} />

            {/* Page Counter for image pages */}
            {currentPage > 0 && (
              <div style={{
                position: "absolute",
                bottom: "20px",
                [isRTL ? "left" : "right"]: "20px",
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(4px)",
                padding: "8px 16px",
                borderRadius: "20px",
                color: "white",
                fontSize: "0.8rem",
                pointerEvents: "none"
              }}>
                {currentPage + 1} / {totalBookPages}
              </div>
            )}

                {/* Hint Overlay */}
                {currentPage < totalBookPages - 1 && (
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
            ) : pageContent.type === 'images' && pageContent.right ? (
              /* Desktop: Image page with right image */
              <div
                className={`book-page-image ${isFlipping ? "flipping-page" : ""}`}
                style={{
                  flex: 1,
                  position: "relative",
                  background: "#000",
                  borderRadius: isRTL ? "8px 0 0 8px" : "0 8px 8px 0",
                  overflow: "hidden",
                  cursor: "pointer",
                  transformOrigin: isRTL ? "right center" : "left center",
                  boxShadow: `inset ${isRTL ? "-15px" : "15px"} 0 40px -10px rgba(0,0,0,0.6)`
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
                
                {/* Subtle vignette for depth */}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at center, transparent 80%, rgba(0,0,0,0.4) 100%)",
                  pointerEvents: "none"
                }} />

                {/* Page Counter */}
                <div style={{
                  position: "absolute",
                  bottom: "20px",
                  [isRTL ? "left" : "right"]: "20px",
                  background: "rgba(0,0,0,0.4)",
                  backdropFilter: "blur(4px)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  color: "white",
                  fontSize: "0.8rem",
                  pointerEvents: "none"
                }}>
                  {currentPage + 1} / {totalBookPages}
                </div>

                {/* Hint Overlay */}
                {currentPage < totalBookPages - 1 && (
                  <div style={{
                    position: "absolute",
                    bottom: "60px",
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
            ) : (
              /* Desktop: Last page - Show info page */
              <div
                className="book-page-info"
                style={{
                  flex: 1,
                  background: "#1a1a1a",
                  position: "relative",
                  borderRadius: isRTL ? "8px 0 0 8px" : "0 8px 8px 0",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: `inset ${isRTL ? "-15px" : "15px"} 0 40px -10px rgba(0,0,0,0.6)`
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
              [isRTL ? "left" : "right"]: "20px",
              border: "1px solid rgba(212, 193, 157, 0.2)",
              pointerEvents: "none"
            }} />

            {/* Content Area */}
            <div className="custom-scroll" style={{
              padding: "3.5rem",
              height: "100%",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              zIndex: 2,
              justifyContent: "center",
              alignItems: "center"
            }}>
              {/* Title */}
              <h2 style={{
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontFamily: "var(--font-heading, serif)",
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
                textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                textAlign: "center"
              }}>
                {project.title}
              </h2>

              {/* Description */}
              <p style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.75)",
                textAlign: "justify",
                maxWidth: "600px"
              }}>
                {project.description}
              </p>

              {/* Page Counter */}
              <div style={{ 
                marginTop: "2.5rem", 
                fontSize: "0.8rem", 
                color: "rgba(255,255,255,0.3)",
                textAlign: "center"
              }}>
                {currentPage + 1} / {totalBookPages}
              </div>
            </div>
          </div>
            )}
          </>
        )}

        {/* --- NAVIGATION ARROWS (Floating) --- */}
        {currentPage > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              changePage('prev');
            }}
            className={`glass-btn book-nav-arrow-prev`}
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "right" : "left"]: actualIsMobile ? "10px" : "-70px",
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

        {currentPage < totalBookPages - 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              changePage('next');
            }}
            className={`glass-btn book-nav-arrow-next`}
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "left" : "right"]: actualIsMobile ? "10px" : "-70px",
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
        {Array.from({ length: totalBookPages }).map((_, idx) => (
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