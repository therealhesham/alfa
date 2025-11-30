"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Plus, X, Trash2, Edit2, Save, Globe, Award, Building2, Users } from "lucide-react";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

interface Client {
  name: string;
  logo: string;
}

interface OurClientsContent {
  id: string;
  statsTitle: string;
  statsTitleEn: string;
  statsSubtitle: string;
  statsSubtitleEn: string;
  showStats: boolean;
  statsStat1Icon: string;
  statsStat1Number: string;
  statsStat1Label: string;
  statsStat1LabelEn: string;
  statsStat2Icon: string;
  statsStat2Number: string;
  statsStat2Label: string;
  statsStat2LabelEn: string;
  statsStat3Icon: string;
  statsStat3Number: string;
  statsStat3Label: string;
  statsStat3LabelEn: string;
  statsStat4Icon: string;
  statsStat4Number: string;
  statsStat4Label: string;
  statsStat4LabelEn: string;
  clientsTitle: string;
  clientsTitleEn: string;
  clientsSubtitle: string;
  clientsSubtitleEn: string;
  clientLogos: string; // JSON string
}

let currentLocale: Locale = "ar";

function EditableImage({ 
  src, 
  alt, 
  onChange, 
  width = 200, 
  height = 120,
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
          src={src || "https://via.placeholder.com/200x120"}
          alt={alt}
          width={width}
          height={height}
          style={{
            objectFit: "contain",
            borderRadius: "8px",
            border: isHovered ? "3px solid #0070f3" : "3px solid transparent",
            transition: "all 0.3s",
            opacity: isHovered ? 0.8 : 1,
            width: "100%",
            height: "100%",
            background: "#f5f5f5",
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

const iconMap: { [key: string]: any } = {
  Globe,
  Building2,
  Award,
  Users,
  Layers: Building2,
  Sparkles: Award,
};

export default function AdminOurClientsPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);
  const [currentLocaleState, setCurrentLocale] = useState<Locale>(locale);
  currentLocale = currentLocaleState;
  const [content, setContent] = useState<OurClientsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClientIndex, setEditingClientIndex] = useState<number | null>(null);
  const [newClient, setNewClient] = useState<Client>({ name: "", logo: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [currentLocaleState]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/our-clients-content?locale=${currentLocaleState}`);
      if (response.ok) {
        const data = await response.json();
        setContent({
          id: data.id || "",
          statsTitle: data.statsTitle || "",
          statsTitleEn: data.statsTitleEn || "",
          statsSubtitle: data.statsSubtitle || "",
          statsSubtitleEn: data.statsSubtitleEn || "",
          showStats: data.showStats ?? true,
          statsStat1Icon: data.statsStat1Icon || "Building2",
          statsStat1Number: data.statsStat1Number || "250+",
          statsStat1Label: data.statsStat1Label || "",
          statsStat1LabelEn: data.statsStat1LabelEn || "",
          statsStat2Icon: data.statsStat2Icon || "Globe",
          statsStat2Number: data.statsStat2Number || "48",
          statsStat2Label: data.statsStat2Label || "",
          statsStat2LabelEn: data.statsStat2LabelEn || "",
          statsStat3Icon: data.statsStat3Icon || "Award",
          statsStat3Number: data.statsStat3Number || "22",
          statsStat3Label: data.statsStat3Label || "",
          statsStat3LabelEn: data.statsStat3LabelEn || "",
          statsStat4Icon: data.statsStat4Icon || "Users",
          statsStat4Number: data.statsStat4Number || "500+",
          statsStat4Label: data.statsStat4Label || "",
          statsStat4LabelEn: data.statsStat4LabelEn || "",
          clientsTitle: data.clientsTitle || "",
          clientsTitleEn: data.clientsTitleEn || "",
          clientsSubtitle: data.clientsSubtitle || "",
          clientsSubtitleEn: data.clientsSubtitleEn || "",
          clientLogos: JSON.stringify(data.clientLogos || []),
        });
        setClients(data.clientLogos || []);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;
    
    setSaving(true);
    try {
      const { clientLogos: _, ...contentWithoutLogos } = content;
      const updateData = {
        ...contentWithoutLogos,
        clientLogos: clients,
      };

      const response = await fetch("/api/our-clients-content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        fetchContent();
      } else {
        alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert(currentLocaleState === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving content");
    } finally {
      setSaving(false);
    }
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.logo) {
      alert(currentLocaleState === "ar" ? "يرجى إدخال اسم العميل والشعار" : "Please enter client name and logo");
      return;
    }
    setClients([...clients, newClient]);
    setNewClient({ name: "", logo: "" });
    setShowAddForm(false);
  };

  const handleUpdateClient = (index: number, updatedClient: Client) => {
    const updated = [...clients];
    updated[index] = updatedClient;
    setClients(updated);
    setEditingClientIndex(null);
  };

  const handleDeleteClient = (index: number) => {
    if (!confirm(currentLocaleState === "ar" ? "هل أنت متأكد من حذف هذا العميل؟" : "Are you sure you want to delete this client?")) {
      return;
    }
    setClients(clients.filter((_, i) => i !== index));
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

  if (!content) {
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
        {currentLocaleState === "ar" ? "لا يوجد محتوى" : "No content"}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <AdminNav locale={currentLocaleState} />
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
      
      <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
            {currentLocaleState === "ar" ? "إدارة العملاء" : "Manage Clients"}
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
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "0.75rem 1.5rem",
                background: saving ? "#ccc" : "#4caf50",
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
              <Save size={20} />
              {saving
                ? currentLocaleState === "ar" ? "جاري الحفظ..." : "Saving..."
                : currentLocaleState === "ar" ? "حفظ" : "Save"}
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

        {/* Stats Section */}
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
            {currentLocaleState === "ar" ? "الإحصائيات" : "Statistics"}
          </h2>
          
          {/* Show Stats Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: '#f5f5f5',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <label style={{
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <input
                type="checkbox"
                checked={content.showStats ?? true}
                onChange={(e) => setContent({ ...content, showStats: e.target.checked })}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              {currentLocaleState === "ar" ? "إظهار قسم الإحصائيات" : "Show Statistics Section"}
            </label>
          </div>
          
          <div style={{ display: content.showStats !== false ? "grid" : "none", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                {currentLocaleState === "ar" ? "عنوان الإحصائيات (عربي)" : "Stats Title (Arabic)"}
              </label>
              <input
                type="text"
                value={content.statsTitle}
                onChange={(e) => setContent({ ...content, statsTitle: e.target.value })}
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
                {currentLocaleState === "ar" ? "عنوان الإحصائيات (إنجليزي)" : "Stats Title (English)"}
              </label>
              <input
                type="text"
                value={content.statsTitleEn}
                onChange={(e) => setContent({ ...content, statsTitleEn: e.target.value })}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                {currentLocaleState === "ar" ? "وصف الإحصائيات (عربي)" : "Stats Subtitle (Arabic)"}
              </label>
              <textarea
                value={content.statsSubtitle}
                onChange={(e) => setContent({ ...content, statsSubtitle: e.target.value })}
                rows={3}
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
                {currentLocaleState === "ar" ? "وصف الإحصائيات (إنجليزي)" : "Stats Subtitle (English)"}
              </label>
              <textarea
                value={content.statsSubtitleEn}
                onChange={(e) => setContent({ ...content, statsSubtitleEn: e.target.value })}
                rows={3}
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

          {/* Stats Items */}
          {content.showStats !== false && [1, 2, 3, 4].map((num) => (
            <div key={num} style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f9f9f9", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>
                {currentLocaleState === "ar" ? `إحصائية ${num}` : `Stat ${num}`}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                    {currentLocaleState === "ar" ? "الأيقونة" : "Icon"}
                  </label>
                  <select
                    value={content[`statsStat${num}Icon` as keyof OurClientsContent] as string}
                    onChange={(e) => setContent({ ...content, [`statsStat${num}Icon`]: e.target.value } as any)}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "1rem",
                    }}
                  >
                    <option value="Building2">{currentLocaleState === "ar" ? "مبنى" : "Building"}</option>
                    <option value="Globe">{currentLocaleState === "ar" ? "كرة أرضية" : "Globe"}</option>
                    <option value="Award">{currentLocaleState === "ar" ? "جائزة" : "Award"}</option>
                    <option value="Users">{currentLocaleState === "ar" ? "مستخدمين" : "Users"}</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                    {currentLocaleState === "ar" ? "الرقم" : "Number"}
                  </label>
                  <input
                    type="text"
                    value={content[`statsStat${num}Number` as keyof OurClientsContent] as string}
                    onChange={(e) => setContent({ ...content, [`statsStat${num}Number`]: e.target.value } as any)}
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
                    {currentLocaleState === "ar" ? "التسمية (عربي)" : "Label (Arabic)"}
                  </label>
                  <input
                    type="text"
                    value={content[`statsStat${num}Label` as keyof OurClientsContent] as string}
                    onChange={(e) => setContent({ ...content, [`statsStat${num}Label`]: e.target.value } as any)}
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
                    {currentLocaleState === "ar" ? "التسمية (إنجليزي)" : "Label (English)"}
                  </label>
                  <input
                    type="text"
                    value={content[`statsStat${num}LabelEn` as keyof OurClientsContent] as string}
                    onChange={(e) => setContent({ ...content, [`statsStat${num}LabelEn`]: e.target.value } as any)}
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
            </div>
          ))}
        </div>

        {/* Clients Section */}
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
              {currentLocaleState === "ar" ? "قسم العملاء" : "Clients Section"}
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: "0.75rem 1.5rem",
                background: "#0070f3",
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
              {currentLocaleState === "ar" ? "إضافة عميل" : "Add Client"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                {currentLocaleState === "ar" ? "عنوان العملاء (عربي)" : "Clients Title (Arabic)"}
              </label>
              <input
                type="text"
                value={content.clientsTitle}
                onChange={(e) => setContent({ ...content, clientsTitle: e.target.value })}
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
                {currentLocaleState === "ar" ? "عنوان العملاء (إنجليزي)" : "Clients Title (English)"}
              </label>
              <input
                type="text"
                value={content.clientsTitleEn}
                onChange={(e) => setContent({ ...content, clientsTitleEn: e.target.value })}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                {currentLocaleState === "ar" ? "وصف العملاء (عربي)" : "Clients Subtitle (Arabic)"}
              </label>
              <textarea
                value={content.clientsSubtitle}
                onChange={(e) => setContent({ ...content, clientsSubtitle: e.target.value })}
                rows={3}
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
                {currentLocaleState === "ar" ? "وصف العملاء (إنجليزي)" : "Clients Subtitle (English)"}
              </label>
              <textarea
                value={content.clientsSubtitleEn}
                onChange={(e) => setContent({ ...content, clientsSubtitleEn: e.target.value })}
                rows={3}
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

          {/* Add Client Form */}
          {showAddForm && (
            <div style={{ padding: "1.5rem", background: "#f9f9f9", borderRadius: "8px", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>
                {currentLocaleState === "ar" ? "إضافة عميل جديد" : "Add New Client"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                    {currentLocaleState === "ar" ? "اسم العميل" : "Client Name"}
                  </label>
                  <input
                    type="text"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "1rem",
                    }}
                    placeholder={currentLocaleState === "ar" ? "اسم العميل" : "Client Name"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                    {currentLocaleState === "ar" ? "شعار العميل" : "Client Logo"}
                  </label>
                  <EditableImage
                    src={newClient.logo}
                    alt="Client Logo"
                    onChange={(newPath) => setNewClient({ ...newClient, logo: newPath })}
                    width={200}
                    height={120}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={handleAddClient}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  {currentLocaleState === "ar" ? "إضافة" : "Add"}
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewClient({ name: "", logo: "" });
                  }}
                  style={{
                    padding: "0.75rem 1.5rem",
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
              </div>
            </div>
          )}

          {/* Clients List */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {clients.map((client, index) => (
              <div
                key={index}
                style={{
                  background: "#f9f9f9",
                  padding: "1.5rem",
                  borderRadius: "8px",
                  border: editingClientIndex === index ? "2px solid #0070f3" : "1px solid #ddd",
                }}
              >
                {editingClientIndex === index ? (
                  <div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                        {currentLocaleState === "ar" ? "اسم العميل" : "Client Name"}
                      </label>
                      <input
                        type="text"
                        value={client.name}
                        onChange={(e) => handleUpdateClient(index, { ...client, name: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "2px solid #ddd",
                          borderRadius: "4px",
                          fontSize: "1rem",
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                        {currentLocaleState === "ar" ? "شعار العميل" : "Client Logo"}
                      </label>
                      <EditableImage
                        src={client.logo}
                        alt="Client Logo"
                        onChange={(newPath) => handleUpdateClient(index, { ...client, logo: newPath })}
                        width={200}
                        height={120}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => setEditingClientIndex(null)}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          background: "#ccc",
                          color: "black",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        {currentLocaleState === "ar" ? "إلغاء" : "Cancel"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: "1rem", textAlign: "center" }}>
                      <EditableImage
                        src={client.logo}
                        alt={client.name}
                        onChange={(newPath) => handleUpdateClient(index, { ...client, logo: newPath })}
                        width={200}
                        height={120}
                      />
                    </div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "1rem", textAlign: "center" }}>
                      {client.name}
                    </h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => setEditingClientIndex(index)}
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
                        onClick={() => handleDeleteClient(index)}
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
                )}
              </div>
            ))}
          </div>

          {clients.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                color: "#666",
              }}
            >
              {currentLocaleState === "ar" ? "لا يوجد عملاء" : "No clients"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

