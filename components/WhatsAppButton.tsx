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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
            fill="white"
          />
        </svg>
      </a>

      <style jsx>{`
        .whatsapp-button {
          position: fixed;
          bottom: 2rem;
          left: 2rem;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #0F1C2A 0%, #D4C19D 100%);
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
          border: 3px solid rgba(212, 193, 157, 0.3);
          backdrop-filter: blur(10px);
        }

        .whatsapp-button.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .whatsapp-button:hover {
          transform: scale(1.1) translateY(-2px);
          background: linear-gradient(135deg, #D4C19D 0%, #0F1C2A 100%);
          box-shadow: 0 12px 32px rgba(212, 193, 157, 0.5),
                      0 6px 16px rgba(15, 28, 42, 0.4);
          border-color: rgba(212, 193, 157, 0.5);
        }

        .whatsapp-button:active {
          transform: scale(1.05) translateY(0);
        }

        .whatsapp-button svg {
          width: 36px;
          height: 36px;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
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
            border-width: 2px;
          }

          [dir="rtl"] .whatsapp-button {
            right: 1.5rem;
          }

          .whatsapp-button svg {
            width: 30px;
            height: 30px;
          }
        }

        @media (max-width: 480px) {
          .whatsapp-button {
            width: 52px;
            height: 52px;
            bottom: 1rem;
            left: 1rem;
            border-width: 2px;
          }

          [dir="rtl"] .whatsapp-button {
            right: 1rem;
          }

          .whatsapp-button svg {
            width: 28px;
            height: 28px;
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

