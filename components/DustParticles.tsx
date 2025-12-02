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
      fullScreen: {
        enable: false,
      },
      background: {
        color: {
          value: 'transparent',
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: false,
          },
          onHover: {
            enable: true,
            mode: 'bubble',
          },
        },
        modes: {
          bubble: {
            distance: 200,
            size: 4,
            duration: 2,
            opacity: 0.6,
            speed: 1  ,
          },
        },
      },
      particles: {
        color: {
          value: ['#D4C19D', '#ffed4e', '#ffffff', '#f4e5c2'],
        },
        links: {
          enable: false,
        },
        move: {
          direction: 'top' as const,
          enable: true,
          outModes: {
            default: 'out' as const,
            bottom: 'out' as const,
            left: 'out' as const,
            right: 'out' as const,
            top: 'out' as const,
          },
          random: true,
          speed: 0.03,
          straight: false,
          drift: 0.1,
          warp: false,
          attract: {
            enable: false,
          },
          decay: 0,
          angle: {
            offset: 0,
            value: 90,
          },
        },
        number: {
          density: {
            enable: true,
            area: 1200,
          },
          value: 45,
        },
        opacity: {
          value: { min: 0.3, max: 0.7 },
          animation: {
            enable: true,
            speed: 0.15,
            sync: false,
            startValue: 'random' as const,
            destroy: 'none' as const,
          },
        },
        shadow: {
          enable: true,
          color: '#ffd700',
          blur: 8,
        },
        shape: {
          type: 'circle' as const,
        },
        size: {
          value: { min: 0.3, max: 3 },
          animation: {
            enable: true,
            speed: 0.25,
            sync: false,
            startValue: 'random' as const,
            destroy: 'none' as const,
          },
        },
        wobble: {
          enable: true,
          distance: 10,
          speed: {
            min: 0.15,
            max: 0.4,
          },
        },
        rotate: {
          value: 0,
          random: true,
          direction: 'clockwise' as const,
          animation: {
            enable: true,
            speed: 1,
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
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        zIndex: -1,
        pointerEvents: 'none',
        filter: 'brightness(1.3) contrast(1.1)',
        opacity: 0.9,
      }}
      className={className}
    >
      <Particles
        id={id}
        particlesLoaded={particlesLoaded}
        options={options}
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
}

