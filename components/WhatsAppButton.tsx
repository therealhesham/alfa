"use client";

import { useState, useEffect } from "react";
import type { SiteSettings } from "@/lib/data";

interface WhatsAppButtonProps {
  settings: SiteSettings | null;
}

export default function WhatsAppButton({ settings }: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after page load
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!settings?.whatsappNumber) {
    return null;
  }

  // Clean phone number (remove spaces, dashes, etc.)
  const cleanNumber = settings.whatsappNumber.replace(/[\s\-\(\)]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}`;

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`whatsapp-button ${isVisible ? 'visible' : ''}`}
        aria-label="Contact us on WhatsApp"
      >
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Black circle background */}
          <circle cx="32" cy="32" r="32" fill="#111111" />
          {/* Gold ring border */}
          <circle cx="32" cy="32" r="29" stroke="#D4C19D" strokeWidth="1.5" fill="none" opacity="0.6" />
          {/* WhatsApp icon in gold */}
          <path d="M32 16C23.164 16 16 23.164 16 32c0 2.84.747 5.508 2.055 7.82L16 48l8.38-2.016A15.934 15.934 0 0032 48c8.836 0 16-7.164 16-16S40.836 16 32 16zm0 29.09a13.04 13.04 0 01-6.628-1.8l-.476-.283-4.94 1.188 1.243-4.4-.31-.452A13.04 13.04 0 0118.91 32c0-7.22 5.87-13.09 13.09-13.09S45.09 24.78 45.09 32 39.22 45.09 32 45.09z" fill="#D4C19D" />
          <path d="M39.02 35.26c-.39-.196-2.3-1.135-2.657-1.264-.357-.13-.617-.195-.877.196-.26.39-1.005 1.264-1.233 1.524-.227.26-.455.292-.844.098-.39-.196-1.644-.606-3.13-1.932-1.157-1.032-1.938-2.306-2.165-2.697-.227-.39-.024-.6.17-.795.175-.174.39-.455.585-.682.195-.228.26-.39.39-.65.13-.26.065-.488-.033-.683-.098-.195-.877-2.114-1.202-2.894-.316-.76-.638-.657-.877-.67-.227-.01-.487-.013-.747-.013a1.43 1.43 0 00-1.04.487c-.357.39-1.364 1.333-1.364 3.25s1.397 3.77 1.592 4.03c.195.26 2.748 4.194 6.658 5.882.93.402 1.655.64 2.22.82.934.296 1.784.254 2.454.154.748-.112 2.3-.94 2.626-1.848.325-.91.325-1.688.227-1.85-.096-.163-.357-.26-.747-.455z" fill="#D4C19D" />
        </svg>
      </a>

      <style jsx>{`
        .whatsapp-button {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          width: 64px;
          height: 64px;
          background: none;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(15, 28, 42, 0.4),
                      0 4px 12px rgba(212, 193, 157, 0.3);
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          transform: scale(0.8) translateY(20px);
          cursor: pointer;
          text-decoration: none;
        }

        .whatsapp-button.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .whatsapp-button:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 12px 32px rgba(212, 193, 157, 0.5),
                      0 6px 16px rgba(15, 28, 42, 0.4);
        }

        .whatsapp-button:active {
          transform: scale(1.05) translateY(0);
        }

        .whatsapp-button svg {
          width: 64px;
          height: 64px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.35));
        }

        [dir="rtl"] .whatsapp-button {
          left: auto;
          right: 2rem;
        }

        @media (max-width: 768px) {
          .whatsapp-button {
            width: 56px;
            height: 56px;
            bottom: 1.5rem;
            left: 1.5rem;
          }

          [dir="rtl"] .whatsapp-button {
            right: 1.5rem;
          }

          .whatsapp-button svg {
            width: 56px;
            height: 56px;
          }
        }

        @media (max-width: 480px) {
          .whatsapp-button {
            width: 52px;
            height: 52px;
            bottom: 1rem;
            left: 1rem;
          }

          [dir="rtl"] .whatsapp-button {
            right: 1rem;
          }

          .whatsapp-button svg {
            width: 52px;
            height: 52px;
          }
        }

        /* Pulse animation */
        @keyframes pulse {
          0% {
            box-shadow: 0 8px 24px rgba(15, 28, 42, 0.4),
                        0 4px 12px rgba(212, 193, 157, 0.3);
          }
          50% {
            box-shadow: 0 12px 32px rgba(212, 193, 157, 0.6),
                        0 6px 16px rgba(15, 28, 42, 0.5);
          }
          100% {
            box-shadow: 0 8px 24px rgba(15, 28, 42, 0.4),
                        0 4px 12px rgba(212, 193, 157, 0.3);
          }
        }

        .whatsapp-button.visible {
          animation: pulse 2s ease-in-out infinite;
        }

        /* Ripple effect on click */
        @keyframes ripple {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .whatsapp-button::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(212, 193, 157, 0.3);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .whatsapp-button:hover::before {
          opacity: 1;
        }
      `}</style>
    </>
  );
}

