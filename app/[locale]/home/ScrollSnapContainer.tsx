'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ReactNode, useRef, Children, useEffect, useState, useCallback } from 'react';

interface ScrollSnapContainerProps {
  children: ReactNode;
}

export function ScrollSnapContainer({ children }: ScrollSnapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth spring animation for scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Create elegant parallax effects
  const backgroundY = useTransform(smoothProgress, [0, 1], ['0%', '15%']);
  const backgroundOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.03, 0.06, 0.03]);

  // Convert children to array
  const childrenArray = Children.toArray(children);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle scroll events to detect current section
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        
        // Only snap on desktop
        if (!isMobile) {
          // Snap to nearest section when scrolling stops
          const sections = container.querySelectorAll('.scroll-snap-section, section');
          let nearestIdx = 0;
          let minDistance = Infinity;

          sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            // Calculate distance from section top to container top
            const distance = Math.abs(rect.top - containerRect.top);
            
            if (distance < minDistance) {
              minDistance = distance;
              nearestIdx = index;
            }
          });

          // If not perfectly aligned, snap to nearest section
          if (minDistance > 5) {
            const targetSection = sections[nearestIdx] as HTMLElement;
            if (targetSection) {
              targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }
      }, 150);

      // Calculate current section based on scroll position
      // Find which section is most visible in viewport
      const sections = container.querySelectorAll('.scroll-snap-section, section');
      let currentIdx = 0;
      let maxVisibility = 0;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate how much of the section is visible
        const visibleTop = Math.max(rect.top, containerRect.top);
        const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / containerRect.height;

        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          currentIdx = index;
        }
      });

      setCurrentSection(currentIdx);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMobile]);

  // Improved wheel event handling for better snap behavior (desktop only)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isMobile) return; // Skip on mobile

    let isThrottled = false;
    let lastScrollTime = 0;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      const timeSinceLastScroll = now - lastScrollTime;

      // Throttle rapid scroll events
      if (timeSinceLastScroll < 50) {
        return;
      }

      lastScrollTime = now;

      // For trackpad users, allow natural scrolling
      if (Math.abs(e.deltaY) < 50) {
        return;
      }

      // Prevent rapid section jumping
      if (isThrottled) {
        e.preventDefault();
        return;
      }

      isThrottled = true;
      setTimeout(() => {
        isThrottled = false;
      }, 800);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [isMobile]);

  // Keyboard navigation (desktop only)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isMobile) return; // Skip on mobile

    const handleKeyDown = (e: KeyboardEvent) => {
      const sections = container.querySelectorAll('.scroll-snap-section, section');
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextSection = Math.min(currentSection + 1, sections.length - 1);
        const targetSection = sections[nextSection] as HTMLElement;
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevSection = Math.max(currentSection - 1, 0);
        const targetSection = sections[prevSection] as HTMLElement;
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        container.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      } else if (e.key === 'End') {
        e.preventDefault();
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSection, childrenArray.length, isMobile]);

  return (
    <div
      ref={containerRef}
      className="scroll-snap-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollSnapType: isMobile ? 'none' : 'y mandatory', // Disable snap on mobile
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        direction: 'ltr', // Force scrollbar to right side
        scrollPaddingTop: '0px',
      }}
    >
      {/* Elegant animated background gradient */}
      <motion.div
        className="scroll-snap-background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          y: backgroundY,
          opacity: backgroundOpacity,
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(212, 193, 157, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />
      {/* Additional subtle gradient layer */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          opacity: useTransform(smoothProgress, [0, 1], [0.02, 0.05]),
          background: 'radial-gradient(ellipse 60% 40% at 20% 30%, rgba(232, 217, 192, 0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      
      {/* Scroll Progress Indicator - Hide on mobile */}
      {!isMobile && (
      <div
        style={{
          position: 'fixed',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none',
        }}
      >
        {childrenArray.map((_, index) => (
          <motion.div
            key={index}
            style={{
              width: currentSection === index ? '12px' : '8px',
              height: currentSection === index ? '12px' : '8px',
              borderRadius: '50%',
              backgroundColor: currentSection === index ? 'var(--gold, #D4C19D)' : 'rgba(212, 193, 157, 0.3)',
              transition: 'all 0.3s ease',
              border: currentSection === index ? '2px solid var(--gold, #D4C19D)' : '1px solid rgba(212, 193, 157, 0.3)',
            }}
          />
        ))}
      </div>
      )}

      {/* Content wrapper - ensures all mouse interactions work */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: 'auto', // Ensure mouse interactions work
        }}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            style={{
              width: '100%',
              minHeight: isMobile ? 'auto' : '100vh', // Auto height on mobile for natural scroll
              flexShrink: 0,
              scrollSnapAlign: isMobile ? 'none' : 'start', // Disable snap align on mobile
              scrollSnapStop: isMobile ? 'normal' : 'always', // Normal stop on mobile
              pointerEvents: 'auto', // Ensure mouse interactions work
              position: 'relative',
              scrollMarginTop: '0px',
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
