"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { PinIcon, CalendarIcon } from "lucide-react";
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
  location: string | null;
  locationEn: string | null;
  category: string | null;
  categoryEn: string | null;
  year: string | null;
  order: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProjectsPage() {
  const params = useParams();
  const currentLocale = (params?.locale as Locale) || "ar";
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    image: "",
    location: "",
    locationEn: "",
    category: "",
    categoryEn: "",
    year: "",
    order: 0,
    isPublished: true,
  });

  useEffect(() => {
    fetchProjects();
  }, [currentLocale]);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      // Fetch all projects (including unpublished) for admin
      const response = await fetch(`/api/projects?all=true`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const response = await fetch(`/api/projects?all=true`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching all projects:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingProject
        ? `/api/projects`
        : `/api/projects`;
      const method = editingProject ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingProject && { id: editingProject.id }),
          ...formData,
        }),
      });

      if (response.ok) {
        await fetchAllProjects();
        resetForm();
        setShowForm(false);
        setEditingProject(null);
      } else {
        alert(currentLocale === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving project");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      alert(currentLocale === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      titleEn: project.titleEn,
      description: project.description,
      descriptionEn: project.descriptionEn,
      image: project.image,
      location: project.location || "",
      locationEn: project.locationEn || "",
      category: project.category || "",
      categoryEn: project.categoryEn || "",
      year: project.year || "",
      order: project.order,
      isPublished: project.isPublished,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(currentLocale === "ar" ? "هل أنت متأكد من حذف هذا المشروع؟" : "Are you sure you want to delete this project?")) {
      return;
    }

    setDeleting(id);
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchAllProjects();
      } else {
        alert(currentLocale === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(currentLocale === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting project");
    } finally {
      setDeleting(null);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      titleEn: "",
      description: "",
      descriptionEn: "",
      image: "",
      location: "",
      locationEn: "",
      category: "",
      categoryEn: "",
      year: "",
      order: 0,
      isPublished: true,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, image: data.url }));
      } else {
        alert(currentLocale === "ar" ? "حدث خطأ أثناء رفع الصورة" : "Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(currentLocale === "ar" ? "حدث خطأ أثناء رفع الصورة" : "Error uploading image");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{currentLocale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--light)", paddingTop: "80px" }}>
      <LogoutButton />
      <AdminNav locale={currentLocale} />

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-tajawal)" }}>
            {currentLocale === "ar" ? "إدارة المشاريع" : "Manage Projects"}
          </h1>
          <button
            onClick={() => {
              resetForm();
              setEditingProject(null);
              setShowForm(!showForm);
            }}
            style={{
              padding: "0.75rem 1.5rem",
              background: "var(--gold)",
              color: "var(--dark)",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {showForm
              ? currentLocale === "ar"
                ? "إلغاء"
                : "Cancel"
              : currentLocale === "ar"
              ? "إضافة مشروع جديد"
              : "Add New Project"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem" }}>
              {editingProject
                ? currentLocale === "ar"
                  ? "تعديل المشروع"
                  : "Edit Project"
                : currentLocale === "ar"
                ? "إضافة مشروع جديد"
                : "Add New Project"}
            </h2>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: "1rem", 
              marginBottom: "1rem" 
            }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "العنوان (عربي)" : "Title (Arabic)"} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "العنوان (إنجليزي)" : "Title (English)"} *
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: "1rem", 
              marginBottom: "1rem" 
            }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "الوصف (عربي)" : "Description (Arabic)"} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "الوصف (إنجليزي)" : "Description (English)"} *
                </label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  required
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                {currentLocale === "ar" ? "صورة المشروع" : "Project Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ marginBottom: "0.5rem" }}
              />
              {formData.image && (
                <div style={{ marginTop: "1rem" }}>
                  <Image
                    src={formData.image}
                    alt="Preview"
                    width={200}
                    height={150}
                    style={{ borderRadius: "8px", objectFit: "cover" }}
                    unoptimized
                  />
                </div>
              )}
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder={currentLocale === "ar" ? "أو أدخل رابط الصورة" : "Or enter image URL"}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  marginTop: "0.5rem",
                }}
              />
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: "1rem", 
              marginBottom: "1rem" 
            }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "الموقع (عربي)" : "Location (Arabic)"}
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "الموقع (إنجليزي)" : "Location (English)"}
                </label>
                <input
                  type="text"
                  value={formData.locationEn}
                  onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "الفئة (عربي)" : "Category (Arabic)"}
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "الفئة (إنجليزي)" : "Category (English)"}
                </label>
                <input
                  type="text"
                  value={formData.categoryEn}
                  onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "1rem", 
              marginBottom: "1rem" 
            }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "السنة" : "Year"}
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "الترتيب" : "Order"}
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  />
                  <span>{currentLocale === "ar" ? "منشور" : "Published"}</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "0.75rem 2rem",
                background: saving ? "#ccc" : "var(--gold)",
                color: "var(--dark)",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving
                ? currentLocale === "ar"
                  ? "جاري الحفظ..."
                  : "Saving..."
                : editingProject
                ? currentLocale === "ar"
                  ? "حفظ التعديلات"
                  : "Save Changes"
                : currentLocale === "ar"
                ? "إضافة المشروع"
                : "Add Project"}
            </button>
          </form>
        )}

        {loadingProjects ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>{currentLocale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {projects.map((project) => (
              <div
                key={project.id}
                className="admin-project-item"
                style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  display: "grid",
                  gridTemplateColumns: "minmax(150px, 200px) 1fr auto",
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                <div style={{ 
                  position: "relative", 
                  width: "100%", 
                  minWidth: "150px",
                  height: "150px", 
                  borderRadius: "8px", 
                  overflow: "hidden" 
                }}>
                  <Image
                    src={project.image || "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"}
                    alt={project.title}
                    fill
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", wordBreak: "break-word" }}>
                    {currentLocale === "ar" ? project.title : project.titleEn || project.title}
                  </h3>
                  <p style={{ color: "#666", marginBottom: "0.5rem", wordBreak: "break-word" }}>
                    {currentLocale === "ar" ? project.description : project.descriptionEn || project.description}
                  </p>
                  <div style={{ 
                    display: "flex", 
                    gap: "1rem", 
                    fontSize: "0.9rem", 
                    color: "#999",
                    flexWrap: "wrap"
                  }}>
                    {project.location && <span><PinIcon /> {currentLocale === "ar" ? project.location : project.locationEn || project.location}</span>}
                    {project.year && <span><CalendarIcon /> {project.year}</span>}
                    {project.category && <span>🏷️ {currentLocale === "ar" ? project.category : project.categoryEn || project.category}</span>}
                    <span style={{ color: project.isPublished ? "green" : "orange" }}>
                      {project.isPublished
                        ? currentLocale === "ar"
                          ? " منشور"
                          : " Published"
                        : currentLocale === "ar"
                        ? "⏸ غير منشور"
                        : "⏸ Unpublished"}
                    </span>
                  </div>
                </div>
                <div className="admin-project-actions" style={{ 
                  display: "flex", 
                  gap: "0.5rem",
                  flexDirection: "column",
                }}>
                  <button
                    onClick={() => handleEdit(project)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "var(--gold)",
                      color: "var(--dark)",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {currentLocale === "ar" ? "تعديل" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deleting === project.id}
                    style={{
                      padding: "0.5rem 1rem",
                      background: deleting === project.id ? "#ccc" : "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: deleting === project.id ? "not-allowed" : "pointer",
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {deleting === project.id
                      ? currentLocale === "ar"
                        ? "جاري الحذف..."
                        : "Deleting..."
                      : currentLocale === "ar"
                      ? "حذف"
                      : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingProjects && projects.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#666" }}>
            <p style={{ fontSize: "1.2rem" }}>
              {currentLocale === "ar" ? "لا توجد مشاريع بعد" : "No projects yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

