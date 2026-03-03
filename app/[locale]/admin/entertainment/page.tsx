"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Plus, X, Trash2, Edit2, Save, ImagePlus, Sparkles, Star,
  Clapperboard, Globe, Building2, Award, Layers, MapPin, Calendar,
  ArrowRight, ArrowLeft, Settings, Eye, EyeOff, GripVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

const iconMap: Record<string, any> = { Sparkles, Star, Clapperboard, Globe, Building2, Award, Layers };
const iconOptions = Object.keys(iconMap);

interface GalleryItem { image: string; caption: string; captionEn: string; }

interface EntProject {
  id: string;
  title: string; titleEn: string;
  description: string; descriptionEn: string;
  fullDescription: string; fullDescriptionEn: string;
  image: string; gallery: GalleryItem[];
  category: string | null; categoryEn: string | null;
  location: string | null; locationEn: string | null;
  year: string | null; status: string | null; statusEn: string | null;
  ctaLabel: string | null; ctaLabelEn: string | null;
  order: number; isPublished: boolean;
}

interface ContentState {
  heroTitle: string; heroTitleEn: string;
  heroSubtitle: string; heroSubtitleEn: string;
  heroImages: string[];
  showStats: boolean;
  stat1Icon: string; stat1Number: string; stat1Label: string; stat1LabelEn: string;
  stat2Icon: string; stat2Number: string; stat2Label: string; stat2LabelEn: string;
  stat3Icon: string; stat3Number: string; stat3Label: string; stat3LabelEn: string;
  sectionTitle: string; sectionTitleEn: string;
  sectionSubtitle: string; sectionSubtitleEn: string;
  emptyMessage: string; emptyMessageEn: string;
  showBombom: boolean;
  isUnderConstruction: boolean;
}

let currentLocale: Locale = "ar";

function EditableImage({ src, alt, onChange, width = 300, height = 200 }: {
  src: string; alt: string; onChange: (p: string) => void; width?: number; height?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ position: "relative", cursor: "pointer", width, height }}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      onClick={() => fileInputRef.current?.click()}>
      {isUploading ? (
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(212,193,157,0.1)", border: "2px dashed rgba(212,193,157,0.3)", borderRadius: "8px", color: "var(--gold)"
        }}>
          {currentLocale === "ar" ? "جاري الرفع..." : "Uploading..."}
        </div>
      ) : src ? (
        <Image src={src} alt={alt} width={width} height={height} style={{
          objectFit: "cover", borderRadius: "8px", width: "100%", height: "100%",
          border: isHovered ? "3px solid var(--gold)" : "3px solid transparent", transition: "all 0.3s", opacity: isHovered ? 0.8 : 1,
        }} unoptimized />
      ) : (
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(212,193,157,0.05)", border: "2px dashed rgba(212,193,157,0.3)", borderRadius: "8px", color: "rgba(212,193,157,0.6)"
        }}>
          <ImagePlus size={24} style={{ marginRight: "0.5rem" }} />
          {currentLocale === "ar" ? "انقر لاختيار صورة" : "Click to choose image"}
        </div>
      )}
      {!isUploading && src && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: isHovered ? "rgba(212,193,157,0.9)" : "rgba(0,0,0,0.65)",
          color: isHovered ? "#000" : "white", padding: "0.4rem 0.75rem", borderRadius: "0 0 8px 8px",
          fontSize: "0.8rem", pointerEvents: "none", textAlign: "center", transition: "all 0.2s"
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
          } catch { /* noop */ } finally { setIsUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
        }} />
    </div>
  );
}

const emptyProject: Omit<EntProject, "id"> = {
  title: "", titleEn: "", description: "", descriptionEn: "",
  fullDescription: "", fullDescriptionEn: "",
  image: "", gallery: [],
  category: "", categoryEn: "", location: "", locationEn: "",
  year: "", status: "", statusEn: "", ctaLabel: "", ctaLabelEn: "", order: 0, isPublished: true,
};

function SectionEditButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{
      position: "absolute", top: "1rem", left: "1rem", zIndex: 10,
      display: "flex", alignItems: "center", gap: "0.4rem",
      padding: "0.5rem 1rem", background: "rgba(212,193,157,0.9)", color: "#000",
      border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700,
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)", transition: "all 0.2s",
    }}>
      <Edit2 size={14} /> {label}
    </button>
  );
}

function Modal({ open, onClose, title, children, wide }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "relative", background: "#111", border: "1px solid rgba(212,193,157,0.2)",
        borderRadius: "16px", padding: "2rem", maxWidth: wide ? "1000px" : "700px", width: "95vw",
        maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem",
          borderBottom: "1px solid rgba(212,193,157,0.15)", paddingBottom: "1rem"
        }}>
          <h2 style={{
            fontSize: "1.4rem", fontWeight: 700, color: "var(--gold)",
            fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif'
          }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "rgba(212,193,157,0.1)", border: "1px solid rgba(212,193,157,0.2)",
            borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--gold)"
          }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem", border: "1px solid rgba(212,193,157,0.2)",
  borderRadius: "8px", fontSize: "0.95rem", background: "rgba(212,193,157,0.05)",
  color: "#fff", outline: "none", fontFamily: "inherit",
};
const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "rgba(212,193,157,0.8)", fontSize: "0.85rem" };
const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

