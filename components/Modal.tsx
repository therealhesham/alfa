"use client";

import { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import type { Locale } from "@/i18n";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  locale?: Locale;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  locale = "ar",
}: ModalProps) {
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

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={24} color="green" />;
      case "error":
        return <AlertCircle size={24} color="#dc3545" />;
      case "warning":
        return <AlertTriangle size={24} color="orange" />;
      default:
        return <Info size={24} color="#0F1C2A" />;
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case "success":
        return "var(--gold)";
      case "error":
        return "#dc3545";
      case "warning":
        return "orange";
      default:
        return "var(--gold)";
    }
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
            <div>{getIcon()}</div>
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
            <button
              onClick={onClose}
              style={{
                padding: "0.75rem 2rem",
                background: getButtonColor(),
                color: type === "error" || type === "warning" ? "white" : "var(--dark)",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "0.5rem",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              {locale === "ar" ? "حسناً" : "OK"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

