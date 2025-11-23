"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getTranslations } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import type { Locale } from "@/i18n";
import type { SiteSettings } from "@/lib/data";
import { Home, Info, Briefcase, FolderOpen, Mail, Globe } from "lucide-react";

interface HeaderProps {
  locale: Locale;
  settings: SiteSettings | null;
  headerLogo?: string;
  isHomePage?: boolean;
}

export default function Header({ locale, settings, headerLogo, isHomePage = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const t = getTranslations(locale);

  // Track active section on scroll
  useEffect(() => {
    if (!isHomePage) return;

    const handleScroll = () => {
      const sections = ['hero', 'about', 'services', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Show/hide mobile nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (isHomePage) {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className={isMenuOpen ? "menu-active desktop-header" : "desktop-header"}>
        <Link href={`/${locale}/home`}>
          <Image
            src={headerLogo || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
            alt={t.common.logoAlt}
            width={75}
            height={75}
            className="logo"
            unoptimized
          />
        </Link>
        <nav>
          {settings?.showHome !== false && (
            <Link href={`/${locale}/home`}>
              {t.nav.home}
            </Link>
          )}
          {settings?.showAbout !== false && (
            isHomePage ? (
              <a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>
                {t.nav.about}
              </a>
            ) : (
              <Link href={`/${locale}/about-us`}>
                {t.nav.about}
              </Link>
            )
          )}
          {settings?.showServices !== false && (
            isHomePage ? (
              <a href="#services" onClick={(e) => handleSmoothScroll(e, 'services')}>
                {t.nav.services}
              </a>
            ) : (
              <Link href={`/${locale}/home#services`}>
                {t.nav.services}
              </Link>
            )
          )}
          {settings?.showProjects !== false && (
            isHomePage ? (
              <a href="#projects" onClick={(e) => handleSmoothScroll(e, 'projects')}>
                {t.nav.projects}
              </a>
            ) : (
              <Link href={`/${locale}/home#projects`}>
                {t.nav.projects}
              </Link>
            )
          )}
          {settings?.showContact !== false && (
            isHomePage ? (
              <a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>
                {t.nav.contact}
              </a>
            ) : (
              <Link href={`/${locale}/contact-us`}>
                {t.nav.contact}
              </Link>
            )
          )}
          {settings?.showLanguageSwitcher !== false && (
            <LanguageSwitcher currentLocale={locale} />
          )}
        </nav>
      </header>

      {/* Mobile Floating Icon Navigation */}
      <nav className={`mobile-icon-nav ${isVisible ? 'visible' : 'hidden'}`}>
        {settings?.showHome !== false && (
          <Link 
            href={`/${locale}/home`}
            className={`mobile-nav-icon ${activeSection === 'hero' ? 'active' : ''}`}
            title={t.nav.home}
          >
            <Home size={20} strokeWidth={2.5} />
            <span className="icon-label">{t.nav.home}</span>
          </Link>
        )}
        {settings?.showAbout !== false && (
          isHomePage ? (
            <a 
              href="#about" 
              onClick={(e) => handleSmoothScroll(e, 'about')}
              className={`mobile-nav-icon ${activeSection === 'about' ? 'active' : ''}`}
              title={t.nav.about}
            >
              <Info size={20} strokeWidth={2.5} />
              <span className="icon-label">{t.nav.about}</span>
            </a>
          ) : (
            <Link 
              href={`/${locale}/about-us`}
              className="mobile-nav-icon"
              title={t.nav.about}
            >
              <Info size={20} strokeWidth={2.5} />
              <span className="icon-label">{t.nav.about}</span>
            </Link>
          )
        )}
        {settings?.showServices !== false && (
          isHomePage ? (
            <a 
              href="#services" 
              onClick={(e) => handleSmoothScroll(e, 'services')}
              className={`mobile-nav-icon ${activeSection === 'services' ? 'active' : ''}`}
              title={t.nav.services}
            >
              <Briefcase size={20} strokeWidth={2.5} />
              <span className="icon-label">{t.nav.services}</span>
            </a>
          ) : (
            <Link 
              href={`/${locale}/home#services`}
              className="mobile-nav-icon"
              title={t.nav.services}
            >
              <Briefcase size={20} strokeWidth={2.5} />
              <span className="icon-label">{t.nav.services}</span>
            </Link>
          )
        )}
        {settings?.showProjects !== false && (
          isHomePage ? (
            <a 
              href="#projects" 
              onClick={(e) => handleSmoothScroll(e, 'projects')}
              className={`mobile-nav-icon ${activeSection === 'projects' ? 'active' : ''}`}
              title={t.nav.projects}
            >
              <FolderOpen size={20} strokeWidth={2.5} />
              <span className="icon-label">{t.nav.projects}</span>
            </a>
          ) : (
            <Link 
              href={`/${locale}/home#projects`}
              className="mobile-nav-icon"
              title={t.nav.projects}
            >
              <FolderOpen size={20} strokeWidth={2.5} />
              <span className="icon-label">{t.nav.projects}</span>
            </Link>
          )
        )}
        {settings?.showContact !== false && (
          isHomePage ? (
            <a 
              href="#contact" 
              onClick={(e) => handleSmoothScroll(e, 'contact')}
              className={`mobile-nav-icon ${activeSection === 'contact' ? 'active' : ''}`}
              title={t.nav.contact}
            >
              <Mail size={20} strokeWidth={2.5} />
              <span className="icon-label">{t.nav.contact}</span>
            </a>
          ) : (
            <Link 
              href={`/${locale}/contact-us`}
              className="mobile-nav-icon"
              title={t.nav.contact}
            >
              <Mail size={20} strokeWidth={2.5} />
              <span className="icon-label">{t.nav.contact}</span>
            </Link>
          )
        )}
        {settings?.showLanguageSwitcher !== false && (
          <Link 
            href={locale === 'ar' ? '/en/home' : '/ar/home'}
            className="mobile-nav-icon language-icon"
            title={locale === 'ar' ? 'English' : 'العربية'}
          >
            <Globe size={20} strokeWidth={2.5} />
            <span className="icon-label">{locale === 'ar' ? 'English' : 'العربية'}</span>
          </Link>
        )}
      </nav>
    </>
  );
}

