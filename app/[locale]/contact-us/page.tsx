import { getTranslations } from "@/lib/i18n";
import Header from "@/components/Header";
import FontsProvider from "@/components/FontsProvider";
import { getSiteSettings, getContactUsContent, type ContactUsContent } from "@/lib/data";
import ContactForm from "./ContactForm";
import type { Locale } from "@/i18n";

interface ContactUsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactUsPage({ params }: ContactUsPageProps) {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  const t = getTranslations(validLocale);
  const [settings, content] = await Promise.all([
    getSiteSettings(),
    getContactUsContent(validLocale),
  ]);

  const defaultHeaderLogo = "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png";

  // Fallback to translations if content is not available
  const displayContent: ContactUsContent = content || {
    id: "",
    heroTitle: t.contact.title,
    heroSubtitle: t.contact.subtitle,
    formTitle: t.contact.title,
    nameLabel: t.contact.name,
    emailLabel: t.contact.email,
    phoneLabel: t.contact.phone,
    subjectLabel: t.contact.subject,
    messageLabel: t.contact.message,
    sendButton: t.contact.send,
    sendingButton: t.contact.sending,
    infoTitle: t.contact.info.title,
    infoDescription: t.contact.info.description,
    addressLabel: t.contact.info.address,
    addressValue: t.contact.info.addressValue,
    phoneLabelInfo: t.contact.info.phone,
    phoneValue: t.contact.info.phoneValue,
    emailLabelInfo: t.contact.info.email,
    emailValue: t.contact.info.emailValue,
    hoursLabel: t.contact.info.hours,
    hoursValue: t.contact.info.hoursValue,
    successMessage: t.contact.success,
    errorMessage: t.contact.error,
    requiredField: t.contact.required,
    invalidEmail: t.contact.invalidEmail,
  };

  return (
    <FontsProvider settings={settings}>
      <Header 
        locale={validLocale} 
        settings={settings} 
        headerLogo={defaultHeaderLogo}
      />
      <ContactForm locale={validLocale} settings={settings} content={displayContent} />
    </FontsProvider>
  );
}
