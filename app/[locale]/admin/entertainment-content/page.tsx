"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Save } from "lucide-react";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

let currentLocale: Locale = "ar";

function EditableImage({ src, alt, onChange, width = 400, height = 250 }: {
  src: string; alt: string; onChange: (p: string) => void; width?: number; height?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{ position: "relative", cursor: "pointer", width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => fileInputRef.current?.click()}
    >
      {isUploading ? (
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#f0f0f0", border: "2px dashed #ccc", borderRadius: "8px",
        }}>
          {currentLocale === "ar" ? "جاري الرفع..." : "Uploading..."}
        </div>
      ) : src ? (
        <Image src={src} alt={alt} width={width} height={height} style={{
          objectFit: "cover", borderRadius: "8px", width: "100%", height: "100%",
          border: isHovered ? "3px solid #0070f3" : "3px solid transparent",
          transition: "all 0.3s", opacity: isHovered ? 0.8 : 1,
        }} unoptimized />
      ) : (
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#f9f9f9", border: "2px dashed #ccc", borderRadius: "8px", color: "#999",
        }}>
          {currentLocale === "ar" ? "انقر لاختيار صورة الهيرو" : "Click to choose hero image"}
        </div>
      )}
      {!isUploading && src && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: isHovered ? "rgba(0, 112, 243, 0.95)" : "rgba(0, 0, 0, 0.65)",
          color: "white", padding: "0.5rem 0.75rem", borderRadius: "0 0 8px 8px",
          fontSize: "0.85rem", pointerEvents: "none", textAlign: "center",
        }}>
          {currentLocale === "ar" ? "انقر لتغيير الصورة" : "Click to change image"}
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !file.type.startsWith("image/")) return;
          setIsUploading(true);
          const fd = new FormData(); fd.append("file", file);
          try {
            const res = await fetch("/api/upload-image", { method: "POST", body: fd });
            const data = await res.json();
            if (data.success) onChange(data.path || data.url);
          } catch { /* noop */ } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }
        }}
      />
    </div>
  );
}

