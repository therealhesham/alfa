'use client';

import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Container, Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

interface DustParticlesProps {
  id?: string;
  className?: string;
}

export default function DustParticles({ id = 'dust-particles', className = '' }: DustParticlesProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // Optional: handle when particles are loaded
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
          },
          onHover: {
            enable: false,
          },
        },
        modes: {},
      },
      particles: {
        color: {
          value: '#ffffff',
        },
        links: {
          enable: false,
        },
        move: {
          direction: 'none' as const,
          enable: true,
          outModes: {
            default: 'out' as const,
          },
          random: true,
          speed: 0.3,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 80,
        },
        opacity: {
          value: { min: 0.1, max: 0.4 },
          animation: {
            enable: true,
            speed: 0.5,
            sync: false,
          },
        },
        shape: {
          type: 'circle' as const,
        },
        size: {
          value: { min: 0.5, max: 1.5 },
          animation: {
            enable: true,
            speed: 2,
            sync: false,
          },
        },
      },
      detectRetina: true,
    }),
    []
  );

  if (!init) return null;

  return (
    <Particles
      id={id}
      particlesLoaded={particlesLoaded}
      options={options}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

