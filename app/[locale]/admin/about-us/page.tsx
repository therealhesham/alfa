"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import type { Locale } from "@/i18n";

interface AboutUsContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  storyTitle: string;
  storyContent: string;
  storyImage: string;
  missionTitle: string;
  missionContent: string;
  visionTitle: string;
  visionContent: string;
  whyChooseTitle: string;
  whyChoosePoint1: string;
  whyChoosePoint2: string;
  whyChoosePoint3: string;
  whyChoosePoint4: string;
  valuesTitle: string;
  valuesContent: string;
  milestone1Year: string;
  milestone1Title: string;
  milestone1Desc: string;
  milestone2Year: string;
  milestone2Title: string;
  milestone2Desc: string;
  milestone3Year: string;
  milestone3Title: string;
  milestone3Desc: string;
  milestone4Year: string;
  milestone4Title: string;
  milestone4Desc: string;
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
        title={currentLocale === "ar" ? "انقر للتعديل" : "Click to edit"}
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
      title={currentLocale === "ar" ? "انقر للتعديل" : "Click to edit"}
    >
      {value || placeholder}
    </Tag>
  );
}

let currentLocale: Locale = "ar";

export default function AdminAboutUsPage() {
  const params = useParams();
  const [currentLocaleState, setCurrentLocale] = useState<Locale>("ar");
  currentLocale = currentLocaleState;
  const [content, setContent] = useState<AboutUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [currentLocaleState]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/about-us?locale=${currentLocaleState}`);
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
      const response = await fetch("/api/about-us", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...content,
          locale: currentLocaleState,
        }),
      });
      
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchContent();
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving content");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof AboutUsContent, value: string) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{currentLocaleState === "ar" ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{currentLocaleState === "ar" ? "حدث خطأ في تحميل المحتوى" : "Error loading content"}</p>
      </div>
    );
  }

  return (
    <>
      {/* Save Button and Language Switcher */}
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
              backgroundColor: currentLocaleState === "ar" ? "#0070f3" : "#f0f0f0",
              color: currentLocaleState === "ar" ? "white" : "#333",
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
              backgroundColor: currentLocaleState === "en" ? "#0070f3" : "#f0f0f0",
              color: currentLocaleState === "en" ? "white" : "#333",
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
        >
          {saving 
            ? (currentLocaleState === "ar" ? "جاري الحفظ..." : "Saving...")
            : saved 
            ? (currentLocaleState === "ar" ? " تم الحفظ" : " Saved")
            : (currentLocaleState === "ar" ? " حفظ التغييرات" : " Save Changes")
          }
        </button>
        {saved && (
          <span style={{ color: "#22c55e", fontWeight: "600" }}>
            {currentLocaleState === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!"}
          </span>
        )}
      </div>

      {/* Hero Section */}
      <section className="hero" style={{ 
        backgroundImage: `url(${content.heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        padding: '2rem',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <EditableField
            value={content.heroTitle}
            onChange={(value) => handleChange("heroTitle", value)}
            as="h1"
            className="text-white"
          />
          <EditableField
            value={content.heroSubtitle}
            onChange={(value) => handleChange("heroSubtitle", value)}
            as="textarea"
            rows={2}
            className="text-white"
          />
          <div style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#ccc" }}>
            <EditableField
              value={content.heroImage}
              onChange={(value) => handleChange("heroImage", value)}
              as="input"
              placeholder="مسار الصورة"
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <EditableField
          value={content.storyTitle}
          onChange={(value) => handleChange("storyTitle", value)}
          as="h2"
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <Image
              src={content.storyImage}
              alt={content.storyTitle}
              width={600}
              height={400}
              style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              unoptimized
            />
            <div style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#666" }}>
              <EditableField
                value={content.storyImage}
                onChange={(value) => handleChange("storyImage", value)}
                as="input"
                placeholder="مسار الصورة"
              />
            </div>
          </div>
          <div>
            <EditableField
              value={content.storyContent}
              onChange={(value) => handleChange("storyContent", value)}
              as="textarea"
              rows={8}
            />
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="vision" style={{ padding: '4rem 2rem', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div className="card" style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <EditableField
              value={content.missionTitle}
              onChange={(value) => handleChange("missionTitle", value)}
              as="h3"
            />
            <EditableField
              value={content.missionContent}
              onChange={(value) => handleChange("missionContent", value)}
              as="textarea"
              rows={4}
            />
          </div>
          <div className="card" style={{ 
            padding: '2rem', 
            backgroundColor: 'white', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <EditableField
              value={content.visionTitle}
              onChange={(value) => handleChange("visionTitle", value)}
              as="h3"
            />
            <EditableField
              value={content.visionContent}
              onChange={(value) => handleChange("visionContent", value)}
              as="textarea"
              rows={4}
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <EditableField
          value={content.whyChooseTitle}
          onChange={(value) => handleChange("whyChooseTitle", value)}
          as="h2"
        />
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '2rem' 
        }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            borderLeft: '4px solid #0070f3'
          }}>
            <EditableField
              value={content.whyChoosePoint1}
              onChange={(value) => handleChange("whyChoosePoint1", value)}
              as="textarea"
              rows={2}
            />
          </div>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            borderLeft: '4px solid #0070f3'
          }}>
            <EditableField
              value={content.whyChoosePoint2}
              onChange={(value) => handleChange("whyChoosePoint2", value)}
              as="textarea"
              rows={2}
            />
          </div>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            borderLeft: '4px solid #0070f3'
          }}>
            <EditableField
              value={content.whyChoosePoint3}
              onChange={(value) => handleChange("whyChoosePoint3", value)}
              as="textarea"
              rows={2}
            />
          </div>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '8px',
            borderLeft: '4px solid #0070f3'
          }}>
            <EditableField
              value={content.whyChoosePoint4}
              onChange={(value) => handleChange("whyChoosePoint4", value)}
              as="textarea"
              rows={2}
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <EditableField
            value={content.valuesTitle}
            onChange={(value) => handleChange("valuesTitle", value)}
            as="h2"
          />
          <EditableField
            value={content.valuesContent}
            onChange={(value) => handleChange("valuesContent", value)}
            as="textarea"
            rows={2}
          />
        </div>
      </section>

      {/* Timeline/Milestones Section */}
      <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          {currentLocaleState === 'ar' ? 'محطاتنا المهمة' : 'Our Milestones'}
        </h2>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2rem',
          position: 'relative',
          paddingLeft: currentLocaleState === 'ar' ? '0' : '2rem',
          paddingRight: currentLocaleState === 'ar' ? '2rem' : '0'
        }}>
          <div style={{
            position: 'absolute',
            [currentLocaleState === 'ar' ? 'right' : 'left']: '0',
            top: '0',
            bottom: '0',
            width: '3px',
            backgroundColor: '#0070f3',
          }}></div>
          
          {/* Milestone 1 */}
          <div style={{ 
            position: 'relative',
            paddingLeft: currentLocaleState === 'ar' ? '0' : '3rem',
            paddingRight: currentLocaleState === 'ar' ? '3rem' : '0',
          }}>
            <div style={{
              position: 'absolute',
              [currentLocaleState === 'ar' ? 'right' : 'left']: '-8px',
              top: '0',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#0070f3',
              border: '3px solid white',
              boxShadow: '0 0 0 3px #0070f3',
            }}></div>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <EditableField
                value={content.milestone1Year}
                onChange={(value) => handleChange("milestone1Year", value)}
                as="input"
              />
              <EditableField
                value={content.milestone1Title}
                onChange={(value) => handleChange("milestone1Title", value)}
                as="h3"
              />
              <EditableField
                value={content.milestone1Desc}
                onChange={(value) => handleChange("milestone1Desc", value)}
                as="textarea"
                rows={2}
              />
            </div>
          </div>

          {/* Milestone 2 */}
          <div style={{ 
            position: 'relative',
            paddingLeft: currentLocaleState === 'ar' ? '0' : '3rem',
            paddingRight: currentLocaleState === 'ar' ? '3rem' : '0',
          }}>
            <div style={{
              position: 'absolute',
              [currentLocaleState === 'ar' ? 'right' : 'left']: '-8px',
              top: '0',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#0070f3',
              border: '3px solid white',
              boxShadow: '0 0 0 3px #0070f3',
            }}></div>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <EditableField
                value={content.milestone2Year}
                onChange={(value) => handleChange("milestone2Year", value)}
                as="input"
              />
              <EditableField
                value={content.milestone2Title}
                onChange={(value) => handleChange("milestone2Title", value)}
                as="h3"
              />
              <EditableField
                value={content.milestone2Desc}
                onChange={(value) => handleChange("milestone2Desc", value)}
                as="textarea"
                rows={2}
              />
            </div>
          </div>

          {/* Milestone 3 */}
          <div style={{ 
            position: 'relative',
            paddingLeft: currentLocaleState === 'ar' ? '0' : '3rem',
            paddingRight: currentLocaleState === 'ar' ? '3rem' : '0',
          }}>
            <div style={{
              position: 'absolute',
              [currentLocaleState === 'ar' ? 'right' : 'left']: '-8px',
              top: '0',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#0070f3',
              border: '3px solid white',
              boxShadow: '0 0 0 3px #0070f3',
            }}></div>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <EditableField
                value={content.milestone3Year}
                onChange={(value) => handleChange("milestone3Year", value)}
                as="input"
              />
              <EditableField
                value={content.milestone3Title}
                onChange={(value) => handleChange("milestone3Title", value)}
                as="h3"
              />
              <EditableField
                value={content.milestone3Desc}
                onChange={(value) => handleChange("milestone3Desc", value)}
                as="textarea"
                rows={2}
              />
            </div>
          </div>

          {/* Milestone 4 */}
          <div style={{ 
            position: 'relative',
            paddingLeft: currentLocaleState === 'ar' ? '0' : '3rem',
            paddingRight: currentLocaleState === 'ar' ? '3rem' : '0',
          }}>
            <div style={{
              position: 'absolute',
              [currentLocaleState === 'ar' ? 'right' : 'left']: '-8px',
              top: '0',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#0070f3',
              border: '3px solid white',
              boxShadow: '0 0 0 3px #0070f3',
            }}></div>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <EditableField
                value={content.milestone4Year}
                onChange={(value) => handleChange("milestone4Year", value)}
                as="input"
              />
              <EditableField
                value={content.milestone4Title}
                onChange={(value) => handleChange("milestone4Title", value)}
                as="h3"
              />
              <EditableField
                value={content.milestone4Desc}
                onChange={(value) => handleChange("milestone4Desc", value)}
                as="textarea"
                rows={2}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

