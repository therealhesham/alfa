"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Plus, X, Trash2, Edit2, Save, Globe, Award, Building2 } from "lucide-react";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

interface Project {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  images: string[];
  location: string | null;
  locationEn: string | null;
  category: string | null;
  categoryEn: string | null;
  projectType?: string | null;
  year: string | null;
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
  showRemove = false
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
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        onChange(data.path || data.url);
      } else {
        alert(currentLocale === "ar" ? "فشل رفع الصورة" : "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(currentLocale === "ar" ? "حدث خطأ أثناء رفع الصورة" : "Error uploading image");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        cursor: "pointer",
        width: width,
        height: height,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleImageClick}
    >
      {isUploading ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f0f0f0",
            border: "2px dashed #ccc",
            borderRadius: "8px",
          }}
        >
          {currentLocale === "ar" ? "جاري الرفع..." : "Uploading..."}
        </div>
      ) : (
        <Image
          src={src || "https://via.placeholder.com/300x200"}
          alt={alt}
          width={width}
          height={height}
          style={{
            objectFit: "cover",
            borderRadius: "8px",
            border: isHovered ? "3px solid #0070f3" : "3px solid transparent",
            transition: "all 0.3s",
            opacity: isHovered ? 0.8 : 1,
            width: "100%",
            height: "100%",
          }}
          unoptimized
        />
      )}
      {isHovered && !isUploading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(0, 112, 243, 0.9)",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            fontSize: "0.9rem",
            pointerEvents: "none",
          }}
        >
          {currentLocale === "ar" ? "انقر لتغيير الصورة" : "Click to change image"}
        </div>
      )}
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(255, 0, 0, 0.8)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "30px",
            height: "30px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default function AdminOurProjectsPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocaleState, setCurrentLocale] = useState<Locale>(locale);
  currentLocale = currentLocaleState;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    image: "",
    images: [] as string[],
    location: "",
    locationEn: "",
    category: "",
    categoryEn: "",
    projectType: "commercial",
    year: "",
    order: 0,
    isPublished: true,
  });

  useEffect(() => {
    fetchProjects();
  }, [currentLocaleState]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects?all=true&locale=${currentLocaleState}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (project: Project) => {
    setSaving(true);
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchProjects();
        setEditingProject(null);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchProjects();
        setShowForm(false);
        setFormData({
          title: "",
          titleEn: "",
          description: "",
          descriptionEn: "",
          image: "",
          images: [],
          location: "",
          locationEn: "",
          category: "",
          categoryEn: "",
          projectType: "commercial",
          year: "",
          order: projects.length,
          isPublished: true,
        });
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الإنشاء" : "Error creating project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(currentLocaleState === "ar" ? "هل أنت متأكد من حذف هذا المشروع؟" : "Are you sure you want to delete this project?")) {
      return;
    }

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting project");
    }
  };

  const addImage = (project: Project | null, imageUrl: string) => {
    if (project) {
      const updated = { ...project, images: [...(project.images || []), imageUrl] };
      setEditingProject(updated);
    } else {
      setFormData((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
    }
  };

  const removeImage = (project: Project | null, index: number) => {
    if (project) {
      const updated = { ...project, images: project.images.filter((_, i) => i !== index) };
      setEditingProject(updated);
    } else {
      setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    }
  };

  if (loading || authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        {currentLocaleState === "ar" ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        {currentLocaleState === "ar" ? "غير مصرح" : "Unauthorized"}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <AdminNav locale={currentLocaleState} />
      <LogoutButton />
      
      <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {currentLocaleState === "ar" ? "إدارة المشاريع" : "Manage Projects"}
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={() => setCurrentLocale("ar")}
              style={{
                padding: "0.5rem 1rem",
                background: currentLocaleState === "ar" ? "#0070f3" : "#e0e0e0",
                color: currentLocaleState === "ar" ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              العربية
            </button>
            <button
              onClick={() => setCurrentLocale("en")}
              style={{
                padding: "0.5rem 1rem",
                background: currentLocaleState === "en" ? "#0070f3" : "#e0e0e0",
                color: currentLocaleState === "en" ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              English
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingProject(null);
              }}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Plus size={20} />
              {currentLocaleState === "ar" ? "إضافة مشروع" : "Add Project"}
            </button>
          </div>
        </div>

        {saved && (
          <div
            style={{
              padding: "1rem",
              background: "#4caf50",
              color: "white",
              borderRadius: "4px",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            {currentLocaleState === "ar" ? "تم الحفظ بنجاح!" : "Saved successfully!"}
          </div>
        )}

        {/* Add/Edit Form */}
        {(showForm || editingProject) && (
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                {editingProject
                  ? currentLocaleState === "ar" ? "تعديل المشروع" : "Edit Project"
                  : currentLocaleState === "ar" ? "إضافة مشروع جديد" : "Add New Project"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                }}
              >
                <X />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                  {currentLocaleState === "ar" ? "العنوان (عربي)" : "Title (Arabic)"}
                </label>
                <input
                  type="text"
                  value={editingProject?.title || formData.title}
                  onChange={(e) => {
                    if (editingProject) {
                      setEditingProject({ ...editingProject, title: e.target.value });
                    } else {
                      setFormData({ ...formData, title: e.target.value });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                  {currentLocaleState === "ar" ? "العنوان (إنجليزي)" : "Title (English)"}
                </label>
                <input
                  type="text"
                  value={editingProject?.titleEn || formData.titleEn}
                  onChange={(e) => {
                    if (editingProject) {
                      setEditingProject({ ...editingProject, titleEn: e.target.value });
                    } else {
                      setFormData({ ...formData, titleEn: e.target.value });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                {currentLocaleState === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}
              </label>
              <textarea
                value={editingProject?.description || formData.description}
                onChange={(e) => {
                  if (editingProject) {
                    setEditingProject({ ...editingProject, description: e.target.value });
                  } else {
                    setFormData({ ...formData, description: e.target.value });
                  }
                }}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                {currentLocaleState === "ar" ? "الوصف (إنجليزي)" : "Description (English)"}
              </label>
              <textarea
                value={editingProject?.descriptionEn || formData.descriptionEn}
                onChange={(e) => {
                  if (editingProject) {
                    setEditingProject({ ...editingProject, descriptionEn: e.target.value });
                  } else {
                    setFormData({ ...formData, descriptionEn: e.target.value });
                  }
                }}
                rows={4}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                {currentLocaleState === "ar" ? "صورة الغلاف" : "Cover Image"}
              </label>
              <EditableImage
                src={editingProject?.image || formData.image}
                alt="Cover"
                onChange={(newPath) => {
                  if (editingProject) {
                    setEditingProject({ ...editingProject, image: newPath });
                  } else {
                    setFormData({ ...formData, image: newPath });
                  }
                }}
                width={400}
                height={300}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                {currentLocaleState === "ar" ? "الصور الإضافية" : "Additional Images"}
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
                {(editingProject?.images || formData.images).map((img, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <EditableImage
                      src={img}
                      alt={`Image ${index + 1}`}
                      onChange={(newPath) => {
                        if (editingProject) {
                          const updated = [...editingProject.images];
                          updated[index] = newPath;
                          setEditingProject({ ...editingProject, images: updated });
                        } else {
                          const updated = [...formData.images];
                          updated[index] = newPath;
                          setFormData({ ...formData, images: updated });
                        }
                      }}
                      onRemove={() => {
                        if (editingProject) {
                          setEditingProject({ ...editingProject, images: editingProject.images.filter((_, i) => i !== index) });
                        } else {
                          setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
                        }
                      }}
                      showRemove={true}
                      width={150}
                      height={150}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={(input) => {
                    if (input) {
                      input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (!file) return;

                        if (!file.type.startsWith('image/')) {
                          alert(currentLocaleState === "ar" ? "الرجاء اختيار ملف صورة" : "Please select an image file");
                          return;
                        }

                        const formData = new FormData();
                        formData.append("file", file);

                        try {
                          const response = await fetch("/api/upload-image", {
                            method: "POST",
                            body: formData,
                          });

                          const data = await response.json();
                          
                          if (data.success) {
                            const imageUrl = data.path || data.url;
                            if (editingProject) {
                              setEditingProject({ ...editingProject, images: [...(editingProject.images || []), imageUrl] });
                            } else {
                              setFormData((prev) => ({ ...prev, images: [...prev.images, imageUrl] }));
                            }
                          } else {
                            alert(currentLocaleState === "ar" ? "فشل رفع الصورة" : "Failed to upload image");
                          }
                        } catch (error) {
                          console.error("Error uploading image:", error);
                          alert(currentLocaleState === "ar" ? "حدث خطأ أثناء رفع الصورة" : "Error uploading image");
                        } finally {
                          if (input) input.value = '';
                        }
                      };
                    }
                  }}
                  style={{ display: "none" }}
                  id="additional-images-upload"
                />
                <label
                  htmlFor="additional-images-upload"
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Plus size={16} />
                  {currentLocaleState === "ar" ? "رفع صورة" : "Upload Image"}
                </label>
                <button
                  onClick={() => {
                    const url = prompt(currentLocaleState === "ar" ? "أدخل رابط الصورة" : "Enter image URL");
                    if (url) {
                      if (editingProject) {
                        setEditingProject({ ...editingProject, images: [...(editingProject.images || []), url] });
                      } else {
                        setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
                      }
                    }
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Plus size={16} />
                  {currentLocaleState === "ar" ? "إضافة رابط" : "Add URL"}
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                  {currentLocaleState === "ar" ? "الموقع (عربي)" : "Location (Arabic)"}
                </label>
                <input
                  type="text"
                  value={editingProject?.location || formData.location}
                  onChange={(e) => {
                    if (editingProject) {
                      setEditingProject({ ...editingProject, location: e.target.value });
                    } else {
                      setFormData({ ...formData, location: e.target.value });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                  {currentLocaleState === "ar" ? "الموقع (إنجليزي)" : "Location (English)"}
                </label>
                <input
                  type="text"
                  value={editingProject?.locationEn || formData.locationEn}
                  onChange={(e) => {
                    if (editingProject) {
                      setEditingProject({ ...editingProject, locationEn: e.target.value });
                    } else {
                      setFormData({ ...formData, locationEn: e.target.value });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                  {currentLocaleState === "ar" ? "السنة" : "Year"}
                </label>
                <input
                  type="text"
                  value={editingProject?.year || formData.year}
                  onChange={(e) => {
                    if (editingProject) {
                      setEditingProject({ ...editingProject, year: e.target.value });
                    } else {
                      setFormData({ ...formData, year: e.target.value });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                  {currentLocaleState === "ar" ? "الفئة (عربي)" : "Category (Arabic)"}
                </label>
                <input
                  type="text"
                  value={editingProject?.category || formData.category}
                  onChange={(e) => {
                    if (editingProject) {
                      setEditingProject({ ...editingProject, category: e.target.value });
                    } else {
                      setFormData({ ...formData, category: e.target.value });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                  {currentLocaleState === "ar" ? "الفئة (إنجليزي)" : "Category (English)"}
                </label>
                <input
                  type="text"
                  value={editingProject?.categoryEn || formData.categoryEn}
                  onChange={(e) => {
                    if (editingProject) {
                      setEditingProject({ ...editingProject, categoryEn: e.target.value });
                    } else {
                      setFormData({ ...formData, categoryEn: e.target.value });
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "2px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                {currentLocaleState === "ar" ? "نوع المشروع" : "Project Type"}
              </label>
              <select
                value={editingProject?.projectType || formData.projectType || "commercial"}
                onChange={(e) => {
                  if (editingProject) {
                    setEditingProject({ ...editingProject, projectType: e.target.value });
                  } else {
                    setFormData({ ...formData, projectType: e.target.value });
                  }
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              >
                <option value="commercial">{currentLocaleState === "ar" ? "تجاري" : "Commercial"}</option>
                <option value="residential">{currentLocaleState === "ar" ? "سكني" : "Residential"}</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                  {currentLocaleState === "ar" ? "الترتيب" : "Order"}
                </label>
                <input
                  type="number"
                  value={editingProject?.order ?? formData.order}
                  onChange={(e) => {
                    if (editingProject) {
                      setEditingProject({ ...editingProject, order: parseInt(e.target.value) || 0 });
                    } else {
                      setFormData({ ...formData, order: parseInt(e.target.value) || 0 });
                    }
                  }}
                  style={{
                    width: "100px",
                    padding: "0.75rem",
                    border: "2px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                <input
                  type="checkbox"
                  checked={editingProject?.isPublished ?? formData.isPublished}
                  onChange={(e) => {
                    if (editingProject) {
                      setEditingProject({ ...editingProject, isPublished: e.target.checked });
                    } else {
                      setFormData({ ...formData, isPublished: e.target.checked });
                    }
                  }}
                />
                <label style={{ fontWeight: "bold" }}>
                  {currentLocaleState === "ar" ? "منشور" : "Published"}
                </label>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                }}
                style={{
                  padding: "0.75rem 2rem",
                  background: "#ccc",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                {currentLocaleState === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  if (editingProject) {
                    handleSave(editingProject);
                  } else {
                    handleCreate();
                  }
                }}
                disabled={saving}
                style={{
                  padding: "0.75rem 2rem",
                  background: saving ? "#ccc" : "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Save size={16} />
                {saving
                  ? currentLocaleState === "ar" ? "جاري الحفظ..." : "Saving..."
                  : currentLocaleState === "ar" ? "حفظ" : "Save"}
              </button>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "1.5rem" }}>
          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <Image
                  src={project.image || "https://via.placeholder.com/400x300"}
                  alt={project.title}
                  width={400}
                  height={300}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  unoptimized
                />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {currentLocaleState === "ar" ? project.title : project.titleEn || project.title}
              </h3>
              <p style={{ color: "#666", marginBottom: "1rem", fontSize: "0.9rem" }}>
                {currentLocaleState === "ar" ? project.description : project.descriptionEn || project.description}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                {project.location && (
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>
                    📍 {currentLocaleState === "ar" ? project.location : project.locationEn || project.location}
                  </span>
                )}
                {project.year && (
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>
                    📅 {project.year}
                  </span>
                )}
                {project.category && (
                  <span style={{ fontSize: "0.85rem", color: "#888" }}>
                    🏷️ {currentLocaleState === "ar" ? project.category : project.categoryEn || project.category}
                  </span>
                )}
                {project.projectType && (
                  <span style={{ 
                    fontSize: "0.85rem", 
                    color: project.projectType === "commercial" ? "#2196F3" : "#4CAF50",
                    fontWeight: "bold"
                  }}>
                    {project.projectType === "commercial" 
                      ? (currentLocaleState === "ar" ? "🏢 تجاري" : "🏢 Commercial")
                      : (currentLocaleState === "ar" ? "🏠 سكني" : "🏠 Residential")
                    }
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", color: "#888" }}>
                  {currentLocaleState === "ar" ? "الصور:" : "Images:"} {project.images?.length || 0}
                </span>
                <span style={{ fontSize: "0.85rem", color: project.isPublished ? "#4caf50" : "#f44336" }}>
                  {project.isPublished
                    ? currentLocaleState === "ar" ? "✓ منشور" : "✓ Published"
                    : currentLocaleState === "ar" ? "✗ غير منشور" : "✗ Unpublished"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                <button
                  onClick={() => setEditingProject(project)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    background: "#0070f3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Edit2 size={16} />
                  {currentLocaleState === "ar" ? "تعديل" : "Edit"}
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              background: "white",
              borderRadius: "8px",
              color: "#666",
            }}
          >
            {currentLocaleState === "ar" ? "لا توجد مشاريع" : "No projects"}
          </div>
        )}
      </div>
    </div>
  );
}

