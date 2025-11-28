"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import type { ContactUsContent } from "@/lib/data";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import DustParticles from "@/components/DustParticles";

interface HomeContactFormProps {
  locale: Locale;
  settings: any;
  content: ContactUsContent;
}

export default function HomeContactForm({ locale, settings, content }: HomeContactFormProps) {
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
      
      // Scroll to form to show success message
      const formElement = document.getElementById("contact-form");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : content.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="home-contact-section" id="contact" style={{ position: 'relative' }}>
        <DustParticles id="contact-dust" />
        <div className="home-contact-container">
          <div className="home-contact-header">
            <h2 style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
              {content.formTitle || content.heroTitle}
            </h2>
            <p style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
              {content.heroSubtitle}
            </p>
          </div>

          <div className="home-contact-grid">
            <div className="home-contact-form-wrapper">
              {success && (
                <div className="home-success-message">
                  {content.successMessage}
                </div>
              )}

              {error && (
                <div className="home-error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="home-contact-form" id="contact-form">
                <div className="home-form-group">
                  <label htmlFor="home-name" style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                    {content.nameLabel} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="home-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "error" : ""}
                    style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                <div className="home-form-group">
                  <label htmlFor="home-email" style={{ fontFamily: settings?.bodyFont }}>
                    {content.emailLabel} <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="home-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                    style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                <div className="home-form-group">
                  <label htmlFor="home-phone" style={{ fontFamily: settings?.bodyFont }}>
                    {content.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    id="home-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}
                  />
                </div>

                <div className="home-form-group">
                  <label htmlFor="home-subject" style={{ fontFamily: settings?.bodyFont }}>
                    {content.subjectLabel} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="home-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? "error" : ""}
                    style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}
                  />
                  {errors.subject && <span className="field-error">{errors.subject}</span>}
                </div>

                <div className="home-form-group">
                  <label htmlFor="home-message" style={{ fontFamily: settings?.bodyFont }}>
                    {content.messageLabel} <span className="required">*</span>
                  </label>
                  <textarea
                    id="home-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={errors.message ? "error" : ""}
                    style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}
                  />
                  {errors.message && <span className="field-error">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="home-submit-button"
                  style={{ fontFamily: settings?.bodyFont }}
                >
                  {loading ? content.sendingButton : content.sendButton}
                </button>
              </form>
            </div>

            <div className="home-contact-info">
              <h3 style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                {content.infoTitle}
              </h3>
              <p style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                {content.infoDescription}
              </p>

              <div className="home-info-items">
                <div className="home-info-item">
                  <div className="home-info-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="home-info-content">
                    <h4 style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                      {content.addressLabel}
                    </h4>
                    <p style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                      {content.addressValue}
                    </p>
                  </div>
                </div>

                <div className="home-info-item">
                  <div className="home-info-icon">
                    <Phone size={24} />
                  </div>
                  <div className="home-info-content">
                    <h4 style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                      {content.phoneLabelInfo}
                    </h4>
                    <p style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                      {content.phoneValue}
                    </p>
                  </div>
                </div>

                <div className="home-info-item">
                  <div className="home-info-icon">
                    <Mail size={24} />
                  </div>
                  <div className="home-info-content">
                    <h4 style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                      {content.emailLabelInfo}
                    </h4>
                    <p style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                      {content.emailValue}
                    </p>
                  </div>
                </div>

                <div className="home-info-item">
                  <div className="home-info-icon">
                    <Clock size={24} />
                  </div>
                  <div className="home-info-content">
                    <h4 style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
                      {content.hoursLabel}
                    </h4>
                    <p style={{ fontFamily: 'var(--font-kufi), "DG Kufi", "Noto Kufi Arabic", Arial, sans-serif' }}>
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
        .home-contact-section {
          padding: clamp(100px, 12vw, 150px) clamp(1.5rem, 5vw, 8%);
          padding-top: clamp(180px, 20vw, 250px);
          background: #000000;
          position: relative;
          z-index: 1;
        }

        .home-contact-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.6) 0%, transparent 50%),
            radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 50%);
          background-size: 200% 200%;
          opacity: 0.5;
          z-index: 0;
        }

        .home-contact-section::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.3) 0px,
            rgba(255, 255, 255, 0.3) 2px,
            transparent 2px,
            transparent 8px
          );
          z-index: 0;
          opacity: 0.4;
        }

        .home-contact-container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .home-contact-header {
          text-align: center;
          margin-bottom: clamp(40px, 6vw, 70px);
        }

        .home-contact-header h2 {
          font-size: clamp(2.2rem, 7vw, 4rem);
          color: var(--gold);
          margin-bottom: 1.5rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
          text-shadow: 0 2px 15px rgba(212, 193, 157, 0.2);
        }

        .home-contact-header p {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: rgba(212, 193, 157, 0.85);
          opacity: 0.9;
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto;
        }

        .home-contact-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 60px;
          align-items: start;
        }

        .home-contact-form-wrapper,
        .home-contact-info {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: clamp(30px, 5vw, 50px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 8px 25px rgba(0, 0, 0, 0.3);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .home-contact-form-wrapper:hover,
        .home-contact-info:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 35px 80px rgba(0, 0, 0, 0.7),
            0 15px 35px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(212, 193, 157, 0.3) inset;
          border-color: rgba(255, 255, 255, 0.3);
        }

        .home-success-message {
          background: #d4edda;
          color: #155724;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #c3e6cb;
        }

        .home-error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          border: 1px solid #f5c6cb;
        }

        .home-contact-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .home-form-group {
          display: flex;
          flex-direction: column;
        }

        .home-form-group label {
          color: var(--gold);
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .required {
          color: #d32f2f;
        }

        .home-form-group input,
        .home-form-group textarea {
          width: 100%;
          padding: 0.875rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(212, 193, 157, 0.9);
          transition: all 0.3s ease;
        }

        .home-form-group input:focus,
        .home-form-group textarea:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(212, 193, 157, 0.2);
          background: rgba(255, 255, 255, 0.08);
        }

        .home-form-group input.error,
        .home-form-group textarea.error {
          border-color: #d32f2f;
        }

        .field-error {
          color: #d32f2f;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .home-submit-button {
          padding: 1rem 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: var(--gold);
          border: 1px solid rgba(212, 193, 157, 0.3);
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 
            0 8px 25px rgba(0, 0, 0, 0.5),
            0 3px 10px rgba(0, 0, 0, 0.3);
          margin-top: 0.5rem;
          letter-spacing: 0.5px;
        }

        .home-submit-button:hover:not(:disabled) {
          background: rgba(212, 193, 157, 0.2);
          color: var(--gold);
          border-color: rgba(212, 193, 157, 0.5);
          transform: translateY(-5px) scale(1.05);
          box-shadow: 
            0 12px 40px rgba(0, 0, 0, 0.7),
            0 6px 20px rgba(0, 0, 0, 0.5);
        }

        .home-submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .home-contact-info h3 {
          font-size: clamp(1.6rem, 3.5vw, 2.2rem);
          color: var(--gold);
          margin-bottom: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .home-contact-info > p {
          color: rgba(212, 193, 157, 0.85);
          opacity: 0.9;
          line-height: 1.8;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .home-info-items {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .home-info-item {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .home-info-icon {
          width: 50px;
          height: 50px;
          min-width: 50px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--dark);
        }

        .home-info-content h4 {
          font-size: 1.25rem;
          color: var(--gold);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .home-info-content p {
          color: rgba(212, 193, 157, 0.8);
          opacity: 0.9;
          line-height: 1.6;
          margin: 0;
        }

        @media (max-width: 968px) {
          .home-contact-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .home-contact-form-wrapper,
          .home-contact-info {
            padding: 30px;
          }
        }

        @media (max-width: 768px) {
          .home-contact-form-wrapper,
          .home-contact-info {
            padding: 25px;
          }
        }

        [dir="rtl"] .home-info-item {
          flex-direction: row-reverse;
        }
      `}</style>
    </>
  );
}

