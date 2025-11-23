"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import type { ContactUsContent } from "@/lib/data";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

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
      <div className="home-contact-section" id="contact">
        <div className="home-contact-container">
          <div className="home-contact-header">
            <h2 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
              {content.formTitle || content.heroTitle}
            </h2>
            <p style={{ fontFamily: settings?.bodyFont }}>
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
                  <label htmlFor="home-name" style={{ fontFamily: settings?.bodyFont }}>
                    {content.nameLabel} <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="home-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "error" : ""}
                    style={{ fontFamily: settings?.bodyFont }}
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
                    style={{ fontFamily: settings?.bodyFont }}
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
                    style={{ fontFamily: settings?.bodyFont }}
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
                    style={{ fontFamily: settings?.bodyFont }}
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
                    style={{ fontFamily: settings?.bodyFont }}
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
              <h3 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                {content.infoTitle}
              </h3>
              <p style={{ fontFamily: settings?.bodyFont }}>
                {content.infoDescription}
              </p>

              <div className="home-info-items">
                <div className="home-info-item">
                  <div className="home-info-icon">
                    <MapPin size={24} />
                  </div>
                  <div className="home-info-content">
                    <h4 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {content.addressLabel}
                    </h4>
                    <p style={{ fontFamily: settings?.bodyFont }}>
                      {content.addressValue}
                    </p>
                  </div>
                </div>

                <div className="home-info-item">
                  <div className="home-info-icon">
                    <Phone size={24} />
                  </div>
                  <div className="home-info-content">
                    <h4 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {content.phoneLabelInfo}
                    </h4>
                    <p style={{ fontFamily: settings?.bodyFont }}>
                      {content.phoneValue}
                    </p>
                  </div>
                </div>

                <div className="home-info-item">
                  <div className="home-info-icon">
                    <Mail size={24} />
                  </div>
                  <div className="home-info-content">
                    <h4 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {content.emailLabelInfo}
                    </h4>
                    <p style={{ fontFamily: settings?.bodyFont }}>
                      {content.emailValue}
                    </p>
                  </div>
                </div>

                <div className="home-info-item">
                  <div className="home-info-icon">
                    <Clock size={24} />
                  </div>
                  <div className="home-info-content">
                    <h4 style={{ fontFamily: settings?.headingFont || settings?.primaryFont }}>
                      {content.hoursLabel}
                    </h4>
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
        .home-contact-section {
          padding: clamp(60px, 10vw, 130px) clamp(1.5rem, 5vw, 8%);
          background: linear-gradient(135deg, rgba(250, 247, 242, 0.95) 0%, rgba(232, 217, 192, 0.9) 100%);
          position: relative;
        }

        .home-contact-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .home-contact-header {
          text-align: center;
          margin-bottom: clamp(40px, 6vw, 70px);
        }

        .home-contact-header h2 {
          font-size: clamp(2.2rem, 7vw, 4rem);
          color: var(--dark);
          margin-bottom: 1.5rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .home-contact-header p {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: var(--dark);
          opacity: 0.85;
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
          background: rgba(255, 255, 255, 0.98);
          padding: clamp(30px, 5vw, 50px);
          border-radius: 24px;
          box-shadow: 
            0 20px 60px rgba(15, 28, 42, 0.12),
            0 8px 25px rgba(15, 28, 42, 0.08),
            0 0 0 1px rgba(255, 255, 255, 0.5) inset;
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
          color: var(--dark);
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
          border: 2px solid rgba(15, 28, 42, 0.2);
          border-radius: 8px;
          font-size: 1rem;
          background: #FAF7F2;
          color: var(--dark);
          transition: all 0.3s ease;
        }

        .home-form-group input:focus,
        .home-form-group textarea:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(212, 193, 157, 0.1);
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
          background: var(--dark);
          color: #FAF7F2;
          border: 2px solid var(--dark);
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(15, 28, 42, 0.2);
          margin-top: 0.5rem;
        }

        .home-submit-button:hover:not(:disabled) {
          background: var(--gold);
          color: var(--dark);
          border-color: var(--gold);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 193, 157, 0.4);
        }

        .home-submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .home-contact-info h3 {
          font-size: clamp(1.6rem, 3.5vw, 2.2rem);
          color: var(--dark);
          margin-bottom: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
        }

        .home-contact-info > p {
          color: var(--dark);
          opacity: 0.85;
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
          color: var(--dark);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .home-info-content p {
          color: var(--dark);
          opacity: 0.85;
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

