"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";
import { User, UserCheck, UserX, Edit, Trash2, Calendar, Mail, Key, Check, Pause } from "lucide-react";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const params = useParams();
  const currentLocale = (params?.locale as Locale) || "ar";
  const { user: currentUser, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
    role: "admin",
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "success" | "error" | "info" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch(`/api/users`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      errors.username = currentLocale === "ar" ? "اسم المستخدم مطلوب" : "Username is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = currentLocale === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = currentLocale === "ar" ? "البريد الإلكتروني غير صحيح" : "Invalid email format";
    }
    
    if (!editingUser && !formData.password.trim()) {
      errors.password = currentLocale === "ar" ? "كلمة المرور مطلوبة" : "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = currentLocale === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);

    try {
      const url = `/api/users`;
      const method = editingUser ? "PUT" : "POST";

      const body: any = {
        ...(editingUser && { id: editingUser.id }),
        username: formData.username,
        email: formData.email,
        name: formData.name || null,
        role: formData.role,
        isActive: formData.isActive,
      };

      // Only include password if it's provided (for new users or when updating)
      if (!editingUser || formData.password) {
        body.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchUsers();
        resetForm();
        setShowForm(false);
        setEditingUser(null);
        setModal({
          isOpen: true,
          title: currentLocale === "ar" ? "نجح" : "Success",
          message: currentLocale === "ar" 
            ? (editingUser ? "تم تحديث المستخدم بنجاح" : "تم إضافة المستخدم بنجاح")
            : (editingUser ? "User updated successfully" : "User added successfully"),
          type: "success",
        });
      } else {
        setModal({
          isOpen: true,
          title: currentLocale === "ar" ? "خطأ" : "Error",
          message: data.error || (currentLocale === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving user"),
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setModal({
        isOpen: true,
        title: currentLocale === "ar" ? "خطأ" : "Error",
        message: currentLocale === "ar" ? "حدث خطأ أثناء الحفظ" : "Error saving user",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      name: user.name || "",
      role: user.role,
      isActive: user.isActive,
    });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: currentLocale === "ar" ? "تأكيد الحذف" : "Confirm Delete",
      message: currentLocale === "ar" ? "هل أنت متأكد من حذف هذا المستخدم؟" : "Are you sure you want to delete this user?",
      onConfirm: async () => {
        setDeleting(id);
        try {
          const response = await fetch(`/api/users?id=${id}`, {
            method: "DELETE",
            credentials: "include",
          });

          if (response.ok) {
            await fetchUsers();
            setModal({
              isOpen: true,
              title: currentLocale === "ar" ? "نجح" : "Success",
              message: currentLocale === "ar" ? "تم حذف المستخدم بنجاح" : "User deleted successfully",
              type: "success",
            });
          } else {
            const data = await response.json();
            setModal({
              isOpen: true,
              title: currentLocale === "ar" ? "خطأ" : "Error",
              message: data.error || (currentLocale === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting user"),
              type: "error",
            });
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          setModal({
            isOpen: true,
            title: currentLocale === "ar" ? "خطأ" : "Error",
            message: currentLocale === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting user",
            type: "error",
          });
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      name: "",
      role: "admin",
      isActive: true,
    });
    setFormErrors({});
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString(currentLocale === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{currentLocale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  // Check if user is admin - only admins can access this page
  if (currentUser.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--light)", paddingTop: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#dc3545" }}>
            {currentLocale === "ar" ? "غير مصرح" : "Access Denied"}
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#666" }}>
            {currentLocale === "ar" 
              ? "ليس لديك صلاحية للوصول إلى هذه الصفحة. هذه الصفحة متاحة فقط للمديرين." 
              : "You don't have permission to access this page. This page is only available for administrators."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--light)", paddingTop: "80px" }}>
      <LogoutButton />
      <AdminNav locale={currentLocale} />
      
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        locale={currentLocale}
      />
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        locale={currentLocale}
      />

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-tajawal)" }}>
            {currentLocale === "ar" ? "إدارة المستخدمين" : "Manage Users"}
          </h1>
          <button
            onClick={() => {
              resetForm();
              setEditingUser(null);
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
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <UserCheck size={20} />
            {showForm
              ? currentLocale === "ar"
                ? "إلغاء"
                : "Cancel"
              : currentLocale === "ar"
              ? "إضافة مستخدم جديد"
              : "Add New User"}
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
              {editingUser
                ? currentLocale === "ar"
                  ? "تعديل المستخدم"
                  : "Edit User"
                : currentLocale === "ar"
                ? "إضافة مستخدم جديد"
                : "Add New User"}
            </h2>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: "1rem", 
              marginBottom: "1rem" 
            }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "اسم المستخدم" : "Username"} *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => {
                    setFormData({ ...formData, username: e.target.value });
                    if (formErrors.username) {
                      setFormErrors({ ...formErrors, username: "" });
                    }
                  }}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${formErrors.username ? "#dc3545" : "#ddd"}`,
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
                {formErrors.username && (
                  <p style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {formErrors.username}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  {currentLocale === "ar" ? "البريد الإلكتروني" : "Email"} *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) {
                      setFormErrors({ ...formErrors, email: "" });
                    }
                  }}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${formErrors.email ? "#dc3545" : "#ddd"}`,
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
                {formErrors.email && (
                  <p style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {formErrors.email}
                  </p>
                )}
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
                  {currentLocale === "ar" ? "الاسم الكامل" : "Full Name"}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  {currentLocale === "ar" ? "كلمة المرور" : "Password"} {editingUser ? `(${currentLocale === "ar" ? "اتركه فارغاً للحفاظ على الكلمة الحالية" : "leave empty to keep current"})` : "*"}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (formErrors.password) {
                      setFormErrors({ ...formErrors, password: "" });
                    }
                  }}
                  required={!editingUser}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${formErrors.password ? "#dc3545" : "#ddd"}`,
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                />
                {formErrors.password && (
                  <p style={{ color: "#dc3545", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                    {formErrors.password}
                  </p>
                )}
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
                  {currentLocale === "ar" ? "الدور" : "Role"}
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "1rem",
                  }}
                >
                  <option value="admin">{currentLocale === "ar" ? "مدير" : "Admin"}</option>
                  <option value="editor">{currentLocale === "ar" ? "محرر" : "Editor"}</option>
                </select>
              </div>
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span>{currentLocale === "ar" ? "نشط" : "Active"}</span>
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
                : editingUser
                ? currentLocale === "ar"
                  ? "حفظ التعديلات"
                  : "Save Changes"
                : currentLocale === "ar"
                ? "إضافة المستخدم"
                : "Add User"}
            </button>
          </form>
        )}

        {loadingUsers ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>{currentLocale === "ar" ? "جاري التحميل..." : "Loading..."}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {users.map((user) => (
              <div
                key={user.id}
                style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1.5rem",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                    {user.isActive ? (
                      <UserCheck size={24} color="green" />
                    ) : (
                      <UserX size={24} color="gray" />
                    )}
                    <div>
                      <h3 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>
                        {user.name || user.username}
                      </h3>
                      <p style={{ color: "#666", fontSize: "0.9rem" }}>
                        @{user.username}
                      </p>
                    </div>
                  </div>
                  <div style={{ 
                    display: "flex", 
                    gap: "1.5rem", 
                    fontSize: "0.9rem", 
                    color: "#999",
                    flexWrap: "wrap",
                    marginTop: "0.5rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Key size={16} />
                      <span>{user.role === "admin" ? (currentLocale === "ar" ? "مدير" : "Admin") : (currentLocale === "ar" ? "محرر" : "Editor")}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Calendar size={16} />
                      <span>{currentLocale === "ar" ? "آخر دخول:" : "Last login:"} {formatDate(user.lastLogin)}</span>
                    </div>
                    <div style={{ 
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: user.isActive ? "green" : "orange",
                      fontWeight: "600"
                    }}>
                      {user.isActive ? (
                        <>
                          <Check size={16} />
                          <span>{currentLocale === "ar" ? "نشط" : "Active"}</span>
                        </>
                      ) : (
                        <>
                          <Pause size={16} />
                          <span>{currentLocale === "ar" ? "غير نشط" : "Inactive"}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ 
                  display: "flex", 
                  gap: "0.5rem",
                  flexDirection: "column",
                }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{
                      padding: "0.5rem 1rem",
                      background: "var(--gold)",
                      color: "var(--dark)",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      justifyContent: "center",
                    }}
                  >
                    <Edit size={16} />
                    {currentLocale === "ar" ? "تعديل" : "Edit"}
                  </button>
                  {currentUser?.id !== user.id && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deleting === user.id}
                      style={{
                        padding: "0.5rem 1rem",
                        background: deleting === user.id ? "#ccc" : "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: deleting === user.id ? "not-allowed" : "pointer",
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      <Trash2 size={16} />
                      {deleting === user.id
                        ? currentLocale === "ar"
                          ? "جاري الحذف..."
                          : "Deleting..."
                        : currentLocale === "ar"
                        ? "حذف"
                        : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loadingUsers && users.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#666" }}>
            <p style={{ fontSize: "1.2rem" }}>
              {currentLocale === "ar" ? "لا يوجد مستخدمون بعد" : "No users yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

