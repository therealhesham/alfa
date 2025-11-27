"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Globe, Building2, Award, Layers } from "lucide-react";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

interface OurProjectsContent {
  id: string;
  heroLogo: string;
  heroTitle: string;
  heroTitleEn: string;
  heroSubtitle: string;
  heroSubtitleEn: string;
  showStats: boolean;
  stat1Icon: string;
  stat1Number: string;
  stat1Label: string;
  stat1LabelEn: string;
  stat2Icon: string;
  stat2Number: string;
  stat2Label: string;
  stat2LabelEn: string;
  stat3Icon: string;
  stat3Number: string;
  stat3Label: string;
  stat3LabelEn: string;
  galleryIcon: string;
  galleryTitle: string;
  galleryTitleEn: string;
  gallerySubtitle: string;
  gallerySubtitleEn: string;
  emptyMessage: string;
  emptyMessageEn: string;
}

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  as?: "input" | "textarea" | "h1" | "h2" | "h3" | "p";
  className?: string;
  rows?: number;
  placeholder?: string;
}

function EditableField({ 
  value, 
  onChange, 
  as = "p", 
  className = "",
  rows = 3,
  placeholder = ""
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLTextAreaElement) {
        setTimeout(() => {
          try {
            if (inputRef.current instanceof HTMLTextAreaElement) {
              const length = inputRef.current.value.length;
              inputRef.current.setSelectionRange(length, length);
            }
          } catch (e) {
            console.debug('setSelectionRange error:', e);
          }
        }, 0);
      }
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && as !== "textarea") {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const InputComponent = as === "textarea" ? "textarea" : "input";
    return (
      <InputComponent
        ref={inputRef as any}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        rows={as === "textarea" ? rows : undefined}
        className={className}
        style={{
          width: "100%",
          padding: "0.5rem",
          border: "2px solid #0070f3",
          borderRadius: "4px",
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          background: "white",
          outline: "none",
        }}
        placeholder={placeholder}
      />
    );
  }

  if (as === "textarea" || as === "input") {
    return (
      <span
        onClick={handleClick}
        className={className}
        style={{
          cursor: "pointer",
          position: "relative",
          padding: "0.25rem",
          borderRadius: "4px",
          transition: "background-color 0.2s",
          whiteSpace: as === "textarea" ? "pre-wrap" : "normal",
          display: "inline-block",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(0, 112, 243, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        title="انقر للتعديل"
      >
        {value || placeholder}
      </span>
    );
  }

  const Tag = as;
  return (
    <Tag
      onClick={handleClick}
      className={className}
      style={{
        cursor: "pointer",
        position: "relative",
        padding: "0.25rem",
        borderRadius: "4px",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(0, 112, 243, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
      title="انقر للتعديل"
    >
      {value || placeholder}
    </Tag>
  );
}

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (newPath: string) => void;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  currentLocale: Locale;
}

function EditableImage({ src, alt, onChange, width = 600, height = 400, style, currentLocale }: EditableImageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(currentLocale === "ar" ? "الرجاء اختيار ملف صورة" : "Please select an image file");
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        onChange(data.path);
      } else {
        alert(currentLocale === "ar" ? "فشل رفع الصورة" : "Failed to upload image");
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert(currentLocale === "ar" ? "حدث خطأ أثناء رفع الصورة" : "Error uploading image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
    ...style
  };

  const imageStyle: React.CSSProperties = {
    width: style?.width || width,
    height: style?.height || 'auto',
    maxWidth: style?.maxWidth || width,
    borderRadius: style?.borderRadius || '8px',
    opacity: isUploading ? 0.6 : 1,
    transition: 'opacity 0.2s',
    objectFit: 'contain'
  };

  return (
    <div
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleImageClick}
    >
      <Image
        src={src || '/capture.png'}
        alt={alt}
        width={width}
        height={height}
        style={imageStyle}
        unoptimized
      />
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            transition: 'all 0.2s',
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </div>
      )}
      {isUploading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            padding: '1rem',
            color: 'white',
            pointerEvents: 'none',
          }}
        >
          {currentLocale === "ar" ? "جاري الرفع..." : "Uploading..."}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}

// Icon map
const iconMap: { [key: string]: any } = {
  Globe,
  Building2,
  Award,
  Layers,
};

export default function AdminOurProjectsContentPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
  const [content, setContent] = useState<OurProjectsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [currentLocale]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/our-projects-content?locale=${currentLocale}`);
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    
    setSaving(true);
    setSaved(false);
    
    try {
      const response = await fetch("/api/our-projects-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...content,
          locale: currentLocale,
        }),
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchContent();
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert(currentLocale === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving content");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof OurProjectsContent, value: string | boolean) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
  };

  if (authLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{locale === "ar" ? "جاري التحقق من المصادقة..." : "Checking authentication..."}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{locale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{locale === "ar" ? "حدث خطأ في تحميل المحتوى" : "Error loading content"}</p>
      </div>
    );
  }

  const Stat1Icon = iconMap[content.stat1Icon] || Globe;
  const Stat2Icon = iconMap[content.stat2Icon] || Building2;
  const Stat3Icon = iconMap[content.stat3Icon] || Award;
  const GalleryIcon = iconMap[content.galleryIcon] || Layers;

  return (
    <>
      <AdminNav locale={locale} />
      {/* Save Button, Language Switcher, and Logout - Fixed at top */}
      <div style={{
        position: "fixed",
        top: "1rem",
        left: "1rem",
        zIndex: 10000,
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <LogoutButton />
        <div style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          backgroundColor: "white",
          padding: "0.5rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}>
          <button
            onClick={() => setCurrentLocale("ar")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: currentLocale === "ar" ? "#0070f3" : "#f0f0f0",
              color: currentLocale === "ar" ? "white" : "#333",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            عربي
          </button>
          <button
            onClick={() => setCurrentLocale("en")}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: currentLocale === "en" ? "#0070f3" : "#f0f0f0",
              color: currentLocale === "en" ? "white" : "#333",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            English
          </button>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: saving ? "#ccc" : "#000",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: saving ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontWeight: "600",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!saving && !saved) {
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {saving 
            ? (currentLocale === "ar" ? "جاري الحفظ..." : "Saving...")
            : saved 
            ? (currentLocale === "ar" ? " تم الحفظ" : " Saved")
            : (currentLocale === "ar" ? " حفظ التغييرات" : " Save Changes")
          }
        </button>
        {saved && (
          <span style={{ color: "#22c55e", fontWeight: "600" }}>
            {currentLocale === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!"}
          </span>
        )}
      </div>

      {/* Hero Section */}
      <section style={{ 
        paddingTop: '140px',
        paddingBottom: '100px',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at center top, rgba(212, 193, 157, 0.15) 0%, transparent 60%), radial-gradient(ellipse at center bottom, rgba(232, 217, 192, 0.12) 0%, transparent 60%), #000000',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '2.5rem'
          }}>
            <EditableImage
              src={content.heroLogo}
              alt={currentLocale === 'ar' ? 'شعار الشركة' : 'Company Logo'}
              onChange={(newPath) => handleChange("heroLogo", newPath)}
              width={120}
              height={120}
              currentLocale={currentLocale}
              style={{ 
                borderRadius: '50%',
                width: '120px',
                height: '120px',
                border: '3px solid var(--gold)',
                padding: '15px',
                background: 'rgba(15, 28, 42, 0.8)'
              }}
            />
          </div>

          <EditableField
            value={currentLocale === 'ar' ? (content.heroTitle || '') : (content.heroTitleEn || content.heroTitle || '')}
            onChange={(value) => {
              if (currentLocale === 'ar') {
                handleChange("heroTitle", value);
              } else {
                handleChange("heroTitleEn", value);
              }
            }}
            as="h1"
            className="hero-title"
          />
          
          <EditableField
            value={currentLocale === 'ar' ? (content.heroSubtitle || '') : (content.heroSubtitleEn || content.heroSubtitle || '')}
            onChange={(value) => {
              if (currentLocale === 'ar') {
                handleChange("heroSubtitle", value);
              } else {
                handleChange("heroSubtitleEn", value);
              }
            }}
            as="textarea"
            rows={3}
            className="hero-subtitle"
          />

          {/* Show Stats Toggle */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(212, 193, 157, 0.2)'
          }}>
            <label style={{
              color: 'var(--gold)',
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <input
                type="checkbox"
                checked={content.showStats ?? true}
                onChange={(e) => handleChange("showStats", e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              {currentLocale === 'ar' ? 'إظهار الإحصائيات' : 'Show Statistics'}
            </label>
          </div>

          {/* Quick Stats */}
          <div style={{
            display: content.showStats !== false ? 'flex' : 'none',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(212, 193, 157, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(212, 193, 157, 0.9)',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}>
              <select
                value={content.stat1Icon}
                onChange={(e) => handleChange("stat1Icon", e.target.value)}
                style={{
                  padding: '0.25rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(212, 193, 157, 0.3)',
                  background: 'rgba(15, 28, 42, 0.8)',
                  color: 'var(--gold)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="Globe">Globe</option>
                <option value="Building2">Building2</option>
                <option value="Award">Award</option>
                <option value="Layers">Layers</option>
              </select>
              <Stat1Icon size={20} style={{ color: 'var(--gold)' }} />
              <EditableField
                value={content.stat1Number || ''}
                onChange={(value) => handleChange("stat1Number", value)}
                as="input"
              />
              <EditableField
                value={currentLocale === 'ar' ? (content.stat1Label || '') : (content.stat1LabelEn || content.stat1Label || '')}
                onChange={(value) => {
                  if (currentLocale === 'ar') {
                    handleChange("stat1Label", value);
                  } else {
                    handleChange("stat1LabelEn", value);
                  }
                }}
                as="input"
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(212, 193, 157, 0.9)',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}>
              <select
                value={content.stat2Icon}
                onChange={(e) => handleChange("stat2Icon", e.target.value)}
                style={{
                  padding: '0.25rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(212, 193, 157, 0.3)',
                  background: 'rgba(15, 28, 42, 0.8)',
                  color: 'var(--gold)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="Globe">Globe</option>
                <option value="Building2">Building2</option>
                <option value="Award">Award</option>
                <option value="Layers">Layers</option>
              </select>
              <Stat2Icon size={20} style={{ color: 'var(--gold)' }} />
              <EditableField
                value={content.stat2Number || ''}
                onChange={(value) => handleChange("stat2Number", value)}
                as="input"
              />
              <EditableField
                value={currentLocale === 'ar' ? (content.stat2Label || '') : (content.stat2LabelEn || content.stat2Label || '')}
                onChange={(value) => {
                  if (currentLocale === 'ar') {
                    handleChange("stat2Label", value);
                  } else {
                    handleChange("stat2LabelEn", value);
                  }
                }}
                as="input"
              />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(212, 193, 157, 0.9)',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}>
              <select
                value={content.stat3Icon}
                onChange={(e) => handleChange("stat3Icon", e.target.value)}
                style={{
                  padding: '0.25rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(212, 193, 157, 0.3)',
                  background: 'rgba(15, 28, 42, 0.8)',
                  color: 'var(--gold)',
                  fontSize: '0.9rem',
                }}
              >
                <option value="Globe">Globe</option>
                <option value="Building2">Building2</option>
                <option value="Award">Award</option>
                <option value="Layers">Layers</option>
              </select>
              <Stat3Icon size={20} style={{ color: 'var(--gold)' }} />
              <EditableField
                value={content.stat3Number || ''}
                onChange={(value) => handleChange("stat3Number", value)}
                as="input"
              />
              <EditableField
                value={currentLocale === 'ar' ? (content.stat3Label || '') : (content.stat3LabelEn || content.stat3Label || '')}
                onChange={(value) => {
                  if (currentLocale === 'ar') {
                    handleChange("stat3Label", value);
                  } else {
                    handleChange("stat3LabelEn", value);
                  }
                }}
                as="input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Gallery Section */}
      <section style={{ 
        padding: '5rem 2rem',
        background: 'radial-gradient(ellipse at center top, rgba(212, 193, 157, 0.15) 0%, transparent 60%), radial-gradient(ellipse at center bottom, rgba(232, 217, 192, 0.12) 0%, transparent 60%), #000000',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <select
                value={content.galleryIcon}
                onChange={(e) => handleChange("galleryIcon", e.target.value)}
                style={{
                  padding: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid rgba(212, 193, 157, 0.3)',
                  background: 'rgba(15, 28, 42, 0.8)',
                  color: 'var(--gold)',
                  fontSize: '1rem',
                }}
              >
                <option value="Globe">Globe</option>
                <option value="Building2">Building2</option>
                <option value="Award">Award</option>
                <option value="Layers">Layers</option>
              </select>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--gold) 0%, rgba(212, 193, 157, 0.8) 100%)',
                boxShadow: '0 15px 40px rgba(212, 193, 157, 0.3)',
                position: 'relative',
                border: '2px solid var(--dark)'
              }}>
                <GalleryIcon size={50} color="var(--dark)" strokeWidth={1.5} />
              </div>
            </div>
            <EditableField
              value={currentLocale === 'ar' ? (content.galleryTitle || '') : (content.galleryTitleEn || content.galleryTitle || '')}
              onChange={(value) => {
                if (currentLocale === 'ar') {
                  handleChange("galleryTitle", value);
                } else {
                  handleChange("galleryTitleEn", value);
                }
              }}
              as="h2"
            />
            <EditableField
              value={currentLocale === 'ar' ? (content.gallerySubtitle || '') : (content.gallerySubtitleEn || content.gallerySubtitle || '')}
              onChange={(value) => {
                if (currentLocale === 'ar') {
                  handleChange("gallerySubtitle", value);
                } else {
                  handleChange("gallerySubtitleEn", value);
                }
              }}
              as="textarea"
              rows={2}
            />
          </div>
          
          {/* Empty Message */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(212, 193, 157, 0.2)'
          }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: 'var(--gold)',
              fontWeight: 'bold'
            }}>
              {currentLocale === 'ar' ? 'رسالة عدم وجود مشاريع' : 'Empty Projects Message'}
            </label>
            <EditableField
              value={currentLocale === 'ar' ? (content.emptyMessage || '') : (content.emptyMessageEn || content.emptyMessage || '')}
              onChange={(value) => {
                if (currentLocale === 'ar') {
                  handleChange("emptyMessage", value);
                } else {
                  handleChange("emptyMessageEn", value);
                }
              }}
              as="textarea"
              rows={2}
              placeholder={currentLocale === 'ar' ? 'لا توجد مشاريع متاحة حالياً' : 'No projects available at the moment'}
            />
          </div>
        </div>
      </section>

      <style jsx global>{`
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          margin-bottom: 1.5rem;
          font-weight: 700;
          color: var(--gold);
          line-height: 1.2;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 20px rgba(212, 193, 157, 0.3);
        }
        .hero-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: rgba(212, 193, 157, 0.9);
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto 2rem;
          opacity: 0.9;
        }
      `}</style>
    </>
  );
}

