"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (newPath: string) => void;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  currentLocale: Locale;
}

function EditableImage({ src, alt, onChange, width = 140, height = 140, style, currentLocale }: EditableImageProps) {
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
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px dashed rgba(15, 28, 42, 0.2)',
    padding: '1rem',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    ...style
  };

  const imageStyle: React.CSSProperties = {
    width: width,
    height: height,
    maxWidth: '100%',
    borderRadius: '8px',
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
      {src ? (
        <Image
          src={src || '/capture.png'}
          alt={alt}
          width={width}
          height={height}
          style={imageStyle}
          unoptimized
        />
      ) : (
        <div style={{
          width: width,
          height: height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(15, 28, 42, 0.5)',
          gap: '0.5rem',
        }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {currentLocale === "ar" ? "انقر لرفع صورة" : "Click to upload image"}
          </span>
        </div>
      )}
      {isHovered && src && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            transition: 'all 0.2s',
            borderRadius: '8px',
          }}
        >
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
        </div>
      )}
      {isUploading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            pointerEvents: 'none',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>
            {currentLocale === "ar" ? "جاري الرفع..." : "Uploading..."}
          </span>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
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
      <div
        style={{
          position: "fixed",
          top: "5rem",
          right: "1rem",
          zIndex: 9999,
        }}
      >
        <LogoutButton />
      </div>

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
            <label style={{ display: "block", marginBottom: "1rem", fontWeight: 600, fontSize: "1rem" }}>
              {currentLocaleState === "ar" ? "رفع الشعار" : "Upload Logo"}
            </label>
            <EditableImage
              src={content.footerLogo}
              alt={currentLocaleState === "ar" ? "شعار" : "Logo"}
              onChange={(newPath) => handleChange("footerLogo", newPath)}
              width={140}
              height={140}
              currentLocale={currentLocaleState}
              style={{ width: "140px", height: "140px" }}
            />
            <p style={{
              marginTop: "0.75rem",
              fontSize: "0.875rem",
              color: "rgba(15, 28, 42, 0.6)",
              fontStyle: "italic",
            }}>
              {currentLocaleState === "ar" 
                ? "انقر على الصورة لرفع شعار جديد" 
                : "Click on the image to upload a new logo"}
            </p>
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

