"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import type { ContactUsContent } from "@/lib/data";

interface ContactFormProps {
  locale: Locale;
  settings: any;
  content: ContactUsContent;
}

export default function ContactForm({ locale, settings, content }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = content.requiredField;
    }
    if (!formData.email.trim()) {
      newErrors.email = content.requiredField;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = content.invalidEmail;
    }
    if (!formData.subject.trim()) {
      newErrors.subject = content.requiredField;
    }
    if (!formData.message.trim()) {
      newErrors.message = content.requiredField;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || content.errorMessage);
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : content.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="contact-wrapper">
        <div className="contact-hero">
          <div className="contact-content">
            <h1 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {content.heroTitle}
            </h1>
            <p style={{ fontFamily: settings?.bodyFont }}>
              {content.heroSubtitle}
            </p>
          </div>
        </div>

        <div className="contact-container">
          <div className="contact-grid">
            <div className="contact-form-section">
              <h2 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                {content.formTitle}
              </h2>
              
              {success && (
                <div className="success-message">
                  {content.successMessage}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" style={{ fontFamily: settings?.bodyFont }}>
                    {content.nameLabel} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "error" : ""}
                    style={{ fontFamily: settings?.bodyFont }}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" style={{ fontFamily: settings?.bodyFont }}>
                    {content.emailLabel} <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    style={{ fontFamily: settings?.bodyFont }}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" style={{ fontFamily: settings?.bodyFont }}>
                    {content.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ fontFamily: settings?.bodyFont }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject" style={{ fontFamily: settings?.bodyFont }}>
                    {content.subjectLabel} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? "error" : ""}
                    style={{ fontFamily: settings?.bodyFont }}
                  />
                  {errors.subject && <span className="field-error">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message" style={{ fontFamily: settings?.bodyFont }}>
                    {content.messageLabel} <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={errors.message ? "error" : ""}
                    style={{ fontFamily: settings?.bodyFont }}
                  />
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button"
                  style={{ fontFamily: settings?.bodyFont }}
                >
                  {loading ? content.sendingButton : content.sendButton}
                </button>
              </form>
            </div>

            <div className="contact-info-section">
              <h2 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                {content.infoTitle}
              </h2>
              <p style={{ fontFamily: settings?.bodyFont }}>
                {content.infoDescription}
              </p>

              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {content.addressLabel}
                    </h3>
                    <p style={{ fontFamily: settings?.bodyFont }}>
                      {content.addressValue}
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {content.phoneLabelInfo}
                    </h3>
                    <p style={{ fontFamily: settings?.bodyFont }}>
                      {content.phoneValue}
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {content.emailLabelInfo}
                    </h3>
                    <p style={{ fontFamily: settings?.bodyFont }}>
                      {content.emailValue}
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="info-content">
                    <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {content.hoursLabel}
                    </h3>
                    <p style={{ fontFamily: settings?.bodyFont }}>
                      {content.hoursValue}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-wrapper {
          min-height: 100vh;
          background: linear-gradient(rgba(250, 247, 242, 0.85), rgba(232, 217, 192, 0.95)),
            url('/BG.jpg') center/cover no-repeat;
          position: relative;
          padding-top: 100px;
        }

        .contact-hero {
          padding: 80px 5% 60px;
          text-align: center;
          position: relative;
        }

        .contact-content h1 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          color: #0F1C2A;
          margin-bottom: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .contact-content p {
          font-size: clamp(1.1rem, 3vw, 1.4rem);
          color: #0F1C2A;
          opacity: 0.85;
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto;
        }

        .contact-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 5% 80px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 60px;
          align-items: start;
        }

        .contact-form-section,
        .contact-info-section {
          background: rgba(250, 247, 242, 0.95);
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(15, 28, 42, 0.1);
        }

        .contact-form-section h2,
        .contact-info-section h2 {
          font-size: 2rem;
          color: #0F1C2A;
          margin-bottom: 2rem;
          font-weight: 700;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #c3e6cb;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #f5c6cb;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          color: #0F1C2A;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .required {
          color: #d32f2f;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid rgba(15, 28, 42, 0.2);
          border-radius: 8px;
          font-size: 1rem;
          background: #FAF7F2;
          color: #0F1C2A;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #D4C19D;
          box-shadow: 0 0 0 3px rgba(212, 193, 157, 0.1);
        }

        .form-group input.error,
        .form-group textarea.error {
          border-color: #d32f2f;
        }

        .field-error {
          color: #d32f2f;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .submit-button {
          padding: 1rem 2.5rem;
          background: #0F1C2A;
          color: #FAF7F2;
          border: 2px solid #0F1C2A;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(15, 28, 42, 0.2);
          margin-top: 0.5rem;
        }

        .submit-button:hover:not(:disabled) {
          background: #D4C19D;
          color: #0F1C2A;
          border-color: #D4C19D;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 193, 157, 0.4);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .contact-info-section p {
          color: #0F1C2A;
          opacity: 0.85;
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .info-items {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-item {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .info-icon {
          width: 50px;
          height: 50px;
          min-width: 50px;
          background: #D4C19D;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0F1C2A;
        }

        .info-icon svg {
          width: 24px;
          height: 24px;
        }

        .info-content h3 {
          font-size: 1.25rem;
          color: #0F1C2A;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .info-content p {
          color: #0F1C2A;
          opacity: 0.85;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 968px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .contact-form-section,
          .contact-info-section {
            padding: 30px;
          }
        }

        @media (max-width: 768px) {
          .contact-hero {
            padding: 60px 4% 40px;
          }

          .contact-container {
            padding: 0 4% 60px;
          }

          .contact-form-section,
          .contact-info-section {
            padding: 25px;
          }

          .contact-form-section h2,
          .contact-info-section h2 {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .contact-hero {
            padding: 50px 3% 30px;
          }

          .contact-container {
            padding: 0 3% 50px;
          }

          .contact-form-section,
          .contact-info-section {
            padding: 20px;
          }
        }

        [dir="rtl"] .info-item {
          flex-direction: row-reverse;
        }
      `}</style>
    </>
  );
}

