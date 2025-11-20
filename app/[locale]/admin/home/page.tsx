"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
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
        <Image
          src={content.headerLogo}
          alt="شعار الشركة"
          width={75}
          height={75}
          className="logo"
          unoptimized
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
        <Image
          src={content.heroLogo}
          alt="شعار"
          width={300}
          height={300}
          className="hero-logo"
          unoptimized
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
        <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#666" }}>
          <EditableField
            value={content.heroLogo}
            onChange={(value) => handleChange("heroLogo", value)}
            as="input"
            placeholder="مسار الشعار"
          />
        </div>
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

      <section className="stats">
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
          <div className="stat">
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
          </div>
        </div>
      </section>

      <footer>
        <Image
          src={content.footerLogo}
          alt="شعار"
          width={80}
          height={80}
          unoptimized
        />
        <EditableField
          value={content.footerCopyright}
          onChange={(value) => handleChange("footerCopyright", value)}
          as="p"
        />
        <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
          <EditableField
            value={content.footerLogo}
            onChange={(value) => handleChange("footerLogo", value)}
            as="input"
            placeholder="مسار شعار التذييل"
          />
        </div>
        <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
          <EditableField
            value={content.headerLogo}
            onChange={(value) => handleChange("headerLogo", value)}
            as="input"
            placeholder="مسار شعار الهيدر"
          />
        </div>
      </footer>
    </>
  );
}
