'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ReactNode, useRef, Children } from 'react';

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

  // Convert children to array
  const childrenArray = Children.toArray(children);

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
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
        direction: 'ltr', // Force scrollbar to right side
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
              minHeight: '100vh',
              flexShrink: 0,
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              pointerEvents: 'auto', // Ensure mouse interactions work
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
