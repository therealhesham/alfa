"use client";

import { useEffect } from "react";
import type { SiteSettings } from "@/lib/data";

interface FontsProviderProps {
  settings: SiteSettings | null;
  children: React.ReactNode;
}

// Helper function to check if a font is available
function checkFontAvailability(fontFamily: string): boolean {
  if (typeof document === 'undefined') return false;
  
  try {
    // Create a test element with the font
    const testElement = document.createElement('span');
    testElement.style.fontFamily = fontFamily;
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.style.fontSize = '72px';
    testElement.textContent = 'mmmmmmmmmmlli';
    document.body.appendChild(testElement);
    
    // Get computed style
    const computedStyle = window.getComputedStyle(testElement);
    const font = computedStyle.fontFamily;
    
    // Remove test element
    document.body.removeChild(testElement);
    
    // Check if font was applied (basic check)
    return font.includes(fontFamily.split(',')[0].trim().replace(/['"]/g, ''));
  } catch (error) {
    return false;
  }
}

export default function FontsProvider({ settings, children }: FontsProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Default project fonts - All using DG Kufi
    const defaultKufiFont = 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif';
    const defaultPrimaryFont = defaultKufiFont;
    const defaultHeadingFont = defaultKufiFont;
    const defaultBodyFont = defaultKufiFont;
    const defaultDecorativeFont = defaultKufiFont;
    
    // Log initial state
    if (isDevelopment) {
      console.log('🔤 FontsProvider: Applying fonts...', {
        hasSettings: !!settings,
        primaryFont: settings?.primaryFont || 'not set',
        headingFont: settings?.headingFont || 'not set',
        bodyFont: settings?.bodyFont || 'not set',
      });
    }
    
    // Apply fonts from settings if available, otherwise use defaults
    if (settings) {
      // For non-Arabic locales, apply fonts from settings if available
      if (settings.primaryFont) {
        root.style.setProperty('--primary-font', settings.primaryFont);
        if (isDevelopment) {
          const isAvailable = checkFontAvailability(settings.primaryFont);
          console.log(`✅ Primary Font Applied: ${settings.primaryFont}`, { isAvailable });
        }
      }
      if (settings.headingFont) {
        root.style.setProperty('--heading-font', settings.headingFont);
        if (isDevelopment) {
          const isAvailable = checkFontAvailability(settings.headingFont);
          console.log(`✅ Heading Font Applied: ${settings.headingFont}`, { isAvailable });
        }
      }
      if (settings.bodyFont) {
        root.style.setProperty('--body-font', settings.bodyFont);
        document.body.style.fontFamily = 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif';
        if (isDevelopment) {
          const isAvailable = checkFontAvailability(settings.bodyFont);
          console.log(`✅ Body Font Applied: ${settings.bodyFont}`, { isAvailable });
        }
      }
    }
    
    // Ensure CSS variables are always set (fallback to project defaults if settings not available)
    if (!root.style.getPropertyValue('--primary-font')) {
      root.style.setProperty('--primary-font', defaultPrimaryFont);
      if (isDevelopment) {
        console.log('⚠️ Using default primary font: DG Kufi');
      }
    }
    if (!root.style.getPropertyValue('--heading-font')) {
      root.style.setProperty('--heading-font', defaultHeadingFont);
      if (isDevelopment) {
        console.log('⚠️ Using default heading font: DG Kufi');
      }
    }
    if (!root.style.getPropertyValue('--body-font')) {
      root.style.setProperty('--body-font', defaultBodyFont);
      document.body.style.fontFamily = defaultBodyFont;
      if (isDevelopment) {
        console.log('⚠️ Using default body font: DG Kufi');
      }
    }
    if (!root.style.getPropertyValue('--decorative-font')) {
      root.style.setProperty('--decorative-font', defaultDecorativeFont);
      if (isDevelopment) {
        console.log('⚠️ Using default decorative font: DG Kufi');
      }
    }
    
    // Log final CSS variables
    if (isDevelopment) {
      console.log('📋 Final CSS Variables:', {
        '--primary-font': root.style.getPropertyValue('--primary-font') || getComputedStyle(root).getPropertyValue('--primary-font'),
        '--heading-font': root.style.getPropertyValue('--heading-font') || getComputedStyle(root).getPropertyValue('--heading-font'),
        '--body-font': root.style.getPropertyValue('--body-font') || getComputedStyle(root).getPropertyValue('--body-font'),
      });
    }
  }, [settings]);

  return <>{children}</>;
}

