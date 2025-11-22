"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

interface ContactUsContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  subjectLabel: string;
  messageLabel: string;
  sendButton: string;
  sendingButton: string;
  infoTitle: string;
  infoDescription: string;
  addressLabel: string;
  addressValue: string;
  phoneLabelInfo: string;
  phoneValue: string;
  emailLabelInfo: string;
  emailValue: string;
  hoursLabel: string;
  hoursValue: string;
  successMessage: string;
  errorMessage: string;
  requiredField: string;
  invalidEmail: string;
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

export default function AdminContactUsPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocaleState, setCurrentLocale] = useState<Locale>(locale);
  const currentLocale = currentLocaleState;
  const [content, setContent] = useState<ContactUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [currentLocaleState]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contact-us?locale=${currentLocaleState}`);
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
      const response = await fetch("/api/contact-us", {
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

  const handleChange = (field: keyof ContactUsContent, value: string) => {
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
      <AdminNav locale={locale} />
      {/* Save Button, Language Switcher, and Logout */}
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
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          padding: "0.5rem",
          borderRadius: "999px",
          boxShadow: "0 10px 25px rgba(15, 28, 42, 0.15)",
          border: "1px solid rgba(15, 28, 42, 0.08)",
        }}>
          <button
            onClick={() => setCurrentLocale("ar")}
            style={{
              padding: "0.35rem 1rem",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: "0.95rem",
              border: "1px solid rgba(15, 28, 42, 0.2)",
              color: currentLocaleState === "ar" ? "#ffffff" : "#0F1C2A",
              backgroundColor: currentLocaleState === "ar" ? "#0F1C2A" : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          >
            عربي
          </button>
          <button
            onClick={() => setCurrentLocale("en")}
            style={{
              padding: "0.35rem 1rem",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: "0.95rem",
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
          {currentLocaleState === "ar" ? "تحرير صفحة تواصلوا معنا" : "Edit Contact Us Page"}
        </h1>

        {/* Hero Section */}
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
            {currentLocaleState === "ar" ? "قسم العنوان الرئيسي" : "Hero Section"}
          </h2>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "العنوان" : "Title"}
            </label>
            <EditableField
              value={content.heroTitle}
              onChange={(value) => handleChange("heroTitle", value)}
              as="input"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "الوصف" : "Subtitle"}
            </label>
            <EditableField
              value={content.heroSubtitle}
              onChange={(value) => handleChange("heroSubtitle", value)}
              as="textarea"
              rows={2}
            />
          </div>
        </section>

        {/* Form Section */}
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
            {currentLocaleState === "ar" ? "نموذج التواصل" : "Contact Form"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "عنوان النموذج" : "Form Title"}
              </label>
              <EditableField
                value={content.formTitle}
                onChange={(value) => handleChange("formTitle", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "تسمية الاسم" : "Name Label"}
              </label>
              <EditableField
                value={content.nameLabel}
                onChange={(value) => handleChange("nameLabel", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "تسمية البريد الإلكتروني" : "Email Label"}
              </label>
              <EditableField
                value={content.emailLabel}
                onChange={(value) => handleChange("emailLabel", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "تسمية الهاتف" : "Phone Label"}
              </label>
              <EditableField
                value={content.phoneLabel}
                onChange={(value) => handleChange("phoneLabel", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "تسمية الموضوع" : "Subject Label"}
              </label>
              <EditableField
                value={content.subjectLabel}
                onChange={(value) => handleChange("subjectLabel", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "تسمية الرسالة" : "Message Label"}
              </label>
              <EditableField
                value={content.messageLabel}
                onChange={(value) => handleChange("messageLabel", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "زر الإرسال" : "Send Button"}
              </label>
              <EditableField
                value={content.sendButton}
                onChange={(value) => handleChange("sendButton", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "زر الإرسال (جاري)" : "Sending Button"}
              </label>
              <EditableField
                value={content.sendingButton}
                onChange={(value) => handleChange("sendingButton", value)}
                as="input"
              />
            </div>
          </div>
        </section>

        {/* Info Section */}
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
            {currentLocaleState === "ar" ? "معلومات التواصل" : "Contact Information"}
          </h2>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "عنوان القسم" : "Section Title"}
            </label>
            <EditableField
              value={content.infoTitle}
              onChange={(value) => handleChange("infoTitle", value)}
              as="input"
            />
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              {currentLocaleState === "ar" ? "وصف القسم" : "Section Description"}
            </label>
            <EditableField
              value={content.infoDescription}
              onChange={(value) => handleChange("infoDescription", value)}
              as="textarea"
              rows={3}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "تسمية العنوان" : "Address Label"}
              </label>
              <EditableField
                value={content.addressLabel}
                onChange={(value) => handleChange("addressLabel", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "قيمة العنوان" : "Address Value"}
              </label>
              <EditableField
                value={content.addressValue}
                onChange={(value) => handleChange("addressValue", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "تسمية الهاتف" : "Phone Label"}
              </label>
              <EditableField
                value={content.phoneLabelInfo}
                onChange={(value) => handleChange("phoneLabelInfo", value)}
                as="input"
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
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "تسمية البريد الإلكتروني" : "Email Label"}
              </label>
              <EditableField
                value={content.emailLabelInfo}
                onChange={(value) => handleChange("emailLabelInfo", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "البريد الإلكتروني" : "Email Address"}
              </label>
              <EditableField
                value={content.emailValue}
                onChange={(value) => handleChange("emailValue", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "تسمية ساعات العمل" : "Hours Label"}
              </label>
              <EditableField
                value={content.hoursLabel}
                onChange={(value) => handleChange("hoursLabel", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "ساعات العمل" : "Working Hours"}
              </label>
              <EditableField
                value={content.hoursValue}
                onChange={(value) => handleChange("hoursValue", value)}
                as="input"
              />
            </div>
          </div>
        </section>

        {/* Messages Section */}
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
            {currentLocaleState === "ar" ? "الرسائل" : "Messages"}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "رسالة النجاح" : "Success Message"}
              </label>
              <EditableField
                value={content.successMessage}
                onChange={(value) => handleChange("successMessage", value)}
                as="textarea"
                rows={2}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "رسالة الخطأ" : "Error Message"}
              </label>
              <EditableField
                value={content.errorMessage}
                onChange={(value) => handleChange("errorMessage", value)}
                as="textarea"
                rows={2}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "الحقل مطلوب" : "Required Field"}
              </label>
              <EditableField
                value={content.requiredField}
                onChange={(value) => handleChange("requiredField", value)}
                as="input"
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                {currentLocaleState === "ar" ? "بريد إلكتروني غير صحيح" : "Invalid Email"}
              </label>
              <EditableField
                value={content.invalidEmail}
                onChange={(value) => handleChange("invalidEmail", value)}
                as="input"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

