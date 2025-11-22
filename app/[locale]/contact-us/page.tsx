import type { Metadata } from "next";
import { getTranslations } from "@/lib/i18n";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import FontsProvider from "@/components/FontsProvider";
import { getSiteSettings, getContactUsContent, type ContactUsContent } from "@/lib/data";
import ContactForm from "./ContactForm";
import type { Locale } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;

  const title = validLocale === "ar"
    ? "تواصلوا معنا - ظلال المدينة | اتصل بنا"
    : "Contact Us - City Shadows | Get in Touch";

  const description = validLocale === "ar"
    ? "تواصلوا معنا لمعرفة المزيد عن خدماتنا في التصميم المعماري والهندسة الفاخرة. نحن هنا لمساعدتك في تحقيق رؤيتك المعمارية."
    : "Contact us to learn more about our architectural design and luxury engineering services. We're here to help you realize your architectural vision.";

  return generateSEOMetadata({
    title,
    description,
    locale: validLocale,
    path: "/contact-us",
    keywords: validLocale === "ar"
      ? ["تواصل معنا", "اتصل بنا", "ظلال المدينة", "خدمات معمارية"]
      : ["Contact Us", "Get in Touch", "City Shadows", "Architectural Services"],
  });
}

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
