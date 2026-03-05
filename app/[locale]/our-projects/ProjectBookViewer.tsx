"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Combine main image with additional images
  const allImages = project.images && project.images.length > 0
    ? [project.image, ...project.images]
    : [project.image];

  const isRTL = locale === "ar";
  const totalSlides = allImages.length;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const paginate = useCallback((newDirection: number) => {
    const nextIndex = currentIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < totalSlides) {
      setDirection(newDirection);
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, totalSlides]);

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
  }, [currentIndex, isRTL, onClose, paginate]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
    touchEnd.current = null;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = { x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY };
  };
  const handleTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const dx = touchEnd.current.x - touchStart.current.x;
    const dy = touchEnd.current.y - touchStart.current.y;
    const minSwipe = 50;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
      if (isRTL) {
        paginate(dx > 0 ? -1 : 1);
      } else {
        paginate(dx > 0 ? 1 : -1);
      }
    }
    touchStart.current = null;
    touchEnd.current = null;
  };

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

  const viewerContent = (
    <div
      className="carousel-viewer-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(0,0,0,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        isolation: "isolate",
        cursor: "pointer",
      }}
    >

      <style dangerouslySetInnerHTML={{
        __html: `
        .carousel-viewer-overlay { --pbv-gold: #c9a962; --pbv-cream: #f8f4eb; }
        .viewer-container { animation: pbvFadeIn 0.4s ease; }
        @keyframes pbvFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .nav-btn {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          transition: all 0.2s ease;
        }
        .nav-btn:hover { background: rgba(255,255,255,0.25); }
        .close-btn {
          background: rgba(255,255,255,0.2);
          transition: background 0.2s;
        }
        .close-btn:hover { background: rgba(255,255,255,0.35); }
        .pbv-desc { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}} />

      <div
        className="viewer-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(94vw, 1000px)",
          height: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* --- CLOSE BUTTON (inside viewport for mobile) --- */}
        <button
          onClick={onClose}
          className="close-btn"
          style={{
            position: "absolute",
            top: 12,
            [isRTL ? "left" : "right"]: 12,
            width: 44,
            height: 44,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.9)",
            zIndex: 50,
            cursor: "pointer",
          }}
        >
          <X size={22} strokeWidth={1.5} />
        </button>

        {/* --- CAROUSEL CONTENT (touch swipe support) --- */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: 12,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
                /* --- COVER: single image with overlay info --- */
                <div style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  background: "#000",
                }}>
                  <img
                    src={allImages[0]}
                    alt={project.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1.5rem 1.5rem 2rem",
                    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent)",
                  }}>
                    {project.category && (
                      <div style={{ fontSize: "0.7rem", color: "#c9a962", textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>
                        {project.category}
                      </div>
                    )}
                    <h2 style={{ color: "#fff", fontSize: "clamp(1.2rem, 3vw, 1.8rem)", margin: 0, fontWeight: 600 }}>
                      {project.title}
                    </h2>
                    <p className="pbv-desc" style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem", margin: "0.5rem 0 0", lineHeight: 1.5 }}>
                      {project.description}
                    </p>
                    {(project.location || project.year) && (
                      <div style={{ display: "flex", gap: "1rem", marginTop: 8, fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                        {project.location && <span>{project.location}</span>}
                        {project.year && <span>{project.year}</span>}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* --- IMAGE SLIDES (native img for reliable mobile display) --- */
                <div style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  background: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <img
                    src={allImages[currentIndex]}
                    alt={`${project.title} - ${currentIndex}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />

                  {/* Overlay for premium feel */}
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)",
                    pointerEvents: "none",
                  }} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- NAVIGATION ARROWS (inside viewport on mobile) --- */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            className="nav-btn"
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "right" : "left"]: isMobile ? 8 : -80,
              transform: "translateY(-50%)",
              width: isMobile ? 44 : 56,
              height: isMobile ? 44 : 56,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--pbv-cream)",
              zIndex: 10,
              cursor: "pointer",
            }}
          >
            {isRTL ? <ChevronRight size={isMobile ? 22 : 28} /> : <ChevronLeft size={isMobile ? 22 : 28} />}
          </button>
        )}

        {currentIndex < totalSlides - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            className="nav-btn"
            style={{
              position: "absolute",
              top: "50%",
              [isRTL ? "left" : "right"]: isMobile ? 8 : -80,
              transform: "translateY(-50%)",
              width: isMobile ? 44 : 56,
              height: isMobile ? 44 : 56,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--pbv-cream)",
              zIndex: 10,
              cursor: "pointer",
            }}
          >
            {isRTL ? <ChevronLeft size={isMobile ? 22 : 28} /> : <ChevronRight size={isMobile ? 22 : 28} />}
          </button>
        )}

        {/* --- INDICATORS (inside viewport on mobile) --- */}
        <div style={{
          position: "absolute",
          bottom: isMobile ? 12 : -60,
          left: "50%",
          transform: "translateX(-50%)",
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
                background: currentIndex === idx ? "var(--pbv-gold)" : "rgba(201,169,98,0.2)",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return mounted && createPortal(viewerContent, document.body);
}
