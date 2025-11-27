import Image from "next/image";
import type { Locale } from "@/i18n";
import type { SiteSettings } from "@/lib/data";

interface FooterProps {
  locale: Locale;
  settings: SiteSettings | null;
  footerLogo?: string;
  footerCopyright?: string;
  companyName?: string;
  addressLabel?: string;
  addressValue?: string;
  phoneLabelInfo?: string;
  phoneValue?: string;
}

export default function Footer({
  locale,
  settings,
  footerLogo,
  footerCopyright,
  companyName,
  addressLabel,
  addressValue,
  phoneLabelInfo,
  phoneValue,
}: FooterProps) {
  return (
    <footer style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo-section">
            <Image
              src={footerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
              alt="Logo"
              width={140}
              height={140}
              className="footer-logo-img"
              unoptimized
            />
            {companyName && (
              <h2 className="footer-company-name" style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                {companyName}
              </h2>
            )}
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-info">
            {addressValue && (
              <div className="footer-info-item">
                <div className="footer-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="footer-info-content">
                  {addressLabel && (
                    <h3 style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                      {addressLabel}
                    </h3>
                  )}
                  <p style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                    {addressValue}
                  </p>
                </div>
              </div>
            )}

            {phoneValue && (
              <div className="footer-info-item">
                <div className="footer-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="footer-info-content">
                  {phoneLabelInfo && (
                    <h3 style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                      {phoneLabelInfo}
                    </h3>
                  )}
                  <p style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                    {phoneValue}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="footer-social-icons">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="footer-social-icon"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="footer-social-icon"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
          </svg>
        </a>
        <a
          href="https://www.x.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          className="footer-social-icon"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>

      {footerCopyright && (
        <div className="footer-bottom">
          <p className="footer-copyright" style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
            {footerCopyright}
          </p>
        </div>
      )}
    </footer>
  );
}