export default function AdminEntertainmentPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocaleState, setCurrentLocale] = useState<Locale>(locale);
  currentLocale = currentLocaleState;
  const isAr = currentLocaleState === "ar";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [content, setContent] = useState<ContentState>({
    heroTitle: "", heroTitleEn: "", heroSubtitle: "", heroSubtitleEn: "",
    heroImages: [], showStats: true,
    stat1Icon: "Sparkles", stat1Number: "4+", stat1Label: "", stat1LabelEn: "",
    stat2Icon: "Star", stat2Number: "3", stat2Label: "", stat2LabelEn: "",
    stat3Icon: "Clapperboard", stat3Number: "100K+", stat3Label: "", stat3LabelEn: "",
    sectionTitle: "", sectionTitleEn: "", sectionSubtitle: "", sectionSubtitleEn: "",
    emptyMessage: "", emptyMessageEn: "",
    showBombom: true,
    isUnderConstruction: true,
  });

  const [projects, setProjects] = useState<EntProject[]>([]);
  const [editingHero, setEditingHero] = useState(false);
  const [editingSection, setEditingSection] = useState(false);
  const [projectModal, setProjectModal] = useState<{ mode: "create" | "edit"; data: any } | null>(null);

  const [heroActiveIndex, setHeroActiveIndex] = useState(0);

  useEffect(() => {
    Promise.all([fetchContent(), fetchProjects()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const images = content.heroImages.filter(img => img && img.trim() !== "");
    if (images.length <= 1) return;
    const interval = setInterval(() => setHeroActiveIndex(prev => (prev + 1) % images.length), 6000);
    return () => clearInterval(interval);
  }, [content.heroImages]);

  const fetchContent = async () => {
    try {
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
          showBombom: data.showBombom ?? true,
          isUnderConstruction: data.isUnderConstruction ?? true,
        });
      }
    } catch (err) { console.error("Error fetching content:", err); }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/entertainment?all=true&locale=${currentLocaleState}`);
      if (res.ok) { const data = await res.json(); setProjects(data.projects || []); }
    } catch (err) { console.error("Error fetching projects:", err); }
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/entertainment-content", {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); setEditingHero(false); setEditingSection(false); }
    } catch { alert(isAr ? "حدث خطأ أثناء الحفظ" : "Error saving"); }
    finally { setSaving(false); }
  };

  const saveProject = async (project: any) => {
    setSaving(true);
    try {
      const isNew = !project.id;
      const res = await fetch("/api/entertainment", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); fetchProjects(); setProjectModal(null); }
    } catch { alert(isAr ? "حدث خطأ" : "Error"); }
    finally { setSaving(false); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذا المشروع؟" : "Delete this project?")) return;
    try {
      const res = await fetch(`/api/entertainment?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch { alert(isAr ? "حدث خطأ أثناء الحذف" : "Error deleting"); }
  };

  if (loading || authLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#000", color: "var(--gold)", fontSize: "1.2rem" }}>
        {isAr ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#000", color: "var(--gold)", fontSize: "1.2rem" }}>
        {isAr ? "غير مصرح" : "Unauthorized"}
      </div>
    );
  }

  const heroImages = content.heroImages.filter(img => img && img.trim() !== "");
  const hasHeroImages = heroImages.length > 0;

  const localizedTitle = isAr ? content.heroTitle : (content.heroTitleEn || content.heroTitle);
  const localizedSubtitle = isAr ? content.heroSubtitle : (content.heroSubtitleEn || content.heroSubtitle);
  const localizedSectionTitle = isAr ? content.sectionTitle : (content.sectionTitleEn || content.sectionTitle);
  const localizedSectionSubtitle = isAr ? content.sectionSubtitle : (content.sectionSubtitleEn || content.sectionSubtitle);

  const stats = [
    { icon: content.stat1Icon, num: content.stat1Number, label: isAr ? content.stat1Label : (content.stat1LabelEn || content.stat1Label) },
    { icon: content.stat2Icon, num: content.stat2Number, label: isAr ? content.stat2Label : (content.stat2LabelEn || content.stat2Label) },
    { icon: content.stat3Icon, num: content.stat3Number, label: isAr ? content.stat3Label : (content.stat3LabelEn || content.stat3Label) },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
      <AdminNav locale={currentLocaleState} />
      <div style={{ position: "fixed", top: "5rem", right: "1rem", zIndex: 10001 }}>
        <LogoutButton />
      </div>

      {/* Floating Admin Bar */}
      <div style={{
        position: "fixed", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 10001,
        display: "flex", alignItems: "center", gap: "0.75rem",
        background: "rgba(17,17,17,0.95)", border: "1px solid rgba(212,193,157,0.3)",
        borderRadius: "16px", padding: "0.6rem 1.2rem", backdropFilter: "blur(10px)",
        boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
      }}>
        <button onClick={() => setCurrentLocale("ar")} style={{
          padding: "0.4rem 0.8rem", background: currentLocaleState === "ar" ? "var(--gold)" : "transparent",
          color: currentLocaleState === "ar" ? "#000" : "rgba(212,193,157,0.7)",
          border: "1px solid rgba(212,193,157,0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem",
        }}>العربية</button>
        <button onClick={() => setCurrentLocale("en")} style={{
          padding: "0.4rem 0.8rem", background: currentLocaleState === "en" ? "var(--gold)" : "transparent",
          color: currentLocaleState === "en" ? "#000" : "rgba(212,193,157,0.7)",
          border: "1px solid rgba(212,193,157,0.3)", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem",
        }}>English</button>

        <div style={{ width: "1px", height: "24px", background: "rgba(212,193,157,0.2)" }} />

        <button onClick={() => setProjectModal({ mode: "create", data: { ...emptyProject, order: projects.length } })} style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          padding: "0.4rem 1rem", background: "rgba(76,175,80,0.9)", color: "#fff",
          border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 700, fontSize: "0.8rem",
        }}>
          <Plus size={14} /> {isAr ? "مشروع جديد" : "New Project"}
        </button>

        {saved && (
          <div style={{ padding: "0.4rem 0.8rem", background: "rgba(76,175,80,0.9)", color: "#fff", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700 }}>
            {isAr ? "تم الحفظ ✓" : "Saved ✓"}
          </div>
        )}
      </div>

      {/* ═══════════════════ HERO SECTION (live preview) ═══════════════════ */}
      <section style={{
        paddingTop: "160px", paddingBottom: "100px", textAlign: "center", position: "relative", overflow: "hidden",
        background: hasHeroImages ? "none" : "radial-gradient(ellipse at center top, rgba(212,193,157,0.18) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(139,92,246,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(236,72,153,0.06) 0%, transparent 50%), #000",
        minHeight: hasHeroImages ? "80vh" : "auto", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <SectionEditButton onClick={() => setEditingHero(true)} label={isAr ? "تعديل الهيرو" : "Edit Hero"} />

        {hasHeroImages && (
          <>
            <AnimatePresence mode="popLayout">
              <motion.div key={heroActiveIndex} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }} style={{ position: "absolute", inset: 0 }}>
                <Image src={heroImages[heroActiveIndex]} alt="" fill style={{ objectFit: "cover" }} unoptimized />
              </motion.div>
            </AnimatePresence>
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.4) 100%)"
            }} />
          </>
        )}

        {!hasHeroImages && (
          <>
            <motion.div style={{
              position: "absolute", top: "10%", left: "5%", width: "200px", height: "200px",
              background: "radial-gradient(circle, rgba(212,193,157,0.2) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)"
            }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
            <motion.div style={{
              position: "absolute", bottom: "10%", right: "5%", width: "250px", height: "250px",
              background: "radial-gradient(circle, rgba(212,193,157,0.15) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)"
            }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} />
          </>
        )}

        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 2 }}>
          {!hasHeroImages && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", width: "90px", height: "90px", borderRadius: "50%",
                background: "linear-gradient(135deg, var(--gold) 0%, rgba(212,193,157,0.7) 100%)", boxShadow: "0 10px 40px rgba(212,193,157,0.4)"
              }}>
                <Clapperboard size={42} color="var(--dark)" strokeWidth={1.5} />
              </div>
            </div>
          )}
          <div style={{ display: "inline-block", width: "80px", height: "4px", background: "var(--gold)", marginBottom: "2rem", borderRadius: "2px" }} />
          <h1 style={{
            fontSize: "clamp(2.5rem, 6vw, 4rem)", marginBottom: "1.5rem", fontWeight: 700, color: "var(--gold)", lineHeight: 1.2,
            textShadow: "0 2px 20px rgba(212,193,157,0.3)"
          }}>
            {localizedTitle || (isAr ? "عالم الترفيه" : "Entertainment World")}
          </h1>
          <p style={{
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", color: "rgba(212,193,157,0.9)", lineHeight: 1.8,
            maxWidth: "750px", margin: "0 auto 2rem", opacity: 0.9
          }}>
            {localizedSubtitle || (isAr ? "نبتكر تجارب ترفيهية استثنائية" : "We create exceptional entertainment experiences")}
          </p>

          {hasHeroImages && heroImages.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
              {heroImages.map((_, i) => (
                <button key={i} onClick={() => setHeroActiveIndex(i)} style={{
                  width: i === heroActiveIndex ? "2rem" : "0.5rem", height: "0.5rem", borderRadius: "0.25rem", border: "none", cursor: "pointer",
                  background: i === heroActiveIndex ? "var(--gold)" : "rgba(212,193,157,0.4)", transition: "all 0.4s ease",
                }} />
              ))}
            </div>
          )}

          {content.showStats && (
            <div style={{
              display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap", marginTop: "3rem",
              paddingTop: "2rem", borderTop: "1px solid rgba(212,193,157,0.2)"
            }}>
              {stats.map((stat, i) => {
                const Icon = iconMap[stat.icon] || Sparkles;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "rgba(212,193,157,0.9)" }}>
                    <Icon size={20} style={{ color: "var(--gold)" }} />
                    <span style={{ fontSize: "0.95rem" }}>{stat.num} {stat.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════ PROJECTS SECTION (live preview) ═══════════════════ */}
      <section style={{
        padding: "5rem 2rem", position: "relative",
        background: "radial-gradient(ellipse at center top, rgba(212,193,157,0.15) 0%, transparent 60%), radial-gradient(ellipse at center bottom, rgba(232,217,192,0.12) 0%, transparent 60%), #000",
      }}>
        <SectionEditButton onClick={() => setEditingSection(true)} label={isAr ? "تعديل القسم" : "Edit Section"} />

        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              background: "rgba(212,193,157,0.1)", border: "1px solid rgba(212,193,157,0.2)",
              padding: "0.5rem 1.5rem", borderRadius: "50px", marginBottom: "1.5rem"
            }}>
              <Sparkles size={18} style={{ color: "var(--gold)" }} />
              <span style={{ color: "var(--gold)", fontSize: "0.9rem" }}>
                {localizedSectionTitle || (isAr ? "مشاريعنا الترفيهية" : "Our Entertainment Projects")}
              </span>
            </div>
            <h2 style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 700, color: "var(--gold)", marginBottom: "1rem",
              textShadow: "0 2px 20px rgba(212,193,157,0.3)"
            }}>
              {localizedSectionTitle || (isAr ? "تجارب ترفيهية لا تُنسى" : "Unforgettable Entertainment Experiences")}
            </h2>
            <p style={{ fontSize: "1.1rem", color: "rgba(212,193,157,0.7)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>
              {localizedSectionSubtitle || (isAr ? "اكتشف مجموعة مشاريعنا الترفيهية المتنوعة" : "Explore our diverse entertainment projects")}
            </p>
          </div>

          {/* Projects Grid */}
          <div className="entertainment-grid">
            {projects.map((project) => {
              const title = isAr ? project.title : (project.titleEn || project.title);
              const desc = isAr ? project.description : (project.descriptionEn || project.description);
              const cat = isAr ? (project.category || "") : (project.categoryEn || project.category || "");
              const loc = isAr ? (project.location || "") : (project.locationEn || project.location || "");
              const st = isAr ? (project.status || "") : (project.statusEn || project.status || "");

              return (
                <div key={project.id} className="entertainment-card" style={{ position: "relative" }}>
                  {/* Admin controls overlay */}
                  <div style={{
                    position: "absolute", top: "0.75rem", right: "0.75rem", zIndex: 5,
                    display: "flex", gap: "0.4rem",
                  }}>
                    {!project.isPublished && (
                      <span style={{
                        padding: "0.3rem 0.6rem", background: "rgba(244,67,54,0.9)", color: "#fff",
                        borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem"
                      }}>
                        <EyeOff size={12} /> {isAr ? "مخفي" : "Hidden"}
                      </span>
                    )}
                    <button onClick={() => setProjectModal({ mode: "edit", data: { ...project } })} style={{
                      width: "32px", height: "32px", background: "rgba(212,193,157,0.9)", color: "#000",
                      border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}><Edit2 size={14} /></button>
                    <button onClick={() => deleteProject(project.id)} style={{
                      width: "32px", height: "32px", background: "rgba(244,67,54,0.9)", color: "#fff",
                      border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}><Trash2 size={14} /></button>
                  </div>

                  {/* Card Image */}
                  <div className="entertainment-card-image">
                    <Image src={project.image || "https://via.placeholder.com/600x400"} alt={title} fill style={{ objectFit: "cover" }} unoptimized />
                    <div className="entertainment-card-overlay" />
                    {st && <div className="entertainment-card-status">{st}</div>}
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: "1.5rem 2rem 1rem" }}>
                    {cat && (
                      <div style={{
                        fontSize: "0.75rem", color: "var(--gold)", fontWeight: 700, marginBottom: "0.75rem",
                        textTransform: "uppercase", letterSpacing: "2px"
                      }}>{cat}</div>
                    )}
                    <h3 style={{ fontSize: "clamp(1.3rem, 3vw, 1.7rem)", fontWeight: 700, color: "var(--gold)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                      {title || (isAr ? "(بدون عنوان)" : "(Untitled)")}
                    </h3>
                    <p style={{
                      fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(212,193,157,0.75)", marginBottom: "1rem",
                      display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                    }}>{desc}</p>
                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "rgba(212,193,157,0.7)", marginBottom: "1.25rem" }}>
                      {loc && <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><MapPin size={14} style={{ color: "var(--gold)" }} />{loc}</div>}
                      {project.year && <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Calendar size={14} style={{ color: "var(--gold)" }} />{project.year}</div>}
                    </div>
                  </div>

                  {/* Mini Gallery */}
                  {project.gallery.length > 0 && (
                    <div style={{ padding: "0 2rem 1.25rem" }}>
                      <div className="entertainment-mini-gallery">
                        {project.gallery.slice(0, 4).map((img, imgIndex) => (
                          <div key={imgIndex} className="entertainment-mini-thumb">
                            <Image src={img.image} alt={isAr ? img.caption : (img.captionEn || img.caption)} fill style={{ objectFit: "cover" }} unoptimized />
                            {imgIndex === 3 && project.gallery.length > 4 && (
                              <div style={{
                                position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
                                display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: "0.9rem", fontWeight: 700
                              }}>
                                +{project.gallery.length - 4}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Order badge */}
                  <div style={{
                    position: "absolute", bottom: "0.75rem", left: "0.75rem", zIndex: 5,
                    padding: "0.2rem 0.6rem", background: "rgba(212,193,157,0.15)", border: "1px solid rgba(212,193,157,0.2)",
                    borderRadius: "6px", fontSize: "0.7rem", color: "rgba(212,193,157,0.6)"
                  }}>
                    #{project.order}
                  </div>
                </div>
              );
            })}

            {/* Bom Bom Play Kid Card */}
            <div className="entertainment-card" style={{
              position: "relative",
              opacity: content.showBombom ? 1 : 0.5,
              transition: "opacity 0.3s",
            }}>
              {/* Admin controls */}
              <div style={{
                position: "absolute", top: "0.75rem", right: "0.75rem", zIndex: 5,
                display: "flex", gap: "0.4rem",
              }}>
                {!content.showBombom && (
                  <span style={{
                    padding: "0.3rem 0.6rem", background: "rgba(244,67,54,0.9)", color: "#fff",
                    borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem"
                  }}>
                    <EyeOff size={12} /> {isAr ? "مخفي" : "Hidden"}
                  </span>
                )}
                <button onClick={async () => {
                  const next = !content.showBombom;
                  setContent({ ...content, showBombom: next });
                  setSaving(true);
                  try {
                    await fetch("/api/entertainment-content", {
                      method: "PUT", headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...content, showBombom: next }),
                    });
                    setSaved(true); setTimeout(() => setSaved(false), 3000);
                  } catch { /* noop */ }
                  finally { setSaving(false); }
                }} title={content.showBombom ? (isAr ? "إخفاء" : "Hide") : (isAr ? "إظهار" : "Show")} style={{
                  width: "32px", height: "32px",
                  background: content.showBombom ? "rgba(76,175,80,0.9)" : "rgba(244,67,54,0.9)",
                  color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {content.showBombom ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>

              {/* Card Image */}
              <div className="entertainment-card-image" style={{
                background: "linear-gradient(135deg, #00BFFF 0%, #FF1493 50%, #FFD700 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ textAlign: "center", zIndex: 2, position: "relative" }}>
                  <span style={{ fontSize: "3rem", display: "block", lineHeight: 1 }}>🎈</span>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem", display: "block", marginTop: "0.5rem", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Bom Bom</span>
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: "1.5rem 2rem 1rem" }}>
                <div style={{
                  fontSize: "0.75rem", color: "var(--gold)", fontWeight: 700, marginBottom: "0.75rem",
                  textTransform: "uppercase", letterSpacing: "2px"
                }}>
                  {isAr ? "صفحة ثابتة" : "STATIC PAGE"}
                </div>
                <h3 style={{ fontSize: "clamp(1.3rem, 3vw, 1.7rem)", fontWeight: 700, color: "var(--gold)", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                  {isAr ? "بوم بوم بلاي كيد" : "Bom Bom Play Kid"}
                </h3>
                <p style={{
                  fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(212,193,157,0.75)", marginBottom: "1rem",
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                  {isAr
                    ? "عالم من المرح والمغامرة للأطفال! مناطق لعب متنوعة، قلاع قفز، تزحلق، وركن الأذكياء."
                    : "A world of fun and adventure for kids! Play zones, jump castles, skating, and smart corners."}
                </p>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "rgba(212,193,157,0.7)", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <MapPin size={14} style={{ color: "var(--gold)" }} />
                    {isAr ? "المملكة العربية السعودية" : "Saudi Arabia"}
                  </div>
                </div>
              </div>

              {/* Static page badge */}
              <div style={{
                position: "absolute", bottom: "0.75rem", left: "0.75rem", zIndex: 5,
                padding: "0.2rem 0.6rem", background: "rgba(0,191,255,0.15)", border: "1px solid rgba(0,191,255,0.3)",
                borderRadius: "6px", fontSize: "0.7rem", color: "#00BFFF", fontWeight: 600
              }}>
                {isAr ? "صفحة ثابتة" : "Static"}
              </div>
            </div>

            {/* Add Project Card */}
            <div
              onClick={() => setProjectModal({ mode: "create", data: { ...emptyProject, order: projects.length } })}
              style={{
                borderRadius: "16px", border: "2px dashed rgba(212,193,157,0.25)", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                minHeight: "400px", background: "rgba(212,193,157,0.03)", transition: "all 0.3s",
              }}
              className="entertainment-card"
            >
              <Plus size={48} style={{ color: "rgba(212,193,157,0.4)", marginBottom: "1rem" }} />
              <span style={{ color: "rgba(212,193,157,0.5)", fontSize: "1.1rem", fontWeight: 600 }}>
                {isAr ? "إضافة مشروع جديد" : "Add New Project"}
              </span>
            </div>
          </div>

          {projects.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem", color: "rgba(212,193,157,0.5)" }}>
              {isAr ? "لا توجد مشاريع ترفيهية. أضف مشروعاً جديداً!" : "No entertainment projects. Add a new project!"}
            </div>
          )}
        </div>
      </section>

      {/* Bottom spacer for floating bar */}
      <div style={{ height: "5rem" }} />

      {/* ═══════════════════ HERO EDIT MODAL ═══════════════════ */}
      <Modal open={editingHero} onClose={() => setEditingHero(false)} title={isAr ? "تعديل قسم الهيرو" : "Edit Hero Section"} wide>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div><label style={labelStyle}>{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</label>
            <input type="text" value={content.heroTitle} onChange={e => setContent({ ...content, heroTitle: e.target.value })} style={inputStyle} /></div>
          <div><label style={labelStyle}>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
            <input type="text" value={content.heroTitleEn} onChange={e => setContent({ ...content, heroTitleEn: e.target.value })} style={inputStyle} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div><label style={labelStyle}>{isAr ? "الوصف (عربي)" : "Subtitle (Arabic)"}</label>
            <textarea value={content.heroSubtitle} onChange={e => setContent({ ...content, heroSubtitle: e.target.value })} rows={3} style={inputStyle} /></div>
          <div><label style={labelStyle}>{isAr ? "الوصف (إنجليزي)" : "Subtitle (English)"}</label>
            <textarea value={content.heroSubtitleEn} onChange={e => setContent({ ...content, heroSubtitleEn: e.target.value })} rows={3} style={inputStyle} /></div>
        </div>

        {/* Hero Images */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>{isAr ? "صور الهيرو (سلايدر)" : "Hero Images (Slider)"}</label>
          <p style={{ fontSize: "0.8rem", color: "rgba(212,193,157,0.5)", marginBottom: "0.75rem" }}>
            {isAr ? "أضف صوراً لعرضها كسلايدر متحرك" : "Add images for an animated slider"}
          </p>
          {content.heroImages.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.75rem" }}>
              {content.heroImages.map((img, idx) => (
                <div key={idx} style={{ position: "relative", width: 160, height: 100, borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(212,193,157,0.2)" }}>
                  <Image src={img} alt="" width={160} height={100} style={{ objectFit: "cover", width: "100%", height: "100%" }} unoptimized />
                  <button onClick={() => setContent({ ...content, heroImages: content.heroImages.filter((_, i) => i !== idx) })} style={{
                    position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px",
                    background: "rgba(244,67,54,0.9)", color: "#fff", border: "none", borderRadius: "4px",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem",
                  }}>✕</button>
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)",
                    color: "#fff", fontSize: "0.65rem", textAlign: "center", padding: "0.15rem"
                  }}>{idx + 1}</div>
                </div>
              ))}
            </div>
          )}
          <EditableImage src="" alt="Add" onChange={p => setContent({ ...content, heroImages: [...content.heroImages, p] })} width={160} height={100} />
        </div>

        {/* Stats */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          <input type="checkbox" checked={content.showStats} onChange={e => setContent({ ...content, showStats: e.target.checked })}
            style={{ accentColor: "var(--gold)" }} />
          <label style={{ fontWeight: 600, color: "rgba(212,193,157,0.8)" }}>{isAr ? "إظهار الإحصائيات" : "Show Statistics"}</label>
        </div>

        {content.showStats && [1, 2, 3].map(n => {
          const ik = `stat${n}Icon` as keyof ContentState;
          const nk = `stat${n}Number` as keyof ContentState;
          const lk = `stat${n}Label` as keyof ContentState;
          const lek = `stat${n}LabelEn` as keyof ContentState;
          return (
            <div key={n} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem",
              padding: "0.75rem", background: "rgba(212,193,157,0.05)", borderRadius: "8px", border: "1px solid rgba(212,193,157,0.1)"
            }}>
              <div><label style={{ ...labelStyle, fontSize: "0.75rem" }}>{isAr ? "أيقونة" : "Icon"}</label>
                <select value={content[ik] as string} onChange={e => setContent({ ...content, [ik]: e.target.value })} style={selectStyle}>
                  {iconOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select></div>
              <div><label style={{ ...labelStyle, fontSize: "0.75rem" }}>{isAr ? "الرقم" : "Number"}</label>
                <input type="text" value={content[nk] as string} onChange={e => setContent({ ...content, [nk]: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ ...labelStyle, fontSize: "0.75rem" }}>{isAr ? "التسمية (ع)" : "Label (Ar)"}</label>
                <input type="text" value={content[lk] as string} onChange={e => setContent({ ...content, [lk]: e.target.value })} style={inputStyle} /></div>
              <div><label style={{ ...labelStyle, fontSize: "0.75rem" }}>{isAr ? "التسمية (En)" : "Label (En)"}</label>
                <input type="text" value={content[lek] as string} onChange={e => setContent({ ...content, [lek]: e.target.value })} style={inputStyle} /></div>
            </div>
          );
        })}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
          <button onClick={saveContent} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.75rem 2rem", background: saving ? "rgba(212,193,157,0.3)" : "var(--gold)",
            color: "#000", border: "none", borderRadius: "10px", cursor: saving ? "not-allowed" : "pointer",
            fontSize: "0.95rem", fontWeight: 700,
          }}><Save size={16} /> {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}</button>
        </div>
      </Modal>

      {/* ═══════════════════ SECTION EDIT MODAL ═══════════════════ */}
      <Modal open={editingSection} onClose={() => setEditingSection(false)} title={isAr ? "تعديل قسم المشاريع" : "Edit Projects Section"}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div><label style={labelStyle}>{isAr ? "عنوان القسم (عربي)" : "Section Title (Arabic)"}</label>
            <input type="text" value={content.sectionTitle} onChange={e => setContent({ ...content, sectionTitle: e.target.value })} style={inputStyle} /></div>
          <div><label style={labelStyle}>{isAr ? "عنوان القسم (إنجليزي)" : "Section Title (English)"}</label>
            <input type="text" value={content.sectionTitleEn} onChange={e => setContent({ ...content, sectionTitleEn: e.target.value })} style={inputStyle} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div><label style={labelStyle}>{isAr ? "وصف القسم (عربي)" : "Section Subtitle (Arabic)"}</label>
            <input type="text" value={content.sectionSubtitle} onChange={e => setContent({ ...content, sectionSubtitle: e.target.value })} style={inputStyle} /></div>
          <div><label style={labelStyle}>{isAr ? "وصف القسم (إنجليزي)" : "Section Subtitle (English)"}</label>
            <input type="text" value={content.sectionSubtitleEn} onChange={e => setContent({ ...content, sectionSubtitleEn: e.target.value })} style={inputStyle} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div><label style={labelStyle}>{isAr ? "رسالة الحالة الفارغة (عربي)" : "Empty Message (Arabic)"}</label>
            <input type="text" value={content.emptyMessage} onChange={e => setContent({ ...content, emptyMessage: e.target.value })} style={inputStyle} /></div>
          <div><label style={labelStyle}>{isAr ? "رسالة الحالة الفارغة (إنجليزي)" : "Empty Message (English)"}</label>
            <input type="text" value={content.emptyMessageEn} onChange={e => setContent({ ...content, emptyMessageEn: e.target.value })} style={inputStyle} /></div>
        </div>

        {/* Bombom Static Page Toggle */}
        <div style={{
          marginBottom: "1.5rem", padding: "1rem 1.25rem",
          background: content.showBombom ? "rgba(76,175,80,0.08)" : "rgba(244,67,54,0.08)",
          border: `1px solid ${content.showBombom ? "rgba(76,175,80,0.3)" : "rgba(244,67,54,0.3)"}`,
          borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {content.showBombom
              ? <Eye size={20} style={{ color: "rgba(76,175,80,0.9)" }} />
              : <EyeOff size={20} style={{ color: "rgba(244,67,54,0.9)" }} />}
            <div>
              <div style={{ fontWeight: 700, color: "var(--gold)", fontSize: "0.95rem" }}>
                {isAr ? "صفحة بوم بوم بلاي كيد" : "Bom Bom Play Kid Page"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(212,193,157,0.6)" }}>
                {isAr ? "إظهار كارت بوم بوم ضمن مشاريع الترفيه" : "Show Bom Bom card in entertainment projects"}
              </div>
            </div>
          </div>
          <button onClick={() => setContent({ ...content, showBombom: !content.showBombom })} style={{
            padding: "0.5rem 1.25rem",
            background: content.showBombom ? "rgba(244,67,54,0.9)" : "rgba(76,175,80,0.9)",
            color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer",
            fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit",
          }}>
            {content.showBombom
              ? (isAr ? "إخفاء" : "Hide")
              : (isAr ? "إظهار" : "Show")}
          </button>
        </div>

        {/* Under Construction Toggle */}
        <div style={{
          marginBottom: "1.5rem", padding: "1rem 1.25rem",
          background: content.isUnderConstruction ? "rgba(244,143,33,0.08)" : "rgba(76,175,80,0.08)",
          border: `1px solid ${content.isUnderConstruction ? "rgba(244,143,33,0.3)" : "rgba(76,175,80,0.3)"}`,
          borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {content.isUnderConstruction
              ? <EyeOff size={20} style={{ color: "rgba(244,143,33,0.9)" }} />
              : <Eye size={20} style={{ color: "rgba(76,175,80,0.9)" }} />}
            <div>
              <div style={{ fontWeight: 700, color: "var(--gold)", fontSize: "0.95rem" }}>
                {isAr ? "تحت الإنشاء" : "Under Construction"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(212,193,157,0.6)" }}>
                {isAr ? "إظهار صفحة 'قريباً' بدلاً من المشاريع" : "Show 'Coming Soon' page instead of projects"}
              </div>
            </div>
          </div>
          <button onClick={() => setContent({ ...content, isUnderConstruction: !content.isUnderConstruction })} style={{
            padding: "0.5rem 1.25rem",
            background: content.isUnderConstruction ? "rgba(76,175,80,0.9)" : "rgba(244,143,33,0.9)",
            color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer",
            fontWeight: 700, fontSize: "0.85rem", fontFamily: "inherit",
          }}>
            {content.isUnderConstruction
              ? (isAr ? "نشر الصفحة" : "Publish Page")
              : (isAr ? "إيقاف (قريباً)" : "Suspend (Soon)")}
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={saveContent} disabled={saving} style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.75rem 2rem", background: saving ? "rgba(212,193,157,0.3)" : "var(--gold)",
            color: "#000", border: "none", borderRadius: "10px", cursor: saving ? "not-allowed" : "pointer",
            fontSize: "0.95rem", fontWeight: 700,
          }}><Save size={16} /> {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}</button>
        </div>
      </Modal>

      {/* ═══════════════════ PROJECT EDIT/CREATE MODAL ═══════════════════ */}
      <ProjectModal
        open={!!projectModal}
        mode={projectModal?.mode || "create"}
        data={projectModal?.data || { ...emptyProject }}
        onClose={() => setProjectModal(null)}
        onSave={saveProject}
        saving={saving}
        isAr={isAr}
      />
    </div>
  );
}

function ProjectModal({ open, mode, data, onClose, onSave, saving, isAr }: {
  open: boolean; mode: "create" | "edit"; data: any; onClose: () => void;
  onSave: (p: any) => void; saving: boolean; isAr: boolean;
}) {
  const [form, setForm] = useState(data);
  useEffect(() => { if (open) setForm(data); }, [open, data]);

  if (!open) return null;

  const gallery: GalleryItem[] = form.gallery || [];
  const setGallery = (g: GalleryItem[]) => setForm({ ...form, gallery: g });

  return (
    <Modal open={open} onClose={onClose} wide
      title={mode === "edit" ? (isAr ? "تعديل المشروع" : "Edit Project") : (isAr ? "مشروع جديد" : "New Project")}>
      {/* Titles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div><label style={labelStyle}>{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</label>
          <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
          <input type="text" value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} style={inputStyle} /></div>
      </div>

      {/* Short Desc */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div><label style={labelStyle}>{isAr ? "الوصف المختصر (عربي)" : "Short Description (Arabic)"}</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} style={inputStyle} /></div>
        <div><label style={labelStyle}>{isAr ? "الوصف المختصر (إنجليزي)" : "Short Description (English)"}</label>
          <textarea value={form.descriptionEn} onChange={e => setForm({ ...form, descriptionEn: e.target.value })} rows={3} style={inputStyle} /></div>
      </div>

      {/* Full Desc */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div><label style={labelStyle}>{isAr ? "الوصف التفصيلي (عربي)" : "Full Description (Arabic)"}</label>
          <textarea value={form.fullDescription} onChange={e => setForm({ ...form, fullDescription: e.target.value })} rows={5} style={inputStyle} /></div>
        <div><label style={labelStyle}>{isAr ? "الوصف التفصيلي (إنجليزي)" : "Full Description (English)"}</label>
          <textarea value={form.fullDescriptionEn} onChange={e => setForm({ ...form, fullDescriptionEn: e.target.value })} rows={5} style={inputStyle} /></div>
      </div>

      {/* Cover Image */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle}>{isAr ? "صورة الغلاف" : "Cover Image"}</label>
        <EditableImage src={form.image || ""} alt="Cover" onChange={p => setForm({ ...form, image: p })} width={350} height={220} />
      </div>

      {/* Gallery */}
      <div style={{ marginBottom: "1.25rem" }}>
        <label style={labelStyle}>{isAr ? "معرض الصور" : "Photo Gallery"}</label>
        {gallery.map((item, index) => (
          <div key={index} style={{
            display: "flex", gap: "0.75rem", marginBottom: "0.75rem", padding: "0.75rem",
            background: "rgba(212,193,157,0.05)", borderRadius: "8px", border: "1px solid rgba(212,193,157,0.1)", alignItems: "flex-start"
          }}>
            <EditableImage src={item.image} alt="" onChange={p => {
              const g = [...gallery]; g[index] = { ...g[index], image: p }; setGallery(g);
            }} width={120} height={90} />
            <div style={{ flex: 1 }}>
              <input type="text" placeholder={isAr ? "توصيف (عربي)" : "Caption (Arabic)"} value={item.caption}
                onChange={e => { const g = [...gallery]; g[index] = { ...g[index], caption: e.target.value }; setGallery(g); }}
                style={{ ...inputStyle, marginBottom: "0.5rem", padding: "0.5rem" }} />
              <input type="text" placeholder={isAr ? "توصيف (إنجليزي)" : "Caption (English)"} value={item.captionEn}
                onChange={e => { const g = [...gallery]; g[index] = { ...g[index], captionEn: e.target.value }; setGallery(g); }}
                style={{ ...inputStyle, padding: "0.5rem" }} />
            </div>
            <button onClick={() => setGallery(gallery.filter((_, i) => i !== index))} style={{
              width: "28px", height: "28px", background: "rgba(244,67,54,0.8)", color: "#fff",
              border: "none", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}><X size={14} /></button>
          </div>
        ))}
        <EditableImage src="" alt="Add gallery" onChange={p => setGallery([...gallery, { image: p, caption: "", captionEn: "" }])} width={120} height={90} />
      </div>

      {/* Category, Location, Year */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div><label style={labelStyle}>{isAr ? "الفئة (عربي)" : "Category (Arabic)"}</label>
          <input type="text" value={form.category || ""} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>{isAr ? "الفئة (إنجليزي)" : "Category (English)"}</label>
          <input type="text" value={form.categoryEn || ""} onChange={e => setForm({ ...form, categoryEn: e.target.value })} style={inputStyle} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div><label style={labelStyle}>{isAr ? "الموقع (عربي)" : "Location (Arabic)"}</label>
          <input type="text" value={form.location || ""} onChange={e => setForm({ ...form, location: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>{isAr ? "الموقع (إنجليزي)" : "Location (English)"}</label>
          <input type="text" value={form.locationEn || ""} onChange={e => setForm({ ...form, locationEn: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>{isAr ? "السنة" : "Year"}</label>
          <input type="text" value={form.year || ""} onChange={e => setForm({ ...form, year: e.target.value })} style={inputStyle} /></div>
      </div>

      {/* Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div><label style={labelStyle}>{isAr ? "الحالة (عربي)" : "Status (Arabic)"}</label>
          <input type="text" value={form.status || ""} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle} /></div>
        <div><label style={labelStyle}>{isAr ? "الحالة (إنجليزي)" : "Status (English)"}</label>
          <input type="text" value={form.statusEn || ""} onChange={e => setForm({ ...form, statusEn: e.target.value })} style={inputStyle} /></div>
      </div>

      {/* Details button text */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <label style={labelStyle}>{isAr ? "نص زر التفاصيل (عربي)" : "Details Button (Arabic)"}</label>
          <input
            type="text"
            value={form.ctaLabel || ""}
            onChange={e => setForm({ ...form, ctaLabel: e.target.value })}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>{isAr ? "نص زر التفاصيل (إنجليزي)" : "Details Button (English)"}</label>
          <input
            type="text"
            value={form.ctaLabelEn || ""}
            onChange={e => setForm({ ...form, ctaLabelEn: e.target.value })}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Order & Published */}
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <label style={labelStyle}>{isAr ? "الترتيب" : "Order"}</label>
          <input type="number" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            style={{ ...inputStyle, width: "100px" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "1.25rem" }}>
          <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })}
            style={{ accentColor: "var(--gold)" }} />
          <label style={{ fontWeight: 600, color: "rgba(212,193,157,0.8)" }}>{isAr ? "منشور" : "Published"}</label>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
        <button onClick={onClose} style={{
          padding: "0.75rem 1.5rem", background: "rgba(212,193,157,0.1)", color: "rgba(212,193,157,0.7)",
          border: "1px solid rgba(212,193,157,0.2)", borderRadius: "10px", cursor: "pointer", fontSize: "0.95rem",
        }}>{isAr ? "إلغاء" : "Cancel"}</button>
        <button onClick={() => onSave(form)} disabled={saving} style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.75rem 2rem", background: saving ? "rgba(212,193,157,0.3)" : "var(--gold)",
          color: "#000", border: "none", borderRadius: "10px", cursor: saving ? "not-allowed" : "pointer",
          fontSize: "0.95rem", fontWeight: 700,
        }}><Save size={16} /> {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}</button>
      </div>
    </Modal>
  );
}
