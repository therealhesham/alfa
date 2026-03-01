"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Plus, X, Trash2, Edit2, Save, ImagePlus } from "lucide-react";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

interface GalleryItem {
  image: string;
  caption: string;
  captionEn: string;
}

interface EntProject {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  fullDescription: string;
  fullDescriptionEn: string;
  image: string;
  gallery: GalleryItem[];
  category: string | null;
  categoryEn: string | null;
  location: string | null;
  locationEn: string | null;
  year: string | null;
  status: string | null;
  statusEn: string | null;
  order: number;
  isPublished: boolean;
}

let currentLocale: Locale = "ar";

function EditableImage({
  src,
  alt,
  onChange,
  width = 300,
  height = 200,
  onRemove,
  showRemove = false,
}: {
  src: string;
  alt: string;
  onChange: (newPath: string) => void;
  width?: number;
  height?: number;
  onRemove?: () => void;
  showRemove?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert(currentLocale === "ar" ? "الرجاء اختيار ملف صورة" : "Please select an image file");
      return;
    }
    setIsUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload-image", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) onChange(data.path || data.url);
      else alert(currentLocale === "ar" ? "فشل رفع الصورة" : "Failed to upload image");
    } catch {
      alert(currentLocale === "ar" ? "حدث خطأ أثناء رفع الصورة" : "Error uploading image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      style={{ position: "relative", cursor: "pointer", width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleImageClick}
    >
      {isUploading ? (
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
          background: "#f0f0f0", border: "2px dashed #ccc", borderRadius: "8px",
        }}>
          {currentLocale === "ar" ? "جاري الرفع..." : "Uploading..."}
        </div>
      ) : (
        <Image
          src={src || "https://via.placeholder.com/300x200"}
          alt={alt}
          width={width}
          height={height}
          style={{
            objectFit: "cover", borderRadius: "8px",
            border: isHovered ? "3px solid #0070f3" : "3px solid transparent",
            transition: "all 0.3s", opacity: isHovered ? 0.8 : 1,
            width: "100%", height: "100%",
          }}
          unoptimized
        />
      )}
      {!isUploading && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: isHovered ? "rgba(0, 112, 243, 0.95)" : "rgba(0, 0, 0, 0.65)",
          color: "white", padding: "0.5rem 0.75rem", borderRadius: "0 0 8px 8px",
          fontSize: "0.85rem", pointerEvents: "none", textAlign: "center", transition: "background 0.2s ease",
        }}>
          {currentLocale === "ar" ? "انقر لتغيير الصورة" : "Click to change image"}
        </div>
      )}
      {showRemove && onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          style={{
            position: "absolute", top: "10px", right: "10px",
            background: "rgba(255, 0, 0, 0.8)", color: "white", border: "none",
            borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
    </div>
  );
}

const emptyForm = {
  title: "", titleEn: "", description: "", descriptionEn: "",
  fullDescription: "", fullDescriptionEn: "",
  image: "", gallery: [] as GalleryItem[],
  category: "", categoryEn: "", location: "", locationEn: "",
  year: "", status: "", statusEn: "", order: 0, isPublished: true,
};

export default function AdminEntertainmentPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocaleState, setCurrentLocale] = useState<Locale>(locale);
  currentLocale = currentLocaleState;
  const [projects, setProjects] = useState<EntProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<EntProject | null>(null);
  const [formData, setFormData] = useState({ ...emptyForm });

  useEffect(() => { fetchProjects(); }, [currentLocaleState]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/entertainment?all=true&locale=${currentLocaleState}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching entertainment projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (project: EntProject) => {
    setSaving(true);
    try {
      const res = await fetch("/api/entertainment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchProjects();
        setEditingProject(null);
      }
    } catch {
      alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/entertainment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchProjects();
        setShowForm(false);
        setFormData({ ...emptyForm, order: projects.length });
      }
    } catch {
      alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الإنشاء" : "Error creating project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(currentLocaleState === "ar" ? "هل أنت متأكد من حذف هذا المشروع الترفيهي؟" : "Are you sure you want to delete this entertainment project?")) return;
    try {
      const res = await fetch(`/api/entertainment?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch {
      alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting project");
    }
  };

  const getVal = (field: keyof EntProject) => {
    if (editingProject) return editingProject[field];
    return (formData as any)[field];
  };

  const setVal = (field: string, value: any) => {
    if (editingProject) setEditingProject({ ...editingProject, [field]: value });
    else setFormData({ ...formData, [field]: value });
  };

  const getGallery = (): GalleryItem[] => {
    return editingProject ? editingProject.gallery : formData.gallery;
  };

  const setGallery = (gallery: GalleryItem[]) => {
    if (editingProject) setEditingProject({ ...editingProject, gallery });
    else setFormData({ ...formData, gallery });
  };

  const addGalleryItem = (imageUrl: string) => {
    const gallery = getGallery();
    setGallery([...gallery, { image: imageUrl, caption: "", captionEn: "" }]);
  };

  const updateGalleryCaption = (index: number, field: "caption" | "captionEn", value: string) => {
    const gallery = [...getGallery()];
    gallery[index] = { ...gallery[index], [field]: value };
    setGallery(gallery);
  };

  const updateGalleryImage = (index: number, imageUrl: string) => {
    const gallery = [...getGallery()];
    gallery[index] = { ...gallery[index], image: imageUrl };
    setGallery(gallery);
  };

  const removeGalleryItem = (index: number) => {
    setGallery(getGallery().filter((_, i) => i !== index));
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
  const labelStyle = { display: "block" as const, marginBottom: "0.5rem", fontWeight: "bold" as const };
  const isAr = currentLocaleState === "ar";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <AdminNav locale={currentLocaleState} />
      <div style={{ position: "fixed", top: "5rem", right: "1rem", zIndex: 9999 }}>
        <LogoutButton />
      </div>

      <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {isAr ? "إدارة المشاريع الترفيهية" : "Manage Entertainment Projects"}
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button onClick={() => setCurrentLocale("ar")} style={{
              padding: "0.5rem 1rem", background: currentLocaleState === "ar" ? "#0070f3" : "#e0e0e0",
              color: currentLocaleState === "ar" ? "white" : "black", border: "none", borderRadius: "4px", cursor: "pointer",
            }}>العربية</button>
            <button onClick={() => setCurrentLocale("en")} style={{
              padding: "0.5rem 1rem", background: currentLocaleState === "en" ? "#0070f3" : "#e0e0e0",
              color: currentLocaleState === "en" ? "white" : "black", border: "none", borderRadius: "4px", cursor: "pointer",
            }}>English</button>
            <button onClick={() => { setShowForm(true); setEditingProject(null); }} style={{
              padding: "0.75rem 1.5rem", background: "#4caf50", color: "white", border: "none",
              borderRadius: "4px", cursor: "pointer", fontSize: "1rem", fontWeight: "bold",
              display: "flex", alignItems: "center", gap: "0.5rem",
            }}>
              <Plus size={20} />
              {isAr ? "إضافة مشروع ترفيهي" : "Add Entertainment Project"}
            </button>
          </div>
        </div>

        {saved && (
          <div style={{ padding: "1rem", background: "#4caf50", color: "white", borderRadius: "4px", marginBottom: "1rem", textAlign: "center" }}>
            {isAr ? "تم الحفظ بنجاح!" : "Saved successfully!"}
          </div>
        )}

        {/* Add/Edit Form */}
        {(showForm || editingProject) && (
          <div style={{ background: "white", padding: "2rem", borderRadius: "8px", marginBottom: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {editingProject ? (isAr ? "تعديل المشروع الترفيهي" : "Edit Entertainment Project") : (isAr ? "إضافة مشروع ترفيهي جديد" : "Add New Entertainment Project")}
              </h2>
              <button onClick={() => { setShowForm(false); setEditingProject(null); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "1.5rem" }}>
                <X />
              </button>
            </div>

            {/* Title */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>{isAr ? "العنوان (عربي)" : "Title (Arabic)"}</label>
                <input type="text" value={getVal("title") as string} onChange={(e) => setVal("title", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{isAr ? "العنوان (إنجليزي)" : "Title (English)"}</label>
                <input type="text" value={getVal("titleEn") as string} onChange={(e) => setVal("titleEn", e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Short Description */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>{isAr ? "الوصف المختصر (عربي)" : "Short Description (Arabic)"}</label>
                <textarea value={getVal("description") as string} onChange={(e) => setVal("description", e.target.value)} rows={3} style={{ ...inputStyle, fontFamily: "inherit" }} />
              </div>
              <div>
                <label style={labelStyle}>{isAr ? "الوصف المختصر (إنجليزي)" : "Short Description (English)"}</label>
                <textarea value={getVal("descriptionEn") as string} onChange={(e) => setVal("descriptionEn", e.target.value)} rows={3} style={{ ...inputStyle, fontFamily: "inherit" }} />
              </div>
            </div>

            {/* Full Description */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>{isAr ? "الوصف التفصيلي (عربي)" : "Full Description (Arabic)"}</label>
              <textarea value={getVal("fullDescription") as string} onChange={(e) => setVal("fullDescription", e.target.value)} rows={5} style={{ ...inputStyle, fontFamily: "inherit" }} />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>{isAr ? "الوصف التفصيلي (إنجليزي)" : "Full Description (English)"}</label>
              <textarea value={getVal("fullDescriptionEn") as string} onChange={(e) => setVal("fullDescriptionEn", e.target.value)} rows={5} style={{ ...inputStyle, fontFamily: "inherit" }} />
            </div>

            {/* Cover Image */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>{isAr ? "صورة الغلاف" : "Cover Image"}</label>
              <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "0.5rem" }}>
                {isAr ? "انقر على الصورة لاختيار صورة جديدة من جهازك (JPG, PNG)" : "Click on the image to choose a new image from your device (JPG, PNG)"}
              </p>
              <EditableImage
                src={(getVal("image") as string) || ""}
                alt="Cover"
                onChange={(newPath) => setVal("image", newPath)}
                width={400}
                height={300}
              />
            </div>

            {/* Gallery with Captions */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>{isAr ? "معرض الصور (مع التوصيف)" : "Photo Gallery (with captions)"}</label>
              <p style={{ fontSize: "0.875rem", color: "#666", marginBottom: "1rem" }}>
                {isAr ? "أضف صوراً مع توصيف لكل صورة بالعربية والإنجليزية" : "Add images with captions in Arabic and English for each"}
              </p>

              {getGallery().map((item, index) => (
                <div key={index} style={{
                  display: "flex", gap: "1rem", marginBottom: "1rem", padding: "1rem",
                  background: "#f9f9f9", borderRadius: "8px", border: "1px solid #eee", alignItems: "flex-start",
                }}>
                  <EditableImage
                    src={item.image}
                    alt={`Gallery ${index + 1}`}
                    onChange={(newPath) => updateGalleryImage(index, newPath)}
                    width={150}
                    height={120}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold", display: "block", marginBottom: "0.25rem" }}>
                        {isAr ? "التوصيف (عربي)" : "Caption (Arabic)"}
                      </label>
                      <input
                        type="text"
                        value={item.caption}
                        onChange={(e) => updateGalleryCaption(index, "caption", e.target.value)}
                        style={{ ...inputStyle, padding: "0.5rem" }}
                        placeholder={isAr ? "وصف الصورة بالعربية..." : "Image caption in Arabic..."}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.85rem", fontWeight: "bold", display: "block", marginBottom: "0.25rem" }}>
                        {isAr ? "التوصيف (إنجليزي)" : "Caption (English)"}
                      </label>
                      <input
                        type="text"
                        value={item.captionEn}
                        onChange={(e) => updateGalleryCaption(index, "captionEn", e.target.value)}
                        style={{ ...inputStyle, padding: "0.5rem" }}
                        placeholder={isAr ? "وصف الصورة بالإنجليزية..." : "Image caption in English..."}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeGalleryItem(index)}
                    style={{
                      background: "#f44336", color: "white", border: "none", borderRadius: "50%",
                      width: "32px", height: "32px", cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="file"
                  accept="image/*"
                  id="gallery-upload"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!file.type.startsWith("image/")) {
                      alert(isAr ? "الرجاء اختيار ملف صورة" : "Please select an image file");
                      return;
                    }
                    const fd = new FormData();
                    fd.append("file", file);
                    try {
                      const res = await fetch("/api/upload-image", { method: "POST", body: fd });
                      const data = await res.json();
                      if (data.success) addGalleryItem(data.path || data.url);
                      else alert(isAr ? "فشل رفع الصورة" : "Failed to upload image");
                    } catch {
                      alert(isAr ? "حدث خطأ أثناء رفع الصورة" : "Error uploading image");
                    } finally {
                      e.target.value = "";
                    }
                  }}
                />
                <label htmlFor="gallery-upload" style={{
                  padding: "0.5rem 1rem", background: "#0070f3", color: "white", border: "none",
                  borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  <ImagePlus size={16} />
                  {isAr ? "رفع صورة للمعرض" : "Upload Gallery Image"}
                </label>
                <button onClick={() => {
                  const url = prompt(isAr ? "أدخل رابط الصورة" : "Enter image URL");
                  if (url) addGalleryItem(url);
                }} style={{
                  padding: "0.5rem 1rem", background: "#4caf50", color: "white", border: "none",
                  borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  <Plus size={16} />
                  {isAr ? "إضافة رابط صورة" : "Add Image URL"}
                </button>
              </div>
            </div>

            {/* Category, Location, Year */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>{isAr ? "الفئة (عربي)" : "Category (Arabic)"}</label>
                <input type="text" value={(getVal("category") as string) || ""} onChange={(e) => setVal("category", e.target.value)} style={inputStyle} placeholder={isAr ? "مثال: مدن ترفيهية" : "e.g. Entertainment Cities"} />
              </div>
              <div>
                <label style={labelStyle}>{isAr ? "الفئة (إنجليزي)" : "Category (English)"}</label>
                <input type="text" value={(getVal("categoryEn") as string) || ""} onChange={(e) => setVal("categoryEn", e.target.value)} style={inputStyle} placeholder={isAr ? "مثال: Entertainment Cities" : "e.g. Entertainment Cities"} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>{isAr ? "الموقع (عربي)" : "Location (Arabic)"}</label>
                <input type="text" value={(getVal("location") as string) || ""} onChange={(e) => setVal("location", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{isAr ? "الموقع (إنجليزي)" : "Location (English)"}</label>
                <input type="text" value={(getVal("locationEn") as string) || ""} onChange={(e) => setVal("locationEn", e.target.value)} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{isAr ? "السنة" : "Year"}</label>
                <input type="text" value={(getVal("year") as string) || ""} onChange={(e) => setVal("year", e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Status */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>{isAr ? "الحالة (عربي)" : "Status (Arabic)"}</label>
                <input type="text" value={(getVal("status") as string) || ""} onChange={(e) => setVal("status", e.target.value)} style={inputStyle} placeholder={isAr ? "مثال: مكتمل / قيد التنفيذ" : "e.g. Completed / Under Construction"} />
              </div>
              <div>
                <label style={labelStyle}>{isAr ? "الحالة (إنجليزي)" : "Status (English)"}</label>
                <input type="text" value={(getVal("statusEn") as string) || ""} onChange={(e) => setVal("statusEn", e.target.value)} style={inputStyle} placeholder={isAr ? "مثال: Completed" : "e.g. Completed"} />
              </div>
            </div>

            {/* Order & Published */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>{isAr ? "الترتيب" : "Order"}</label>
                <input type="number" value={getVal("order") as number} onChange={(e) => setVal("order", parseInt(e.target.value) || 0)} style={{ ...inputStyle, width: "100px" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                <input type="checkbox" checked={getVal("isPublished") as boolean} onChange={(e) => setVal("isPublished", e.target.checked)} />
                <label style={{ fontWeight: "bold" }}>{isAr ? "منشور" : "Published"}</label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button onClick={() => { setShowForm(false); setEditingProject(null); }} style={{
                padding: "0.75rem 2rem", background: "#ccc", color: "black", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "1rem",
              }}>
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button onClick={() => editingProject ? handleSave(editingProject) : handleCreate()} disabled={saving} style={{
                padding: "0.75rem 2rem", background: saving ? "#ccc" : "#0070f3", color: "white", border: "none",
                borderRadius: "4px", cursor: saving ? "not-allowed" : "pointer", fontSize: "1rem", fontWeight: "bold",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}>
                <Save size={16} />
                {saving ? (isAr ? "جاري الحفظ..." : "Saving...") : (isAr ? "حفظ" : "Save")}
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
          {projects.map((project) => (
            <div key={project.id} style={{ background: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <div style={{ marginBottom: "1rem" }}>
                <Image
                  src={project.image || "https://via.placeholder.com/400x300"}
                  alt={project.title}
                  width={400}
                  height={300}
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                  unoptimized
                />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {isAr ? project.title : project.titleEn || project.title}
              </h3>
              <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.9rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {isAr ? project.description : project.descriptionEn || project.description}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                {project.location && <span style={{ fontSize: "0.85rem", color: "#888" }}>📍 {isAr ? project.location : project.locationEn || project.location}</span>}
                {project.year && <span style={{ fontSize: "0.85rem", color: "#888" }}>📅 {project.year}</span>}
                {project.category && <span style={{ fontSize: "0.85rem", color: "#888" }}>🏷️ {isAr ? project.category : project.categoryEn || project.category}</span>}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                {project.status && (
                  <span style={{ fontSize: "0.85rem", color: "#2196F3", fontWeight: "bold" }}>
                    ⏳ {isAr ? project.status : project.statusEn || project.status}
                  </span>
                )}
                <span style={{ fontSize: "0.85rem", color: "#888" }}>
                  🖼️ {isAr ? "معرض:" : "Gallery:"} {project.gallery?.length || 0}
                </span>
                <span style={{ fontSize: "0.85rem", color: project.isPublished ? "#4caf50" : "#f44336" }}>
                  {project.isPublished ? (isAr ? "✓ منشور" : "✓ Published") : (isAr ? "✗ غير منشور" : "✗ Unpublished")}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button onClick={() => setEditingProject(project)} style={{
                  flex: 1, padding: "0.5rem", background: "#0070f3", color: "white", border: "none",
                  borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                }}>
                  <Edit2 size={16} />
                  {isAr ? "تعديل" : "Edit"}
                </button>
                <button onClick={() => handleDelete(project.id)} style={{
                  padding: "0.5rem 1rem", background: "#f44336", color: "white", border: "none",
                  borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "8px", color: "#666" }}>
            {isAr ? "لا توجد مشاريع ترفيهية. أضف مشروعاً جديداً!" : "No entertainment projects. Add a new project!"}
          </div>
        )}
      </div>
    </div>
  );
}
