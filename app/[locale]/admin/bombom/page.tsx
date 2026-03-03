"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Save, Plus, Trash2, ChevronDown, ChevronUp, ImagePlus,
  FerrisWheel, Castle, Brain, X,
} from "lucide-react";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

const ICON_OPTIONS = ["FerrisWheel", "Castle", "Brain", "Sun", "ToyBrick", "MountainSnow"];
const COLOR_OPTIONS: { hex: string; labelAr: string; labelEn: string }[] = [
  { hex: "#00BFFF", labelAr: "أزرق سماوي", labelEn: "Sky Blue" },
  { hex: "#FF1493", labelAr: "وردي زاهي", labelEn: "Deep Pink" },
  { hex: "#FFD700", labelAr: "ذهبي", labelEn: "Gold" },
  { hex: "#22c55e", labelAr: "أخضر", labelEn: "Green" },
  { hex: "#8b5cf6", labelAr: "بنفسجي", labelEn: "Violet" },
];

interface BombomZone {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  buttonLabel: string;
  buttonLabelEn: string;
  icon: string;
  color: string;
  gallery: { image: string; caption: string }[];
  order: number;
  isPublished: boolean;
}

let currentLocale: Locale = "ar";

function EditableImage({
  src,
  alt,
  onChange,
  width = 120,
  height = 80,
}: {
  src: string;
  alt: string;
  onChange: (p: string) => void;
  width?: number;
  height?: number;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        position: "relative",
        cursor: "pointer",
        width,
        height,
        borderRadius: 8,
        overflow: "hidden",
        border: "2px dashed #ccc",
        background: "#f5f5f5",
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      {isUploading ? (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#666" }}>
          {currentLocale === "ar" ? "جاري الرفع..." : "Uploading..."}
        </div>
      ) : src ? (
        <Image src={src} alt={alt} width={width} height={height} style={{ objectFit: "cover", width: "100%", height: "100%" }} unoptimized />
      ) : (
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#999" }}>
          <ImagePlus size={20} style={{ marginBottom: 4 }} />
          {currentLocale === "ar" ? "إضافة صورة" : "Add image"}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file?.type.startsWith("image/")) return;
          setIsUploading(true);
          const fd = new FormData();
          fd.append("file", file);
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

function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "1.5rem", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          background: "#f9fafb",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        {title}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div style={{ padding: "1rem 1.5rem", background: "#fff" }}>{children}</div>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: "0.95rem",
};
const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.35rem", fontWeight: 600, fontSize: "0.9rem" };

export default function AdminBombomPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocaleState, setCurrentLocale] = useState<Locale>(locale);
  currentLocale = currentLocaleState;
  const isAr = currentLocaleState === "ar";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [content, setContent] = useState<Record<string, string | null>>({});
  const [zones, setZones] = useState<BombomZone[]>([]);
  const [editingZone, setEditingZone] = useState<BombomZone | null>(null);
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZone, setNewZone] = useState<Partial<BombomZone>>({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    buttonLabel: "استكشف الآن",
    buttonLabelEn: "Explore Now",
    icon: "FerrisWheel",
    color: "#00BFFF",
    gallery: [],
    isPublished: true,
  });

  useEffect(() => {
    fetchContent();
    fetchZones();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/bombom-content");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          let gallery = data.gallery;
          if (typeof gallery === "string") {
            try { gallery = JSON.parse(gallery) || []; } catch { gallery = []; }
          }
          setContent({ ...data, gallery: Array.isArray(gallery) ? gallery : [] });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchZones = async () => {
    try {
      const res = await fetch("/api/bombom-zones");
      if (res.ok) {
        const data = await res.json();
        setZones(Array.isArray(data) ? data.map((z: any) => ({
          ...z,
          gallery: typeof z.gallery === "string" ? (() => { try { return JSON.parse(z.gallery) || []; } catch { return []; } })() : (z.gallery || []),
        })) : []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/bombom-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } else {
        alert(isAr ? "فشل الحفظ" : "Save failed");
      }
    } catch {
      alert(isAr ? "حدث خطأ" : "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveZone = async (zone: BombomZone | Partial<BombomZone>) => {
    setSaving(true);
    try {
      const payload = {
        title: zone.title,
        titleEn: zone.titleEn,
        description: zone.description,
        descriptionEn: zone.descriptionEn,
        buttonLabel: zone.buttonLabel,
        buttonLabelEn: zone.buttonLabelEn,
        icon: zone.icon,
        color: zone.color,
        gallery: zone.gallery,
        order: zone.order,
        isPublished: zone.isPublished,
      };
      if ("id" in zone && zone.id) {
        const res = await fetch(`/api/bombom-zones/${zone.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (res.ok) {
          await fetchZones();
          setEditingZone(null);
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        }
      } else {
        const res = await fetch("/api/bombom-zones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (res.ok) {
          await fetchZones();
          setIsAddingZone(false);
          setNewZone({ title: "", titleEn: "", description: "", descriptionEn: "", buttonLabel: "استكشف الآن", buttonLabelEn: "Explore Now", icon: "FerrisWheel", color: "#00BFFF", gallery: [], isPublished: true });
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        }
      }
    } catch {
      alert(isAr ? "حدث خطأ" : "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (!confirm(isAr ? "هل تريد حذف هذه المنطقة؟" : "Delete this zone?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/bombom-zones/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchZones();
        setEditingZone(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  const renderFormGroup = (key: string, labelAr: string, labelEn: string, textarea = false) => (
    <div style={{ marginBottom: "1rem" }}>
      <label style={labelStyle}>{isAr ? labelAr : labelEn}</label>
      {textarea ? (
        <textarea
          value={content[key] ?? ""}
          onChange={(e) => setContent({ ...content, [key]: e.target.value })}
          rows={2}
          style={{ ...inputStyle, fontFamily: "inherit" }}
        />
      ) : (
        <input type="text" value={content[key] ?? ""} onChange={(e) => setContent({ ...content, [key]: e.target.value })} style={inputStyle} />
      )}
    </div>
  );

  const renderZoneForm = (zone: BombomZone | Partial<BombomZone>, setZone: (z: any) => void, onSave: () => void, onCancel: () => void, onDelete?: () => void) => (
    <div style={{ padding: "1rem", background: "#f9fafb", borderRadius: 8, marginBottom: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</label>
          <input value={zone.title ?? ""} onChange={(e) => setZone({ ...zone, title: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
          <input value={zone.titleEn ?? ""} onChange={(e) => setZone({ ...zone, titleEn: e.target.value })} style={inputStyle} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.75rem" }}>
        <div>
          <label style={labelStyle}>{isAr ? "الوصف (عربي)" : "Description (Arabic)"}</label>
          <textarea value={zone.description ?? ""} onChange={(e) => setZone({ ...zone, description: e.target.value })} rows={2} style={{ ...inputStyle, fontFamily: "inherit" }} />
        </div>
        <div>
          <label style={labelStyle}>{isAr ? "الوصف (إنجليزي)" : "Description (English)"}</label>
          <textarea value={zone.descriptionEn ?? ""} onChange={(e) => setZone({ ...zone, descriptionEn: e.target.value })} rows={2} style={{ ...inputStyle, fontFamily: "inherit" }} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem", marginTop: "0.75rem" }}>
        <div>
          <label style={labelStyle}>{isAr ? "نص الزر (عربي)" : "Button (Arabic)"}</label>
          <input value={zone.buttonLabel ?? ""} onChange={(e) => setZone({ ...zone, buttonLabel: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{isAr ? "نص الزر (إنجليزي)" : "Button (English)"}</label>
          <input value={zone.buttonLabelEn ?? ""} onChange={(e) => setZone({ ...zone, buttonLabelEn: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>{isAr ? "الأيقونة" : "Icon"}</label>
          <select value={zone.icon ?? "FerrisWheel"} onChange={(e) => setZone({ ...zone, icon: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
            {ICON_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>{isAr ? "اللون" : "Color"}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.25rem", alignItems: "center" }}>
            {COLOR_OPTIONS.map((c) => {
              const isSelected = (zone.color ?? "#00BFFF") === c.hex;
              return (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setZone({ ...zone, color: c.hex })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.75rem",
                    borderRadius: 8,
                    border: isSelected ? "3px solid #0F1C2A" : "2px solid #e5e7eb",
                    background: "#fff",
                    cursor: "pointer",
                    boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                  }}
                >
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      background: c.hex,
                      border: "1px solid rgba(0,0,0,0.2)",
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                    {isAr ? c.labelAr : c.labelEn}
                  </span>
                </button>
              );
            })}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginRight: isAr ? 0 : "auto" }}>
              <input
                type="color"
                value={zone.color ?? "#00BFFF"}
                onChange={(e) => setZone({ ...zone, color: e.target.value })}
                title={isAr ? "لون مخصص" : "Custom color"}
                style={{ width: 36, height: 36, padding: 2, border: "2px solid #e5e7eb", borderRadius: 8, cursor: "pointer" }}
              />
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{isAr ? "لون مخصص" : "Custom"}</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <label style={labelStyle}>{isAr ? "معرض الصور" : "Photo Gallery"}</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(zone.gallery ?? []).map((g, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ width: 80, height: 60, borderRadius: 6, overflow: "hidden", border: "1px solid #ddd" }}>
                <Image src={g.image} alt={g.caption} width={80} height={60} style={{ objectFit: "cover", width: "100%", height: "100%" }} unoptimized />
              </div>
              <button
                type="button"
                onClick={() => setZone({ ...zone, gallery: (zone.gallery ?? []).filter((_, j) => j !== i) })}
                style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          <EditableImage
            src=""
            alt="Add"
            width={80}
            height={60}
            onChange={(url) => setZone({ ...zone, gallery: [...(zone.gallery ?? []), { image: url, caption: "" }] })}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <button onClick={onSave} disabled={saving} style={{ padding: "0.5rem 1.25rem", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: saving ? "not-allowed" : "pointer", fontWeight: 600 }}>
          {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}
        </button>
        <button onClick={onCancel} style={{ padding: "0.5rem 1.25rem", background: "#6b7280", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
          {isAr ? "إلغاء" : "Cancel"}
        </button>
        {onDelete && (
          <button onClick={onDelete} style={{ padding: "0.5rem 1.25rem", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
            <Trash2 size={14} style={{ marginRight: 4, verticalAlign: "middle" }} />
            {isAr ? "حذف" : "Delete"}
          </button>
        )}
      </div>
    </div>
  );

  if (authLoading || loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "1.2rem" }}>
        {isAr ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontSize: "1.2rem" }}>
        {isAr ? "غير مصرح" : "Unauthorized"}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <AdminNav locale={currentLocaleState} />
      <div style={{ position: "fixed", top: "5rem", right: "1rem", zIndex: 9999 }}>
        <LogoutButton />
      </div>

      <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", direction: isAr ? "rtl" : "ltr" }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>{isAr ? "إدارة بوم بوم" : "Manage Bom Bom"}</h1>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <button
              onClick={() => setCurrentLocale("ar")}
              style={{
                padding: "0.5rem 1rem",
                background: currentLocaleState === "ar" ? "#0F1C2A" : "#e5e7eb",
                color: currentLocaleState === "ar" ? "#fff" : "#374151",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              العربية
            </button>
            <button
              onClick={() => setCurrentLocale("en")}
              style={{
                padding: "0.5rem 1rem",
                background: currentLocaleState === "en" ? "#0F1C2A" : "#e5e7eb",
                color: currentLocaleState === "en" ? "#fff" : "#374151",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              English
            </button>
          </div>
        </div>

        {saved && (
          <div style={{ padding: "1rem", background: "#10b981", color: "#fff", borderRadius: 8, marginBottom: "1rem", textAlign: "center" }}>
            {isAr ? "تم الحفظ بنجاح!" : "Saved successfully!"}
          </div>
        )}

        <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.5rem", borderBottom: "2px solid #eee", paddingBottom: "0.5rem" }}>
            {isAr ? "محتوى الصفحة" : "Page Content"}
          </h2>

          <CollapsibleSection title={isAr ? "الشريط العلوي والهيرو" : "Nav & Hero"}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {renderFormGroup("homeLabel", "الرئيسية (عربي)", "Home (Arabic)")}
              {renderFormGroup("homeLabelEn", "الرئيسية (إنجليزي)", "Home (English)")}
              {renderFormGroup("zonesLabel", "مناطق اللعب (عربي)", "Zones (Arabic)")}
              {renderFormGroup("zonesLabelEn", "مناطق اللعب (إنجليزي)", "Zones (English)")}
              {renderFormGroup("bookNowLabel", "احجز الآن (عربي)", "Book Now (Arabic)")}
              {renderFormGroup("bookNowLabelEn", "احجز الآن (إنجليزي)", "Book Now (English)")}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <label style={labelStyle}>{isAr ? "شعار الهيرو" : "Hero Logo"}</label>
              <EditableImage src={content.heroLogo ?? ""} alt="Hero" width={120} height={80} onChange={(url) => setContent({ ...content, heroLogo: url })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              {renderFormGroup("tagline", "الشعار (عربي)", "Tagline (Arabic)")}
              {renderFormGroup("taglineEn", "الشعار (إنجليزي)", "Tagline (English)")}
              {renderFormGroup("heroTitle1", "جزء العنوان 1 (عربي)", "Hero Title Part 1 (Arabic)")}
              {renderFormGroup("heroTitle1En", "جزء العنوان 1 (إنجليزي)", "Hero Title Part 1 (English)")}
              {renderFormGroup("heroBrand", "العلامة (عربي)", "Brand (Arabic)")}
              {renderFormGroup("heroBrandEn", "العلامة (إنجليزي)", "Brand (English)")}
              {renderFormGroup("heroTitle2", "جزء العنوان 2 (عربي)", "Hero Title Part 2 (Arabic)")}
              {renderFormGroup("heroTitle2En", "جزء العنوان 2 (إنجليزي)", "Hero Title Part 2 (English)")}
              {renderFormGroup("playBtn", "زر اللعب (عربي)", "Play Button (Arabic)")}
              {renderFormGroup("playBtnEn", "زر اللعب (إنجليزي)", "Play Button (English)")}
              {renderFormGroup("exploreBtn", "زر الاستكشاف (عربي)", "Explore Button (Arabic)")}
              {renderFormGroup("exploreBtnEn", "زر الاستكشاف (إنجليزي)", "Explore Button (English)")}
            </div>
            {renderFormGroup("heroDesc", "وصف الهيرو (عربي)", "Hero Description (Arabic)", true)}
            {renderFormGroup("heroDescEn", "وصف الهيرو (إنجليزي)", "Hero Description (English)", true)}
          </CollapsibleSection>

          <CollapsibleSection title={isAr ? "معرض الصور (فوق مناطق اللعب)" : "Photo Gallery (above Play Zones)"}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <input type="checkbox" id="showGallery" checked={content.showGallery !== false} onChange={(e) => setContent({ ...content, showGallery: e.target.checked })} />
              <label htmlFor="showGallery" style={{ fontWeight: 600 }}>{isAr ? "إظهار معرض الصور" : "Show Photo Gallery"}</label>
            </div>
            {renderFormGroup("galleryTitle", "عنوان المعرض (عربي)", "Gallery Title (Arabic)")}
            {renderFormGroup("galleryTitleEn", "عنوان المعرض (إنجليزي)", "Gallery Title (English)")}
            {renderFormGroup("gallerySub", "وصف المعرض (عربي)", "Gallery Subtitle (Arabic)")}
            {renderFormGroup("gallerySubEn", "وصف المعرض (إنجليزي)", "Gallery Subtitle (English)")}
            <div style={{ marginTop: "1rem" }}>
              <label style={labelStyle}>{isAr ? "صور المعرض" : "Gallery Images"}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {((content.gallery as { image: string; caption: string }[]) || []).map((g, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div style={{ width: 80, height: 60, borderRadius: 6, overflow: "hidden", border: "1px solid #ddd" }}>
                      <Image src={g.image} alt={g.caption} width={80} height={60} style={{ objectFit: "cover", width: "100%", height: "100%" }} unoptimized />
                    </div>
                    <button type="button" onClick={() => setContent({ ...content, gallery: ((content.gallery as any[]) || []).filter((_, j) => j !== i) })} style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}><X size={12} /></button>
                  </div>
                ))}
                <EditableImage src="" alt="Add" width={80} height={60} onChange={(url) => setContent({ ...content, gallery: [...((content.gallery as any[]) || []), { image: url, caption: "" }] })} />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={isAr ? "قسم مناطق اللعب" : "Play Zones Section"}>
            {renderFormGroup("zonesTitle", "عنوان القسم (عربي)", "Section Title (Arabic)")}
            {renderFormGroup("zonesTitleEn", "عنوان القسم (إنجليزي)", "Section Title (English)")}
            {renderFormGroup("zonesSub", "وصف القسم (عربي)", "Section Subtitle (Arabic)")}
            {renderFormGroup("zonesSubEn", "وصف القسم (إنجليزي)", "Section Subtitle (English)")}
          </CollapsibleSection>

          <CollapsibleSection title={isAr ? "قسم الحفلات" : "Events Section"}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>{isAr ? "صورة القسم" : "Section Image"}</label>
              <EditableImage src={content.eventsImage ?? ""} alt="Events" width={200} height={120} onChange={(url) => setContent({ ...content, eventsImage: url })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {renderFormGroup("eventTitle", "عنوان الفقرة (عربي)", "Event Title (Arabic)")}
              {renderFormGroup("eventTitleEn", "عنوان الفقرة (إنجليزي)", "Event Title (English)")}
              {renderFormGroup("eventTitleBrand", "كلمة الأصدقاء (عربي)", "Friends (Arabic)")}
              {renderFormGroup("eventTitleBrandEn", "كلمة الأصدقاء (إنجليزي)", "Friends (English)")}
              {renderFormGroup("eventTitle2", "والغيوم (عربي)", "& Clouds (Arabic)")}
              {renderFormGroup("eventTitle2En", "والغيوم (إنجليزي)", "& Clouds (English)")}
              {renderFormGroup("eventFeat1", "ميزة 1 (عربي)", "Feature 1 (Arabic)")}
              {renderFormGroup("eventFeat1En", "ميزة 1 (إنجليزي)", "Feature 1 (English)")}
              {renderFormGroup("eventFeat2", "ميزة 2 (عربي)", "Feature 2 (Arabic)")}
              {renderFormGroup("eventFeat2En", "ميزة 2 (إنجليزي)", "Feature 2 (English)")}
              {renderFormGroup("eventFeat3", "ميزة 3 (عربي)", "Feature 3 (Arabic)")}
              {renderFormGroup("eventFeat3En", "ميزة 3 (إنجليزي)", "Feature 3 (English)")}
              {renderFormGroup("eventBadge1", "الشارة 1 (عربي)", "Badge 1 (Arabic)")}
              {renderFormGroup("eventBadge1En", "الشارة 1 (إنجليزي)", "Badge 1 (English)")}
              {renderFormGroup("eventBadge2", "الشارة 2 (عربي)", "Badge 2 (Arabic)")}
              {renderFormGroup("eventBadge2En", "الشارة 2 (إنجليزي)", "Badge 2 (English)")}
            </div>
            {renderFormGroup("eventDesc", "وصف الحفلات (عربي)", "Event Description (Arabic)", true)}
            {renderFormGroup("eventDescEn", "وصف الحفلات (إنجليزي)", "Event Description (English)", true)}
          </CollapsibleSection>

          <CollapsibleSection title={isAr ? "دعوة للعمل (احجز / تواصل)" : "CTA (Book / Contact)"}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {renderFormGroup("ctaTitle", "عنوان CTA (عربي)", "CTA Title (Arabic)")}
              {renderFormGroup("ctaTitleEn", "عنوان CTA (إنجليزي)", "CTA Title (English)")}
              {renderFormGroup("ctaBtn1", "زر احجز تذكرتك (عربي)", "Book Ticket Button (Arabic)")}
              {renderFormGroup("ctaBtn1En", "زر احجز تذكرتك (إنجليزي)", "Book Ticket Button (English)")}
              {renderFormGroup("ctaBtn2", "زر تواصل معنا (عربي)", "Contact Button (Arabic)")}
              {renderFormGroup("ctaBtn2En", "زر تواصل معنا (إنجليزي)", "Contact Button (English)")}
              {renderFormGroup("bookTicketUrl", "رابط احجز تذكرتك", "Book Ticket URL")}
              {renderFormGroup("contactUrl", "رابط تواصل معنا", "Contact URL")}
            </div>
            {renderFormGroup("ctaDesc", "وصف CTA (عربي)", "CTA Description (Arabic)", true)}
            {renderFormGroup("ctaDescEn", "وصف CTA (إنجليزي)", "CTA Description (English)", true)}
          </CollapsibleSection>

          <CollapsibleSection title={isAr ? "الفوتر" : "Footer"}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>{isAr ? "شعار الفوتر" : "Footer Logo"}</label>
              <EditableImage src={content.footerLogo ?? ""} alt="Footer" width={120} height={80} onChange={(url) => setContent({ ...content, footerLogo: url })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {renderFormGroup("footerDesc", "وصف الفوتر (عربي)", "Footer Description (Arabic)", true)}
              {renderFormGroup("footerDescEn", "وصف الفوتر (إنجليزي)", "Footer Description (English)", true)}
              {renderFormGroup("footerExplore", "استكشف (عربي)", "Explore (Arabic)")}
              {renderFormGroup("footerExploreEn", "استكشف (إنجليزي)", "Explore (English)")}
              {renderFormGroup("footerAbout", "عن المركز (عربي)", "About (Arabic)")}
              {renderFormGroup("footerAboutEn", "عن المركز (إنجليزي)", "About (English)")}
              {renderFormGroup("footerZones", "مناطق اللعب (عربي)", "Zones (Arabic)")}
              {renderFormGroup("footerZonesEn", "مناطق اللعب (إنجليزي)", "Zones (English)")}
              {renderFormGroup("footerPrices", "الأسعار (عربي)", "Prices (Arabic)")}
              {renderFormGroup("footerPricesEn", "الأسعار (إنجليزي)", "Prices (English)")}
              {renderFormGroup("footerContact", "تواصل (عربي)", "Contact (Arabic)")}
              {renderFormGroup("footerContactEn", "تواصل (إنجليزي)", "Contact (English)")}
              {renderFormGroup("footerCountry", "البلد (عربي)", "Country (Arabic)")}
              {renderFormGroup("footerCountryEn", "البلد (إنجليزي)", "Country (English)")}
              {renderFormGroup("footerPhone", "الهاتف (عربي)", "Phone (Arabic)")}
              {renderFormGroup("footerPhoneEn", "الهاتف (إنجليزي)", "Phone (English)")}
              {renderFormGroup("footerFollow", "تابعنا (عربي)", "Follow (Arabic)")}
              {renderFormGroup("footerFollowEn", "تابعنا (إنجليزي)", "Follow (English)")}
              {renderFormGroup("instagramLink", "رابط انستغرام", "Instagram URL")}
              {renderFormGroup("facebookLink", "رابط فيسبوك", "Facebook URL")}
              {renderFormGroup("copyright", "حقوق النشر (عربي)", "Copyright (Arabic)")}
              {renderFormGroup("copyrightEn", "حقوق النشر (إنجليزي)", "Copyright (English)")}
            </div>
          </CollapsibleSection>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
            <button
              onClick={handleSaveContent}
              disabled={saving}
              style={{
                padding: "0.75rem 2rem",
                background: saving ? "#9ca3af" : "#0F1C2A",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Save size={18} />
              {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ المحتوى" : "Save Content")}
            </button>
          </div>
        </div>

        {/* Zones */}
        <div style={{ background: "#fff", padding: "2rem", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, borderBottom: "2px solid #eee", paddingBottom: "0.5rem" }}>
              {isAr ? "مناطق اللعب" : "Play Zones"}
            </h2>
            {!isAddingZone && !editingZone && (
              <button
                onClick={() => setIsAddingZone(true)}
                style={{
                  padding: "0.5rem 1.25rem",
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: 600,
                }}
              >
                <Plus size={18} />
                {isAr ? "إضافة منطقة" : "Add Zone"}
              </button>
            )}
          </div>

          {isAddingZone && renderZoneForm(newZone, setNewZone, () => handleSaveZone(newZone), () => setIsAddingZone(false))}

          {editingZone && renderZoneForm(editingZone, setEditingZone, () => handleSaveZone(editingZone), () => setEditingZone(null), () => editingZone.id && handleDeleteZone(editingZone.id))}

          {!isAddingZone && !editingZone && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {zones.map((z) => (
                <div
                  key={z.id}
                  style={{
                    padding: "1rem 1.25rem",
                    background: "#f9fafb",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>{isAr ? z.title : z.titleEn || z.title}</span>
                    <span style={{ marginLeft: 8, marginRight: 8, color: "#6b7280", fontSize: "0.9rem" }}>•</span>
                    <span style={{ color: z.color, fontWeight: 600 }}>{z.icon}</span>
                  </div>
                  <button
                    onClick={() => setEditingZone(z)}
                    style={{
                      padding: "0.4rem 1rem",
                      background: "#0F1C2A",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: "0.9rem",
                    }}
                  >
                    {isAr ? "تعديل" : "Edit"}
                  </button>
                </div>
              ))}
              {zones.length === 0 && (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>{isAr ? "لا توجد مناطق. انقر إضافة منطقة." : "No zones. Click Add Zone."}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
