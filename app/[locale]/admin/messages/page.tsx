"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Locale } from "@/i18n";
import LogoutButton from "@/components/LogoutButton";
import AdminNav from "@/components/AdminNav";
import { useAuth } from "@/lib/use-auth";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMessagesPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ar";
  const { user, loading: authLoading, isAuthenticated } = useAuth(locale);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated, filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filter === "read") {
        queryParams.append("isRead", "true");
      } else if (filter === "unread") {
        queryParams.append("isRead", "false");
      }
      
      const response = await fetch(`/api/contact-messages?${queryParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead: !isRead }),
      });

      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead: !isRead });
        }
      }
    } catch (error) {
      console.error("Error updating message:", error);
      alert(locale === "ar" ? "حدث خطأ أثناء تحديث الرسالة" : "Error updating message");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === "ar" ? "هل أنت متأكد من حذف هذه الرسالة؟" : "Are you sure you want to delete this message?")) {
      return;
    }

    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchMessages();
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert(locale === "ar" ? "حدث خطأ أثناء حذف الرسالة" : "Error deleting message");
    }
  };

  const handleMessageClick = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      await handleMarkAsRead(message.id, message.isRead);
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (authLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>{locale === "ar" ? "جاري التحقق من المصادقة..." : "Checking authentication..."}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <AdminNav locale={locale} />
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "120px 2rem 2rem",
        direction: locale === "ar" ? "rtl" : "ltr",
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "var(--gold)",
          }}>
            {locale === "ar" ? "الرسائل الواردة" : "Incoming Messages"}
          </h1>
          <LogoutButton />
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: filter === "all" ? "#0F1C2A" : "transparent",
              color: filter === "all" ? "#FAF7F2" : "var(--gold)",
              border: "2px solid #0F1C2A",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {locale === "ar" ? "الكل" : "All"} ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: filter === "unread" ? "#0F1C2A" : "transparent",
              color: filter === "unread" ? "#FAF7F2" : "var(--gold)",
              border: "2px solid #0F1C2A",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              position: "relative",
            }}
          >
            {locale === "ar" ? "غير مقروءة" : "Unread"} ({unreadCount})
            {unreadCount > 0 && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                backgroundColor: "#dc3545",
                color: "white",
                borderRadius: "50%",
                width: "24px",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("read")}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: filter === "read" ? "#0F1C2A" : "transparent",
              color: filter === "read" ? "#FAF7F2" : "var(--gold)",
              border: "2px solid #0F1C2A",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {locale === "ar" ? "مقروءة" : "Read"} ({messages.length - unreadCount})
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: selectedMessage ? "1fr 1.5fr" : "1fr",
          gap: "2rem",
        }}>
          {/* Messages List */}
          <div style={{
            backgroundColor: "#FAF7F2",
            borderRadius: "12px",
            padding: "1.5rem",
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
          }}>
            {loading ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                {locale === "ar" ? "جاري التحميل..." : "Loading..."}
              </p>
            ) : messages.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                {locale === "ar" ? "لا توجد رسائل" : "No messages"}
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    style={{
                      padding: "1rem",
                      backgroundColor: message.isRead ? "white" : "#E8F4F8",
                      borderRadius: "8px",
                      border: selectedMessage?.id === message.id ? "2px solid #0F1C2A" : "1px solid rgba(15, 28, 42, 0.1)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(15, 28, 42, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.5rem",
                    }}>
                      <h3 style={{
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "var(--gold)",
                        margin: 0,
                      }}>
                        {message.name}
                      </h3>
                      {!message.isRead && (
                        <span style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#dc3545",
                          borderRadius: "50%",
                          display: "inline-block",
                        }} />
                      )}
                    </div>
                    <p style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      margin: "0.25rem 0",
                      fontWeight: message.isRead ? 400 : 600,
                    }}>
                      {message.subject}
                    </p>
                    <p style={{
                      fontSize: "0.85rem",
                      color: "#999",
                      margin: "0.5rem 0 0 0",
                    }}>
                      {new Date(message.createdAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Details */}
          {selectedMessage && (
            <div style={{
              backgroundColor: "#FAF7F2",
              borderRadius: "12px",
              padding: "2rem",
              maxHeight: "calc(100vh - 250px)",
              overflowY: "auto",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
              }}>
                <h2 style={{
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "var(--gold)",
                  margin: 0,
                }}>
                  {selectedMessage.subject}
                </h2>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleMarkAsRead(selectedMessage.id, selectedMessage.isRead)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: selectedMessage.isRead ? "#ffc107" : "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {selectedMessage.isRead 
                      ? (locale === "ar" ? "تعليم كمقروءة" : "Mark as Unread")
                      : (locale === "ar" ? "تعليم كمقروءة" : "Mark as Read")}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {locale === "ar" ? "حذف" : "Delete"}
                  </button>
                </div>
              </div>

              <div style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}>
                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "var(--gold)" }}>{locale === "ar" ? "الاسم:" : "Name:"}</strong>
                  <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>{selectedMessage.name}</p>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "var(--gold)" }}>{locale === "ar" ? "البريد الإلكتروني:" : "Email:"}</strong>
                  <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
                    <a href={`mailto:${selectedMessage.email}`} style={{ color: "#0070f3" }}>
                      {selectedMessage.email}
                    </a>
                  </p>
                </div>
                {selectedMessage.phone && (
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "var(--gold)" }}>{locale === "ar" ? "الهاتف:" : "Phone:"}</strong>
                    <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
                      <a href={`tel:${selectedMessage.phone}`} style={{ color: "#0070f3" }}>
                        {selectedMessage.phone}
                      </a>
                    </p>
                  </div>
                )}
                <div style={{ marginBottom: "1rem" }}>
                  <strong style={{ color: "var(--gold)" }}>{locale === "ar" ? "التاريخ:" : "Date:"}</strong>
                  <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
                    {new Date(selectedMessage.createdAt).toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}
                  </p>
                </div>
              </div>

              <div style={{
                backgroundColor: "white",
                padding: "1.5rem",
                borderRadius: "8px",
              }}>
                <strong style={{ color: "var(--gold)" }}>{locale === "ar" ? "الرسالة:" : "Message:"}</strong>
                <p style={{
                  margin: "1rem 0 0 0",
                  color: "#666",
                  lineHeight: "1.8",
                  whiteSpace: "pre-wrap",
                }}>
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

