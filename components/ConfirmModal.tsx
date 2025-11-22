"use client";

import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import type { Locale } from "@/i18n";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  locale?: Locale;
  confirmButtonColor?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  locale = "ar",
  confirmButtonColor = "#dc3545",
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 10000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
            position: "relative",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1rem",
              [locale === "ar" ? "left" : "right"]: "1rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={20} />
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            <div>
              <AlertTriangle size={32} color="orange" />
            </div>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                margin: 0,
                fontFamily: "var(--font-tajawal)",
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#666",
                margin: 0,
                lineHeight: "1.6",
              }}
            >
              {message}
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "0.5rem",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: "0.75rem 2rem",
                  background: "#f0f0f0",
                  color: "#333",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e0e0e0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                }}
              >
                {cancelText || (locale === "ar" ? "إلغاء" : "Cancel")}
              </button>
              <button
                onClick={handleConfirm}
                style={{
                  padding: "0.75rem 2rem",
                  background: confirmButtonColor,
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                {confirmText || (locale === "ar" ? "تأكيد" : "Confirm")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