export default function AdminEntertainmentContentPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocaleState, setCurrentLocale] = useState<Locale>(locale);
  currentLocale = currentLocaleState;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [content, setContent] = useState({
    heroTitle: "", heroTitleEn: "",
    heroSubtitle: "", heroSubtitleEn: "",
    heroImages: [] as string[],
    showStats: true,
    stat1Icon: "Sparkles", stat1Number: "4+", stat1Label: "", stat1LabelEn: "",
    stat2Icon: "Star", stat2Number: "3", stat2Label: "", stat2LabelEn: "",
    stat3Icon: "Clapperboard", stat3Number: "100K+", stat3Label: "", stat3LabelEn: "",
    sectionTitle: "", sectionTitleEn: "",
    sectionSubtitle: "", sectionSubtitleEn: "",
    emptyMessage: "", emptyMessageEn: "",
  });

  useEffect(() => { fetchContent(); }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/entertainment-content");
      if (res.ok) {
        const data = await res.json();
        setContent({
          heroTitle: data.heroTitle || "", heroTitleEn: data.heroTitleEn || "",
          heroSubtitle: data.heroSubtitle || "", heroSubtitleEn: data.heroSubtitleEn || "",
          heroImages: Array.isArray(data.heroImages) ? data.heroImages : [],
          showStats: data.showStats ?? true,
          stat1Icon: data.stat1Icon || "Sparkles", stat1Number: data.stat1Number || "4+",
          stat1Label: data.stat1Label || "", stat1LabelEn: data.stat1LabelEn || "",
          stat2Icon: data.stat2Icon || "Star", stat2Number: data.stat2Number || "3",
          stat2Label: data.stat2Label || "", stat2LabelEn: data.stat2LabelEn || "",
          stat3Icon: data.stat3Icon || "Clapperboard", stat3Number: data.stat3Number || "100K+",
          stat3Label: data.stat3Label || "", stat3LabelEn: data.stat3LabelEn || "",
          sectionTitle: data.sectionTitle || "", sectionTitleEn: data.sectionTitleEn || "",
          sectionSubtitle: data.sectionSubtitle || "", sectionSubtitleEn: data.sectionSubtitleEn || "",
          emptyMessage: data.emptyMessage || "", emptyMessageEn: data.emptyMessageEn || "",
        });
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/entertainment-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "1.2rem" }}>
        {currentLocaleState === "ar" ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "1.2rem" }}>
        {currentLocaleState === "ar" ? "غير مصرح" : "Unauthorized"}
      </div>
    );
  }

  const inputStyle = { width: "100%", padding: "0.75rem", border: "2px solid #ddd", borderRadius: "4px", fontSize: "1rem" };
  const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.5rem", fontWeight: "bold" };
  const isAr = currentLocaleState === "ar";
  const iconOptions = ["Sparkles", "Star", "Clapperboard", "Globe", "Building2", "Award", "Layers"];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <AdminNav locale={currentLocaleState} />
      <div style={{ position: "fixed", top: "5rem", right: "1rem", zIndex: 9999 }}>
        <LogoutButton />
      </div>

      <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {isAr ? "محتوى صفحة الترفيه" : "Entertainment Page Content"}
          </h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => setCurrentLocale("ar")} style={{
              padding: "0.5rem 1rem", background: currentLocaleState === "ar" ? "#0070f3" : "#e0e0e0",
              color: currentLocaleState === "ar" ? "white" : "black", border: "none", borderRadius: "4px", cursor: "pointer",
            }}>العربية</button>
            <button onClick={() => setCurrentLocale("en")} style={{
              padding: "0.5rem 1rem", background: currentLocaleState === "en" ? "#0070f3" : "#e0e0e0",
              color: currentLocaleState === "en" ? "white" : "black", border: "none", borderRadius: "4px", cursor: "pointer",
            }}>English</button>
          </div>
        </div>

        {saved && (
          <div style={{ padding: "1rem", background: "#4caf50", color: "white", borderRadius: "4px", marginBottom: "1rem", textAlign: "center" }}>
            {isAr ? "تم الحفظ بنجاح!" : "Saved successfully!"}
          </div>
        )}

        <div style={{ background: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          {/* Hero Section */}
          <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem", borderBottom: "2px solid #eee", paddingBottom: "0.5rem" }}>
            {isAr ? "قسم الهيرو" : "Hero Section"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={labelStyle}>{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</label>
              <input type="text" value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
              <input type="text" value={content.heroTitleEn} onChange={(e) => setContent({ ...content, heroTitleEn: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={labelStyle}>{isAr ? "الوصف (عربي)" : "Subtitle (Arabic)"}</label>
              <textarea value={content.heroSubtitle} onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })} rows={3} style={{ ...inputStyle, fontFamily: "inherit" }} />
            </div>
            <div>
              <label style={labelStyle}>{isAr ? "الوصف (إنجليزي)" : "Subtitle (English)"}</label>
              <textarea value={content.heroSubtitleEn} onChange={(e) => setContent({ ...content, heroSubtitleEn: e.target.value })} rows={3} style={{ ...inputStyle, fontFamily: "inherit" }} />
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>{isAr ? "صور خلفية الهيرو (اختياري - يمكن إضافة أكثر من صورة)" : "Hero Background Images (optional - multiple images supported)"}</label>
            <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.75rem" }}>
              {isAr ? "أضف صورة أو أكثر لعرضها كسلايدر متحرك. اترك فارغاً لاستخدام الخلفية الافتراضية" : "Add one or more images for an animated slider. Leave empty to use default background"}
            </p>

            {content.heroImages.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                {content.heroImages.map((img, idx) => (
                  <div key={idx} style={{ position: "relative", width: 200, height: 130, borderRadius: "8px", overflow: "hidden", border: "2px solid #ddd" }}>
                    <Image src={img} alt={`Hero ${idx + 1}`} width={200} height={130} style={{ objectFit: "cover", width: "100%", height: "100%" }} unoptimized />
                    <div style={{
                      position: "absolute", top: "0.3rem", right: "0.3rem", display: "flex", gap: "0.25rem",
                    }}>
                      {idx > 0 && (
                        <button onClick={() => {
                          const imgs = [...content.heroImages];
                          [imgs[idx - 1], imgs[idx]] = [imgs[idx], imgs[idx - 1]];
                          setContent({ ...content, heroImages: imgs });
                        }} style={{
                          width: "24px", height: "24px", background: "rgba(0,0,0,0.7)", color: "white",
                          border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center",
                        }} title={isAr ? "تحريك لليسار" : "Move left"}>◀</button>
                      )}
                      {idx < content.heroImages.length - 1 && (
                        <button onClick={() => {
                          const imgs = [...content.heroImages];
                          [imgs[idx], imgs[idx + 1]] = [imgs[idx + 1], imgs[idx]];
                          setContent({ ...content, heroImages: imgs });
                        }} style={{
                          width: "24px", height: "24px", background: "rgba(0,0,0,0.7)", color: "white",
                          border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center",
                        }} title={isAr ? "تحريك لليمين" : "Move right"}>▶</button>
                      )}
                      <button onClick={() => {
                        setContent({ ...content, heroImages: content.heroImages.filter((_, i) => i !== idx) });
                      }} style={{
                        width: "24px", height: "24px", background: "rgba(244,67,54,0.9)", color: "white",
                        border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center",
                      }} title={isAr ? "حذف" : "Delete"}>✕</button>
                    </div>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)",
                      color: "white", fontSize: "0.75rem", textAlign: "center", padding: "0.2rem",
                    }}>
                      {idx + 1} / {content.heroImages.length}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <EditableImage
              src=""
              alt="Add hero image"
              onChange={(newPath) => setContent({ ...content, heroImages: [...content.heroImages, newPath] })}
              width={200}
              height={130}
            />
            <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.25rem" }}>
              {isAr ? "انقر لإضافة صورة جديدة" : "Click to add a new image"}
            </p>

            {content.heroImages.length > 0 && (
              <button onClick={() => setContent({ ...content, heroImages: [] })} style={{
                marginTop: "0.75rem", padding: "0.4rem 1rem", background: "#f44336", color: "white",
                border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem",
              }}>
                {isAr ? "إزالة جميع الصور" : "Remove All Images"}
              </button>
            )}
          </div>

          {/* Stats */}
          <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem", marginTop: "2rem", borderBottom: "2px solid #eee", paddingBottom: "0.5rem" }}>
            {isAr ? "الإحصائيات" : "Statistics"}
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <input type="checkbox" checked={content.showStats} onChange={(e) => setContent({ ...content, showStats: e.target.checked })} />
            <label style={{ fontWeight: "bold" }}>{isAr ? "إظهار الإحصائيات" : "Show Statistics"}</label>
          </div>

          {content.showStats && (
            <>
              {[1, 2, 3].map((n) => {
                const iconKey = `stat${n}Icon` as keyof typeof content;
                const numKey = `stat${n}Number` as keyof typeof content;
                const labelKey = `stat${n}Label` as keyof typeof content;
                const labelEnKey = `stat${n}LabelEn` as keyof typeof content;
                return (
                  <div key={n} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem", padding: "1rem", background: "#f9f9f9", borderRadius: "8px" }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: "0.85rem" }}>{isAr ? `أيقونة ${n}` : `Icon ${n}`}</label>
                      <select value={content[iconKey] as string} onChange={(e) => setContent({ ...content, [iconKey]: e.target.value })} style={inputStyle}>
                        {iconOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: "0.85rem" }}>{isAr ? "الرقم" : "Number"}</label>
                      <input type="text" value={content[numKey] as string} onChange={(e) => setContent({ ...content, [numKey]: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: "0.85rem" }}>{isAr ? "التسمية (عربي)" : "Label (Arabic)"}</label>
                      <input type="text" value={content[labelKey] as string} onChange={(e) => setContent({ ...content, [labelKey]: e.target.value })} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ ...labelStyle, fontSize: "0.85rem" }}>{isAr ? "التسمية (إنجليزي)" : "Label (English)"}</label>
                      <input type="text" value={content[labelEnKey] as string} onChange={(e) => setContent({ ...content, [labelEnKey]: e.target.value })} style={inputStyle} />
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Section Header */}
          <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem", marginTop: "2rem", borderBottom: "2px solid #eee", paddingBottom: "0.5rem" }}>
            {isAr ? "عنوان قسم المشاريع" : "Projects Section Header"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={labelStyle}>{isAr ? "عنوان القسم (عربي)" : "Section Title (Arabic)"}</label>
              <input type="text" value={content.sectionTitle} onChange={(e) => setContent({ ...content, sectionTitle: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{isAr ? "عنوان القسم (إنجليزي)" : "Section Title (English)"}</label>
              <input type="text" value={content.sectionTitleEn} onChange={(e) => setContent({ ...content, sectionTitleEn: e.target.value })} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={labelStyle}>{isAr ? "وصف القسم (عربي)" : "Section Subtitle (Arabic)"}</label>
              <input type="text" value={content.sectionSubtitle} onChange={(e) => setContent({ ...content, sectionSubtitle: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{isAr ? "وصف القسم (إنجليزي)" : "Section Subtitle (English)"}</label>
              <input type="text" value={content.sectionSubtitleEn} onChange={(e) => setContent({ ...content, sectionSubtitleEn: e.target.value })} style={inputStyle} />
            </div>
          </div>

          {/* Empty State */}
          <h2 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "1.5rem", marginTop: "2rem", borderBottom: "2px solid #eee", paddingBottom: "0.5rem" }}>
            {isAr ? "رسالة الحالة الفارغة" : "Empty State Message"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            <div>
              <label style={labelStyle}>{isAr ? "الرسالة (عربي)" : "Message (Arabic)"}</label>
              <input type="text" value={content.emptyMessage} onChange={(e) => setContent({ ...content, emptyMessage: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>{isAr ? "الرسالة (إنجليزي)" : "Message (English)"}</label>
              <input type="text" value={content.emptyMessageEn} onChange={(e) => setContent({ ...content, emptyMessageEn: e.target.value })} style={inputStyle} />
            </div>
          </div>

          {/* Save */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={handleSave} disabled={saving} style={{
              padding: "0.75rem 2rem", background: saving ? "#ccc" : "#0070f3", color: "white", border: "none",
              borderRadius: "4px", cursor: saving ? "not-allowed" : "pointer", fontSize: "1rem", fontWeight: "bold",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <Save size={16} />
              {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
