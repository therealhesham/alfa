"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

interface FooterContent {
  id: string;
  footerLogo: string;
  companyName: string;
  footerCopyright: string;
  addressLabel: string;
  addressValue: string;
  phoneLabelInfo: string;
  phoneValue: string;
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
        style={{
          width: "100%",
          padding: "0.5rem",
          border: "2px dashed rgba(15, 28, 42, 0.3)",
          borderRadius: "4px",
          cursor: "pointer",
          minHeight: "2.5rem",
          display: "flex",
          alignItems: "center",
        }}
        title={placeholder || "Click to edit"}
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
        border: "2px dashed transparent",
        padding: "0.25rem",
        borderRadius: "4px",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.borderColor = "rgba(15, 28, 42, 0.3)";
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.borderColor = "transparent";
      }}
      title={placeholder || "Click to edit"}
    >
      {value || placeholder}
    </Tag>
  );
}

export default function AdminFooterPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocaleState, setCurrentLocale] = useState<Locale>(locale);
  const [content, setContent] = useState<FooterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [currentLocaleState]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/footer?locale=${currentLocaleState}`);
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
      const response = await fetch("/api/footer", {
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

  const handleChange = (field: keyof FooterContent, value: string) => {
    if (!content) return;
    setContent({ ...content, [field]: value });
  };

  if (authLoading || loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "1.2rem",
      }}>
        {locale === "ar" ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "1.2rem",
      }}>
        {locale === "ar" ? "غير مصرح لك بالوصول" : "Unauthorized"}
      </div>
    );
  }

  if (!content) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "1.2rem",
      }}>
        {locale === "ar" ? "حدث خطأ في تحميل المحتوى" : "Error loading content"}
      </div>
    );
  }

  return (
    <>
      <AdminNav locale={locale} />
      <LogoutButton locale={locale} />
      
      <div style={{
        position: "fixed",
        top: "80px",
        right: "2rem",
        left: "2rem",
        zIndex: 100,
        display: "flex",
        gap: "1rem",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(15, 28, 42, 0.1)",
      }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => setCurrentLocale("ar")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border: "1px solid rgba(15, 28, 42, 0.2)",
              color: currentLocaleState === "ar" ? "#ffffff" : "#0F1C2A",
              backgroundColor: currentLocaleState === "ar" ? "#0F1C2A" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          >
            العربية
          </button>
          <button
            onClick={() => setCurrentLocale("en")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              border: "1px solid rgba(15, 28, 42, 0.2)",
              color: currentLocaleState === "en" ? "#ffffff" : "#0F1C2A",
              backgroundColor: currentLocaleState === "en" ? "#0F1C2A" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          >
            English
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#0F1C2A",
            color: "#FAF7F2",
            border: "none",
            borderRadius: "999px",
            fontWeight: 600,
            fontSize: "0.95rem",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
            transition: "all 0.2s ease-in-out",
            boxShadow: "0 4px 15px rgba(15, 28, 42, 0.2)",
          }}
        >
          {saving 
            ? (currentLocaleState === "ar" ? "جاري الحفظ..." : "Saving...")
            : (currentLocaleState === "ar" ? "حفظ" : "Save")
          }
        </button>
        {saved && (
          <span style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "999px",
            fontSize: "0.95rem",
            fontWeight: 600,
          }}>
            {currentLocaleState === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!"}
          </span>
        )}
      </div>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "120px 2rem 2rem",
        direction: currentLocaleState === "ar" ? "rtl" : "ltr",
      }}>
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          marginBottom: "2rem",
          color: "#0F1C2A",
        }}>
          {currentLocaleState === "ar" ? "تحرير الـ Footer" : "Edit Footer"}
        </h1>

        {/* Logo Section */}
        <section style={{
          marginBottom: "3rem",
          padding: "2rem",
          backgroundColor: "#FAF7F2",
          borderRadius: "12px",
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            color: "#0F1C2A",
          }}>
            {currentLocaleState === "ar" ? "الشعار" : "Logo"}
          </h2>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "رابط الشعار" : "Logo URL"}
            </label>
            <EditableField
              value={content.footerLogo}
              onChange={(value) => handleChange("footerLogo", value)}
              as="input"
              placeholder={currentLocaleState === "ar" ? "أدخل رابط الشعار" : "Enter logo URL"}
            />
          </div>
        </section>

        {/* Company Name Section */}
        <section style={{
          marginBottom: "3rem",
          padding: "2rem",
          backgroundColor: "#FAF7F2",
          borderRadius: "12px",
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            color: "#0F1C2A",
          }}>
            {currentLocaleState === "ar" ? "اسم الشركة" : "Company Name"}
          </h2>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "اسم الشركة" : "Company Name"}
            </label>
            <EditableField
              value={content.companyName}
              onChange={(value) => handleChange("companyName", value)}
              as="textarea"
              rows={3}
              placeholder={currentLocaleState === "ar" ? "أدخل اسم الشركة" : "Enter company name"}
            />
          </div>
        </section>

        {/* Address Section */}
        <section style={{
          marginBottom: "3rem",
          padding: "2rem",
          backgroundColor: "#FAF7F2",
          borderRadius: "12px",
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            color: "#0F1C2A",
          }}>
            {currentLocaleState === "ar" ? "العنوان" : "Address"}
          </h2>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "تسمية العنوان" : "Address Label"}
            </label>
            <EditableField
              value={content.addressLabel}
              onChange={(value) => handleChange("addressLabel", value)}
              as="input"
              placeholder={currentLocaleState === "ar" ? "مثال: العنوان" : "e.g., Address"}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "قيمة العنوان" : "Address Value"}
            </label>
            <EditableField
              value={content.addressValue}
              onChange={(value) => handleChange("addressValue", value)}
              as="textarea"
              rows={3}
              placeholder={currentLocaleState === "ar" ? "أدخل العنوان الكامل" : "Enter full address"}
            />
          </div>
        </section>

        {/* Phone Section */}
        <section style={{
          marginBottom: "3rem",
          padding: "2rem",
          backgroundColor: "#FAF7F2",
          borderRadius: "12px",
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            color: "#0F1C2A",
          }}>
            {currentLocaleState === "ar" ? "الهاتف" : "Phone"}
          </h2>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "تسمية الهاتف" : "Phone Label"}
            </label>
            <EditableField
              value={content.phoneLabelInfo}
              onChange={(value) => handleChange("phoneLabelInfo", value)}
              as="input"
              placeholder={currentLocaleState === "ar" ? "مثال: الهاتف" : "e.g., Phone"}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "رقم الهاتف" : "Phone Number"}
            </label>
            <EditableField
              value={content.phoneValue}
              onChange={(value) => handleChange("phoneValue", value)}
              as="input"
              placeholder={currentLocaleState === "ar" ? "مثال: +966 12 345 6789" : "e.g., +966 12 345 6789"}
            />
          </div>
        </section>

        {/* Copyright Section */}
        <section style={{
          marginBottom: "3rem",
          padding: "2rem",
          backgroundColor: "#FAF7F2",
          borderRadius: "12px",
        }}>
          <h2 style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "1.5rem",
            color: "#0F1C2A",
          }}>
            {currentLocaleState === "ar" ? "حقوق النشر" : "Copyright"}
          </h2>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "نص حقوق النشر" : "Copyright Text"}
            </label>
            <EditableField
              value={content.footerCopyright}
              onChange={(value) => handleChange("footerCopyright", value)}
              as="input"
              placeholder={currentLocaleState === "ar" ? "مثال: © 2025 اسم الشركة – جميع الحقوق محفوظة" : "e.g., © 2025 Company Name – All Rights Reserved"}
            />
          </div>
        </section>
      </div>
    </>
  );
}

