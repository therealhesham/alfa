"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Home, BarChart, Lightbulb, Ruler } from "lucide-react";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

interface HomeContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroLogo: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  visionTitle: string;
  visionVision: string;
  visionVisionText: string;
  visionMission: string;
  visionMissionText: string;
  visionValues: string;
  visionValuesText: string;
  statsTitle: string;
  statsProjects: string;
  statsYears: string;
  statsCountries: string;
  statsAwards: string;
  statsProjectsNum: string;
  statsYearsNum: string;
  statsCountriesNum: string;
  statsAwardsNum: string;
  servicesTitle: string;
  servicesSubtitle: string;
  service1Title: string;
  service1Desc: string;
  service2Title: string;
  service2Desc: string;
  service3Title: string;
  service3Desc: string;
  service4Title: string;
  service4Desc: string;
  projectsTitle: string;
  projectsSubtitle: string;
  projectsViewMore: string;
  project1Title: string;
  project1Desc: string;
  project1Image: string;
  project2Title: string;
  project2Desc: string;
  project2Image: string;
  project3Title: string;
  project3Desc: string;
  project3Image: string;
  footerCopyright: string;
  footerLogo: string;
  headerLogo: string;
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
        inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
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

  // For textarea and input, we need to use a div in display mode since they can't have children
  if (as === "textarea" || as === "input") {
    return (
      <div
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
      </div>
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

    // Validate file type
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
      // Reset file input
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

export default function AdminHomePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocale, setCurrentLocale] = useState<Locale>(locale);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [currentLocale]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/home-content?locale=${currentLocale}`);
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
      const response = await fetch("/api/home-content", {
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
        // Refresh content after save
        fetchContent();
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert(currentLocale === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving content");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof HomeContent, value: string) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{locale === "ar" ? "جاري التحقق من المصادقة..." : "Checking authentication..."}</p>
      </div>
    );
  }

  // If not authenticated, the useAuth hook will redirect to login
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
        <p>حدث خطأ في تحميل المحتوى</p>
      </div>
    );
  }

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
        className="bg-black text-white px-4 py-2 rounded-md"
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.75rem 1.5rem",
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

      <header className={isMenuOpen ? "menu-active" : ""}>
        <EditableImage
          src={content.headerLogo}
          alt="شعار الشركة"
          onChange={(newPath) => handleChange("headerLogo", newPath)}
          width={75}
          height={75}
          currentLocale={currentLocale}
          style={{ borderRadius: "0", width: "75px", height: "75px" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="قائمة التنقل"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        {isMenuOpen && (
          <div
            className="menu-backdrop"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* <nav className={isMenuOpen ? "nav-open" : ""}>
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            الرئيسية
          </Link>
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            عن الشركة
          </Link>
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            خدماتنا
          </Link>
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            المشاريع
          </Link>
          <Link href={`/${locale}/home`} onClick={() => setIsMenuOpen(false)}>
            تواصلوا معنا
          </Link>
        </nav> */}
      </header>

      <section className="hero">
        <EditableImage
          src={content.heroLogo}
          alt="شعار"
          onChange={(newPath) => handleChange("heroLogo", newPath)}
          width={300}
          height={300}
          currentLocale={currentLocale}
          style={{ width: "200px", height: "auto", maxWidth: "300px" }}
        />
        <EditableField
          value={content.heroTitle}
          onChange={(value) => handleChange("heroTitle", value)}
          as="h1"
        />
        <EditableField
          value={content.heroSubtitle}
          onChange={(value) => handleChange("heroSubtitle", value)}
          as="textarea"
          rows={3}
        />
      </section>

      <section className="about">
        <EditableField
          value={content.aboutTitle}
          onChange={(value) => handleChange("aboutTitle", value)}
          as="h2"
        />
        <EditableField
          value={content.aboutP1}
          onChange={(value) => handleChange("aboutP1", value)}
          as="textarea"
          rows={4}
        />
        <EditableField
          value={content.aboutP2}
          onChange={(value) => handleChange("aboutP2", value)}
          as="textarea"
          rows={4}
        />
      </section>

      <section className="vision">
        <EditableField
          value={content.visionTitle}
          onChange={(value) => handleChange("visionTitle", value)}
          as="h2"
        />
        <div className="cards">
          <div className="card">
            <EditableField
              value={content.visionVision}
              onChange={(value) => handleChange("visionVision", value)}
              as="h3"
            />
            <EditableField
              value={content.visionVisionText}
              onChange={(value) => handleChange("visionVisionText", value)}
              as="textarea"
              rows={4}
            />
          </div>
          <div className="card">
            <EditableField
              value={content.visionMission}
              onChange={(value) => handleChange("visionMission", value)}
              as="h3"
            />
            <EditableField
              value={content.visionMissionText}
              onChange={(value) => handleChange("visionMissionText", value)}
              as="textarea"
              rows={4}
            />
          </div>
          <div className="card">
            <EditableField
              value={content.visionValues}
              onChange={(value) => handleChange("visionValues", value)}
              as="h3"
            />
            <EditableField
              value={content.visionValuesText}
              onChange={(value) => handleChange("visionValuesText", value)}
              as="textarea"
              rows={2}
            />
          </div>
        </div>
      </section>

      <section id="services" className="services">
        <EditableField
          value={content.servicesTitle}
          onChange={(value) => handleChange("servicesTitle", value)}
          as="h2"
        />
        <EditableField
          value={content.servicesSubtitle}
          onChange={(value) => handleChange("servicesSubtitle", value)}
          as="p"
          className="section-subtitle"
        />
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Home size={48} color="var(--gold)" />
            </div>
            <EditableField
              value={content.service1Title}
              onChange={(value) => handleChange("service1Title", value)}
              as="h3"
            />
            <EditableField
              value={content.service1Desc}
              onChange={(value) => handleChange("service1Desc", value)}
              as="textarea"
              rows={3}
            />
          </div>
          <div className="service-card">
            <div className="service-icon" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ruler size={48} color="var(--gold)" />
            </div>
            <EditableField
              value={content.service2Title}
              onChange={(value) => handleChange("service2Title", value)}
              as="h3"
            />
            <EditableField
              value={content.service2Desc}
              onChange={(value) => handleChange("service2Desc", value)}
              as="textarea"
              rows={3}
            />
          </div>
          <div className="service-card">
            <div className="service-icon" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BarChart size={48} color="var(--gold)" />
            </div>
            <EditableField
              value={content.service3Title}
              onChange={(value) => handleChange("service3Title", value)}
              as="h3"
            />
            <EditableField
              value={content.service3Desc}
              onChange={(value) => handleChange("service3Desc", value)}
              as="textarea"
              rows={3}
            />
          </div>
          <div className="service-card">
            <div className="service-icon" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lightbulb size={48} color="var(--gold)" />
            </div>
            <EditableField
              value={content.service4Title}
              onChange={(value) => handleChange("service4Title", value)}
              as="h3"
            />
            <EditableField
              value={content.service4Desc}
              onChange={(value) => handleChange("service4Desc", value)}
              as="textarea"
              rows={3}
            />
          </div>
        </div>
      </section>

      <section id="projects" className="projects">
        <EditableField
          value={content.projectsTitle}
          onChange={(value) => handleChange("projectsTitle", value)}
          as="h2"
        />
        <EditableField
          value={content.projectsSubtitle}
          onChange={(value) => handleChange("projectsSubtitle", value)}
          as="p"
          className="section-subtitle"
        />
        <div className="projects-grid">
          <div className="project-card">
            <div className="project-image">
              <EditableImage
                src={content.project1Image}
                alt={content.project1Title}
                onChange={(newPath) => handleChange("project1Image", newPath)}
                width={400}
                height={300}
                currentLocale={currentLocale}
              />
            </div>
            <div className="project-content">
              <EditableField
                value={content.project1Title}
                onChange={(value) => handleChange("project1Title", value)}
                as="h3"
              />
              <EditableField
                value={content.project1Desc}
                onChange={(value) => handleChange("project1Desc", value)}
                as="textarea"
                rows={3}
              />
            </div>
          </div>
          <div className="project-card">
            <div className="project-image">
              <EditableImage
                src={content.project2Image}
                alt={content.project2Title}
                onChange={(newPath) => handleChange("project2Image", newPath)}
                width={400}
                height={300}
                currentLocale={currentLocale}
              />
            </div>
            <div className="project-content">
              <EditableField
                value={content.project2Title}
                onChange={(value) => handleChange("project2Title", value)}
                as="h3"
              />
              <EditableField
                value={content.project2Desc}
                onChange={(value) => handleChange("project2Desc", value)}
                as="textarea"
                rows={3}
              />
            </div>
          </div>
          <div className="project-card">
            <div className="project-image">
              <EditableImage
                src={content.project3Image}
                alt={content.project3Title}
                onChange={(newPath) => handleChange("project3Image", newPath)}
                width={400}
                height={300}
                currentLocale={currentLocale}
              />
            </div>
            <div className="project-content">
              <EditableField
                value={content.project3Title}
                onChange={(value) => handleChange("project3Title", value)}
                as="h3"
              />
              <EditableField
                value={content.project3Desc}
                onChange={(value) => handleChange("project3Desc", value)}
                as="textarea"
                rows={3}
              />
            </div>
          </div>
        </div>
        <div className="view-more-container">
          <EditableField
            value={content.projectsViewMore}
            onChange={(value) => handleChange("projectsViewMore", value)}
            as="input"
            placeholder="نص زر المزيد"
          />
        </div>
      </section>

      <section id="stats" className="stats">
        <EditableField
          value={content.statsTitle}
          onChange={(value) => handleChange("statsTitle", value)}
          as="h2"
        />
        <div className="stats-grid">
          <div className="stat">
            <EditableField
              value={content.statsProjectsNum}
              onChange={(value) => handleChange("statsProjectsNum", value)}
              as="h3"
            />
            <EditableField
              value={content.statsProjects}
              onChange={(value) => handleChange("statsProjects", value)}
              as="p"
            />
          </div>
          <div className="stat">
            <EditableField
              value={content.statsYearsNum}
              onChange={(value) => handleChange("statsYearsNum", value)}
              as="h3"
            />
            <EditableField
              value={content.statsYears}
              onChange={(value) => handleChange("statsYears", value)}
              as="p"
            />
          </div>
          {/* <div className="stat">
            <EditableField
              value={content.statsCountriesNum}
              onChange={(value) => handleChange("statsCountriesNum", value)}
              as="h3"
            />
            <EditableField
              value={content.statsCountries}
              onChange={(value) => handleChange("statsCountries", value)}
              as="p"
            />
          </div>
          <div className="stat">
            <EditableField
              value={content.statsAwardsNum}
              onChange={(value) => handleChange("statsAwardsNum", value)}
              as="h3"
            />
            <EditableField
              value={content.statsAwards}
              onChange={(value) => handleChange("statsAwards", value)}
              as="p"
            />
          </div> */}
        </div>
      </section>

      <footer>
        <EditableImage
          src={content.footerLogo}
          alt="شعار"
          onChange={(newPath) => handleChange("footerLogo", newPath)}
          width={80}
          height={80}
          currentLocale={currentLocale}
          style={{ width: "80px", height: "auto", maxWidth: "120px" }}
        />
        <EditableField
          value={content.footerCopyright}
          onChange={(value) => handleChange("footerCopyright", value)}
          as="p"
        />
      </footer>
    </>
  );
}
