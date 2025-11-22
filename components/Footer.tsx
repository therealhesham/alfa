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
    <footer>
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-logo-section">
            <Image
              src={footerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
              alt="Logo"
              width={100}
              height={100}
              unoptimized
            />
            {companyName && (
              <h2 className="footer-company-name" style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="footer-info-content">
                  {addressLabel && (
                    <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {addressLabel}
                    </h3>
                  )}
                  <p style={{ fontFamily: settings?.bodyFont }}>
                    {addressValue}
                  </p>
                </div>
              </div>
            )}

            {phoneValue && (
              <div className="footer-info-item">
                <div className="footer-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="footer-info-content">
                  {phoneLabelInfo && (
                    <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {phoneLabelInfo}
                    </h3>
                  )}
                  <p style={{ fontFamily: settings?.bodyFont }}>
                    {phoneValue}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {footerCopyright && (
        <div className="footer-bottom">
          <p className="footer-copyright" style={{ fontFamily: settings?.bodyFont }}>
            {footerCopyright}
          </p>
        </div>
      )}
    </footer>
  );
}

