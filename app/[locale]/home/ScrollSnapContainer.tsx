'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ReactNode, useRef, useEffect } from 'react';

interface ScrollSnapContainerProps {
  children: ReactNode;
}

export function ScrollSnapContainer({ children }: ScrollSnapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Enable scroll snapping on body when component mounts
  useEffect(() => {
    document.body.style.scrollSnapType = 'y mandatory';
    document.body.style.scrollBehavior = 'smooth';
    
    return () => {
      document.body.style.scrollSnapType = '';
      document.body.style.scrollBehavior = '';
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="scroll-snap-container"
      style={{
        position: 'relative',
        width: '100%',
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
      {children}
    </motion.div>
  );
}
