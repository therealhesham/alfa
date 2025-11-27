"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Check } from "lucide-react";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

interface SiteSettings {
  id: string;
  primaryFont: string;
  headingFont: string;
  bodyFont: string;
  showHome: boolean;
  showAbout: boolean;
  showServices: boolean;
  showProjects: boolean;
  showContact: boolean;
  showLanguageSwitcher: boolean;
  whatsappNumber: string | null;
  smtpHost: string | null;
  smtpPort: string | null;
  smtpUser: string | null;
  smtpPass: string | null;
  fromEmail: string | null;
  emailEnabled: boolean;
}

export default function AdminSettingsPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/site-settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setSaving(true);
    setSaved(false);
    
    try {
      const response = await fetch("/api/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // Apply fonts to document
        applyFonts();
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(locale === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const applyFonts = () => {
    if (!settings) return;
    
    const root = document.documentElement;
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Apply fonts
    if (settings.primaryFont) {
      root.style.setProperty('--primary-font', settings.primaryFont);
    }
    if (settings.headingFont) {
      root.style.setProperty('--heading-font', settings.headingFont);
    }
    if (settings.bodyFont) {
      root.style.setProperty('--body-font', settings.bodyFont);
      document.body.style.fontFamily = settings.bodyFont;
    }
    
    // Log in development mode
    if (isDevelopment) {
      console.log('🔤 Fonts Applied from Admin:', {
        primaryFont: settings.primaryFont || 'not set',
        headingFont: settings.headingFont || 'not set',
        bodyFont: settings.bodyFont || 'not set',
      });
      
      // Verify CSS variables are set
      const primaryFont = root.style.getPropertyValue('--primary-font') || getComputedStyle(root).getPropertyValue('--primary-font');
      const headingFont = root.style.getPropertyValue('--heading-font') || getComputedStyle(root).getPropertyValue('--heading-font');
      const bodyFont = root.style.getPropertyValue('--body-font') || getComputedStyle(root).getPropertyValue('--body-font');
      
      console.log('✅ CSS Variables Set:', {
        '--primary-font': primaryFont,
        '--heading-font': headingFont,
        '--body-font': bodyFont,
      });
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string | boolean | null) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const commonFonts = [
    'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif',
    "Arial, sans-serif",
    "Helvetica, sans-serif",
    "Times New Roman, serif",
    "Georgia, serif",
    "Verdana, sans-serif",
    "Courier New, monospace",
    "Tahoma, sans-serif",
    "Trebuchet MS, sans-serif",
    "Impact, sans-serif",
    "Comic Sans MS, cursive",
    "PT Serif, serif",
    "Aboreto, cursive",
    "Montserrat, sans-serif",
    "Roboto, sans-serif",
    "Open Sans, sans-serif",
    "Lato, sans-serif",
    "Poppins, sans-serif",
    "Playfair Display, serif",
    "Merriweather, serif",
    "Cairo, sans-serif",
    "Tajawal, sans-serif",
    "Almarai, sans-serif",
  ];

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{locale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{locale === "ar" ? "حدث خطأ في تحميل الإعدادات" : "Error loading settings"}</p>
      </div>
    );
  }

  return (
    <>
      <AdminNav locale={locale} />
      <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem',
      fontFamily: settings.bodyFont
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #e0e0e0'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontFamily: settings.headingFont,
          margin: 0
        }}>
          {locale === "ar" ? "إعدادات الموقع" : "Site Settings"}
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <LogoutButton />
          <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: saving ? "#ccc" : saved ? "#22c55e" : "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: saving ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s",
          }}
        >
          {saving ? (
            locale === "ar" ? "جاري الحفظ..." : "Saving..."
          ) : saved ? (
            <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Check size={16} />
              {locale === "ar" ? "تم الحفظ" : "Saved"}
            </span>
          ) : (
            locale === "ar" ? "حفظ التغييرات" : "Save Changes"
          )}
        </button>
        </div>
      </div>

      {saved && (
        <div style={{
          padding: "1rem",
          backgroundColor: "#d4edda",
          color: "#155724",
          borderRadius: "8px",
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          {locale === "ar" ? "تم حفظ الإعدادات بنجاح!" : "Settings saved successfully!"}
        </div>
      )}

      {/* Font Settings Section */}
      <section style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontFamily: settings.headingFont,
          marginBottom: '1.5rem',
          color: '#333'
        }}>
          {locale === "ar" ? "إعدادات الخطوط" : "Font Settings"}
        </h2>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Primary Font */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#555'
            }}>
              {locale === "ar" ? "الخط الأساسي" : "Primary Font"}
            </label>
            <select
              value={settings.primaryFont}
              onChange={(e) => handleChange("primaryFont", e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                fontFamily: settings.primaryFont,
                cursor: 'pointer'
              }}
            >
              {commonFonts.map((font) => {
                // Display simpler name for DG Kufi
                const displayName = font.includes('DG Kufi') 
                  ? 'DG Kufi (الخط الافتراضي)' 
                  : font;
                return (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {displayName}
                  </option>
                );
              })}
            </select>
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#666',
              fontFamily: settings.primaryFont
            }}>
              {locale === "ar" ? "معاينة: " : "Preview: "}
              <span style={{ fontFamily: settings.primaryFont }}>
                {locale === "ar" ? "نص تجريبي للخط الأساسي" : "Sample text for primary font"}
              </span>
            </p>
          </div>

          {/* Heading Font */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#555'
            }}>
              {locale === "ar" ? "خط العناوين" : "Heading Font"}
            </label>
            <select
              value={settings.headingFont}
              onChange={(e) => handleChange("headingFont", e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                fontFamily: settings.headingFont,
                cursor: 'pointer'
              }}
            >
              {commonFonts.map((font) => {
                // Display simpler name for DG Kufi
                const displayName = font.includes('DG Kufi') 
                  ? 'DG Kufi (الخط الافتراضي)' 
                  : font;
                return (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {displayName}
                  </option>
                );
              })}
            </select>
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#666',
              fontFamily: settings.headingFont
            }}>
              {locale === "ar" ? "معاينة: " : "Preview: "}
              <span style={{ fontFamily: settings.headingFont, fontSize: '1.2rem', fontWeight: 'bold' }}>
                {locale === "ar" ? "عنوان تجريبي" : "Sample Heading"}
              </span>
            </p>
          </div>

          {/* Body Font */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#555'
            }}>
              {locale === "ar" ? "خط النص الأساسي" : "Body Font"}
            </label>
            <select
              value={settings.bodyFont}
              onChange={(e) => handleChange("bodyFont", e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #e0e0e0',
                fontSize: '1rem',
                fontFamily: settings.bodyFont,
                cursor: 'pointer'
              }}
            >
              {commonFonts.map((font) => {
                // Display simpler name for DG Kufi
                const displayName = font.includes('DG Kufi') 
                  ? 'DG Kufi (الخط الافتراضي)' 
                  : font;
                return (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {displayName}
                  </option>
                );
              })}
            </select>
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#666',
              fontFamily: settings.bodyFont
            }}>
              {locale === "ar" ? "معاينة: " : "Preview: "}
              <span style={{ fontFamily: settings.bodyFont }}>
                {locale === "ar" ? "نص تجريبي للجسم" : "Sample body text"}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp Settings */}
      <section style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontFamily: settings.headingFont,
          marginBottom: '1.5rem',
          color: '#333'
        }}>
          {locale === "ar" ? "إعدادات WhatsApp" : "WhatsApp Settings"}
        </h2>
        <p style={{ 
          color: '#666', 
          marginBottom: '1.5rem',
          fontFamily: settings.bodyFont
        }}>
          {locale === "ar" 
            ? "أدخل رقم WhatsApp الخاص بك لعرض أيقونة عائمة للتواصل" 
            : "Enter your WhatsApp number to display a floating contact button"}
        </p>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: '600',
            color: '#555',
            fontFamily: settings.bodyFont
          }}>
            {locale === "ar" ? "رقم WhatsApp" : "WhatsApp Number"}
          </label>
          <input
            type="text"
            value={settings.whatsappNumber || ''}
            onChange={(e) => handleChange("whatsappNumber", e.target.value)}
            placeholder={locale === "ar" ? "مثال: +201234567890" : "Example: +201234567890"}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '2px solid #e0e0e0',
              fontSize: '1rem',
              fontFamily: settings.bodyFont
            }}
          />
          <p style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: '#666',
            fontFamily: settings.bodyFont
          }}>
            {locale === "ar" 
              ? "تأكد من إضافة رمز الدولة (مثال: +20 لمصر)" 
              : "Make sure to include country code (e.g., +20 for Egypt)"}
          </p>
        </div>
      </section>

      {/* Email Settings */}
      <section style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginTop: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontFamily: settings.headingFont,
          marginBottom: '1.5rem',
          color: '#333'
        }}>
          {locale === "ar" ? "إعدادات البريد الإلكتروني" : "Email Settings"}
        </h2>
        <p style={{ 
          color: '#666', 
          marginBottom: '1.5rem',
          fontFamily: settings.bodyFont
        }}>
          {locale === "ar" 
            ? "قم بإعداد خادم SMTP لإرسال رسائل البريد الإلكتروني من نموذج التواصل" 
            : "Configure SMTP server to send emails from contact form"}
        </p>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: settings.bodyFont
          }}>
            <input
              type="checkbox"
              checked={settings.emailEnabled}
              onChange={(e) => handleChange('emailEnabled', e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
              {locale === "ar" ? "تفعيل إرسال البريد الإلكتروني" : "Enable Email Sending"}
            </span>
          </label>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              fontFamily: settings.bodyFont
            }}>
              {locale === "ar" ? "SMTP Host" : "SMTP Host"}
            </label>
            <input
              type="text"
              value={settings.smtpHost || ''}
              onChange={(e) => handleChange('smtpHost', e.target.value)}
              placeholder={locale === "ar" ? "مثال: smtp.gmail.com" : "e.g., smtp.gmail.com"}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: settings.bodyFont
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              fontFamily: settings.bodyFont
            }}>
              {locale === "ar" ? "SMTP Port" : "SMTP Port"}
            </label>
            <input
              type="text"
              value={settings.smtpPort || ''}
              onChange={(e) => handleChange('smtpPort', e.target.value)}
              placeholder={locale === "ar" ? "مثال: 587" : "e.g., 587"}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: settings.bodyFont
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              fontFamily: settings.bodyFont
            }}>
              {locale === "ar" ? "SMTP Username" : "SMTP Username"}
            </label>
            <input
              type="text"
              value={settings.smtpUser || ''}
              onChange={(e) => handleChange('smtpUser', e.target.value)}
              placeholder={locale === "ar" ? "اسم المستخدم أو البريد الإلكتروني" : "Username or Email"}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: settings.bodyFont
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              fontFamily: settings.bodyFont
            }}>
              {locale === "ar" ? "SMTP Password" : "SMTP Password"}
            </label>
            <input
              type="password"
              value={settings.smtpPass || ''}
              onChange={(e) => handleChange('smtpPass', e.target.value)}
              placeholder={locale === "ar" ? "كلمة المرور" : "Password"}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: settings.bodyFont
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              fontFamily: settings.bodyFont
            }}>
              {locale === "ar" ? "عنوان المرسل (From Email)" : "From Email Address"}
            </label>
            <input
              type="email"
              value={settings.fromEmail || ''}
              onChange={(e) => handleChange('fromEmail', e.target.value)}
              placeholder={locale === "ar" ? "مثال: noreply@example.com" : "e.g., noreply@example.com"}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: settings.bodyFont
              }}
            />
            <p style={{
              marginTop: '0.5rem',
              fontSize: '0.875rem',
              color: '#666',
              fontFamily: settings.bodyFont
            }}>
              {locale === "ar" 
                ? "البريد الإلكتروني الذي سيظهر كمرسل للرسائل" 
                : "The email address that will appear as the sender"}
            </p>
          </div>
        </div>
      </section>

      {/* Navbar Visibility Settings */}
      <section style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontFamily: settings.headingFont,
          marginBottom: '1.5rem',
          color: '#333'
        }}>
          {locale === "ar" ? "إعدادات شريط التنقل" : "Navigation Bar Settings"}
        </h2>
        <p style={{ 
          color: '#666', 
          marginBottom: '1.5rem',
          fontFamily: settings.bodyFont
        }}>
          {locale === "ar" 
            ? "اختر العناصر التي تريد إظهارها في شريط التنقل" 
            : "Choose which items to show in the navigation bar"}
        </p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {[
            { key: 'showHome', label: locale === "ar" ? "الرئيسية" : "Home" },
            { key: 'showAbout', label: locale === "ar" ? "من نحن" : "About Us" },
            { key: 'showServices', label: locale === "ar" ? "الخدمات" : "Services" },
            { key: 'showProjects', label: locale === "ar" ? "المشاريع" : "Projects" },
            { key: 'showContact', label: locale === "ar" ? "اتصل بنا" : "Contact Us" },
            { key: 'showLanguageSwitcher', label: locale === "ar" ? "مبدّل اللغة" : "Language Switcher" },
          ].map((item) => (
            <label
              key={item.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontFamily: settings.bodyFont
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f9f9f9';
              }}
            >
              <input
                type="checkbox"
                checked={settings[item.key as keyof SiteSettings] as boolean}
                onChange={(e) => handleChange(item.key as keyof SiteSettings, e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}

