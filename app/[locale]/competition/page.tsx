import type { Metadata } from "next";
import Link from "next/link";
import "@/app/competition.css";
import { getTranslations } from "@/lib/i18n";
import { getSiteSettings, getFooterContent, getHomeContent } from "@/lib/data";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
import CompetitionCountdown from "@/components/CompetitionCountdown";
import {
    Trophy,
    Users,
    Star,
    Zap,
    Medal,
    Target,
    ChevronDown,
    Gift,
} from "lucide-react";
import type { Locale } from "@/i18n";

export const revalidate = 60;

// ─── Competition Date ─────────────────────────────────────────────────
// Set your competition date here
const COMPETITION_DATE = "2026-04-15T10:00:00";

// ─── Bilingual Content ────────────────────────────────────────────────
const content = {
    ar: {
        badge: "بطولة حصرية",
        heroTitle: "البطولة الكبرى",
        heroSubtitle: "انضم إلى أكبر بطولة رياضية وترفيهية في المنطقة",
        countdownTitle: "ينطلق الحدث بعد",
        days: "يوم",
        hours: "ساعة",
        minutes: "دقيقة",
        seconds: "ثانية",
        ctaMain: "سجّل الآن",
        ctaSecondary: "اعرف أكثر",
        statsTitle: "أرقام البطولة",
        stats: [
            { value: "500+", label: "مشارك متوقع" },
            { value: "50K", label: "جائزة نقدية (ريال)" },
            { value: "3", label: "أيام منافسة" },
            { value: "20+", label: "فئة تنافسية" },
        ],
        prizesTitle: "الجوائز والمكافآت",
        prizes: [
            {
                place: "المركز الأول",
                amount: "25,000 ريال",
                icon: "Trophy",
                highlight: true,
            },
            {
                place: "المركز الثاني",
                amount: "15,000 ريال",
                icon: "Medal",
            },
            {
                place: "المركز الثالث",
                amount: "10,000 ريال",
                icon: "Star",
            },
        ],
        whyTitle: "لماذا تشارك؟",
        why: [
            {
                icon: "Zap",
                title: "تجربة لا تُنسى",
                desc: "منافسة حقيقية في بيئة احترافية مع أفضل المشاركين",
            },
            {
                icon: "Gift",
                title: "جوائز ضخمة",
                desc: "جوائز نقدية وعينية تصل إلى 50,000 ريال للفائزين",
            },
            {
                icon: "Users",
                title: "مجتمع متميز",
                desc: "تواصل مع نخبة من الرياضيين والمحترفين في المنطقة",
            },
            {
                icon: "Target",
                title: "تحدِّ نفسك",
                desc: "اكتشف قدراتك الحقيقية وأثبت جدارتك على أعلى مستوى",
            },
        ],
        formTitle: "سجّل اهتمامك الآن",
        formSubtitle: "كن أول من يعلم عند فتح التسجيل الرسمي",
        namePlaceholder: "الاسم الكامل",
        phonePlaceholder: "رقم الجوال",
        emailPlaceholder: "البريد الإلكتروني",
        submitBtn: "أبلغني عند الإطلاق",
        formNote: "لن نشارك بياناتك مع أي طرف ثالث",
        scrollHint: "اكتشف المزيد",
    },
    en: {
        badge: "Exclusive Tournament",
        heroTitle: "The Grand Championship",
        heroSubtitle:
            "Join the biggest sports and entertainment tournament in the region",
        countdownTitle: "Event Starts In",
        days: "Days",
        hours: "Hours",
        minutes: "Minutes",
        seconds: "Seconds",
        ctaMain: "Register Now",
        ctaSecondary: "Learn More",
        statsTitle: "Tournament by the Numbers",
        stats: [
            { value: "500+", label: "Expected Participants" },
            { value: "50K", label: "Prize Money (SAR)" },
            { value: "3", label: "Competition Days" },
            { value: "20+", label: "Competitive Categories" },
        ],
        prizesTitle: "Prizes & Rewards",
        prizes: [
            {
                place: "1st Place",
                amount: "SAR 25,000",
                icon: "Trophy",
                highlight: true,
            },
            {
                place: "2nd Place",
                amount: "SAR 15,000",
                icon: "Medal",
            },
            {
                place: "3rd Place",
                amount: "SAR 10,000",
                icon: "Star",
            },
        ],
        whyTitle: "Why Participate?",
        why: [
            {
                icon: "Zap",
                title: "Unforgettable Experience",
                desc: "Real competition in a professional environment with top participants",
            },
            {
                icon: "Gift",
                title: "Massive Prizes",
                desc: "Cash and in-kind prizes worth up to SAR 50,000 for winners",
            },
            {
                icon: "Users",
                title: "Elite Community",
                desc: "Connect with top athletes and professionals across the region",
            },
            {
                icon: "Target",
                title: "Challenge Yourself",
                desc: "Discover your true potential and prove your worth at the highest level",
            },
        ],
        formTitle: "Register Your Interest",
        formSubtitle: "Be the first to know when official registration opens",
        namePlaceholder: "Full Name",
        phonePlaceholder: "Phone Number",
        emailPlaceholder: "Email Address",
        submitBtn: "Notify Me at Launch",
        formNote: "We will never share your data with third parties",
        scrollHint: "Discover More",
    },
};

const iconMap: Record<string, React.ReactNode> = {
    Trophy: <Trophy size={32} />,
    Medal: <Medal size={32} />,
    Star: <Star size={32} />,
    Zap: <Zap size={36} />,
    Gift: <Gift size={36} />,
    Users: <Users size={36} />,
    Target: <Target size={36} />,
};

// ─── SEO ──────────────────────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const validLocale = (
        locale === "ar" || locale === "en" ? locale : "ar"
    ) as Locale;

    return generateSEOMetadata({
        title:
            validLocale === "ar"
                ? "البطولة الكبرى - ظلال المدينة"
                : "Grand Championship - City Shadows",
        description:
            validLocale === "ar"
                ? "انضم إلى أكبر بطولة رياضية وترفيهية في المنطقة. جوائز تصل إلى 50,000 ريال. سجّل اهتمامك الآن."
                : "Join the biggest sports and entertainment tournament in the region. Prizes up to SAR 50,000. Register your interest now.",
        locale: validLocale,
        path: "/competition",
    });
}

// ─── Page ─────────────────────────────────────────────────────────────
export default async function CompetitionPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const validLocale = (
        locale === "ar" || locale === "en" ? locale : "ar"
    ) as Locale;
    const c = content[validLocale];

    const [settings, footerContent, homeContent] = await Promise.all([
        getSiteSettings(),
        getFooterContent(validLocale),
        getHomeContent(validLocale),
    ]);

    const headerLogo =
        homeContent?.headerLogo ||
        "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png";

    return (
        <FontsProvider settings={settings}>
            <Header
                locale={validLocale}
                settings={settings}
                headerLogo={headerLogo}
            />

            <div className="comp-page">
                {/* ══════ HERO ══════ */}
                <section className="comp-hero">
                    {/* Animated background */}
                    <div className="comp-hero-bg">
                        <div className="comp-hero-orb comp-hero-orb-1" />
                        <div className="comp-hero-orb comp-hero-orb-2" />
                        <div className="comp-hero-orb comp-hero-orb-3" />
                        <div className="comp-hero-grid" />
                    </div>

                    <div className="comp-hero-inner">
                        <div className="comp-badge">
                            <Trophy size={16} />
                            <span>{c.badge}</span>
                        </div>

                        <h1 className="comp-hero-title">{c.heroTitle}</h1>
                        <p className="comp-hero-subtitle">{c.heroSubtitle}</p>

                        {/* Countdown */}
                        <div className="comp-countdown-wrapper">
                            <p className="comp-countdown-label">
                                {c.countdownTitle}
                            </p>
                            <CompetitionCountdown
                                targetDate={COMPETITION_DATE}
                                labels={{
                                    days: c.days,
                                    hours: c.hours,
                                    minutes: c.minutes,
                                    seconds: c.seconds,
                                }}
                            />
                        </div>

                        <div className="comp-hero-actions">
                            <a href="#register" className="comp-btn-primary">
                                {c.ctaMain}
                            </a>
                            <a href="#prizes" className="comp-btn-secondary">
                                {c.ctaSecondary}
                            </a>
                        </div>

                        <div className="comp-scroll-hint">
                            <span>{c.scrollHint}</span>
                            <ChevronDown size={20} />
                        </div>
                    </div>
                </section>

                {/* ══════ STATS ══════ */}
                <section className="comp-stats">
                    <div className="comp-stats-grid">
                        {c.stats.map((stat, i) => (
                            <div key={i} className="comp-stat-item">
                                <span className="comp-stat-value">
                                    {stat.value}
                                </span>
                                <span className="comp-stat-label">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════ PRIZES ══════ */}
                <section className="comp-prizes" id="prizes">
                    <div className="comp-section-header">
                        <h2>{c.prizesTitle}</h2>
                    </div>
                    <div className="comp-prizes-grid">
                        {c.prizes.map((prize, i) => (
                            <div
                                key={i}
                                className={`comp-prize-card ${(prize as any).highlight
                                    ? "comp-prize-card-highlight"
                                    : ""
                                    }`}
                            >
                                <div className="comp-prize-icon">
                                    {iconMap[prize.icon]}
                                </div>
                                <div className="comp-prize-place">
                                    {prize.place}
                                </div>
                                <div className="comp-prize-amount">
                                    {prize.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════ WHY PARTICIPATE ══════ */}
                <section className="comp-why">
                    <div className="comp-section-header">
                        <h2>{c.whyTitle}</h2>
                    </div>
                    <div className="comp-why-grid">
                        {c.why.map((item, i) => (
                            <div key={i} className="comp-why-card">
                                <div className="comp-why-icon">
                                    {iconMap[item.icon]}
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════ REGISTRATION FORM ══════ */}
                <section className="comp-register" id="register">
                    <div className="comp-register-inner">
                        <div className="comp-register-glow" />
                        <Trophy
                            size={52}
                            className="comp-register-trophy"
                        />
                        <h2>{c.formTitle}</h2>
                        <p>{c.formSubtitle}</p>

                        <form
                            className="comp-form"
                            action={`/${validLocale}/contact-us`}
                        >
                            <input
                                type="text"
                                placeholder={c.namePlaceholder}
                                className="comp-input"
                                required
                            />
                            <input
                                type="tel"
                                placeholder={c.phonePlaceholder}
                                className="comp-input"
                                required
                            />
                            <input
                                type="email"
                                placeholder={c.emailPlaceholder}
                                className="comp-input"
                                required
                            />
                            <button type="submit" className="comp-btn-submit">
                                {c.submitBtn}
                            </button>
                        </form>

                        <p className="comp-form-note">{c.formNote}</p>
                    </div>
                </section>
            </div>

            <Footer
                locale={validLocale}
                settings={settings}
                footerLogo={
                    footerContent?.footerLogo ||
                    "https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png"
                }
                footerCopyright={
                    footerContent?.footerCopyright ||
                    (validLocale === "ar"
                        ? "© 2025 اسم الشركة – جميع الحقوق محفوظة"
                        : "© 2025 Company Name – All Rights Reserved")
                }
                companyName={footerContent?.companyName}
                addressLabel={footerContent?.addressLabel}
                addressValue={footerContent?.addressValue}
                phoneLabelInfo={footerContent?.phoneLabelInfo}
                phoneValue={footerContent?.phoneValue}
                showSocialMedia={footerContent?.showSocialMedia}
                instagramLink={footerContent?.instagramLink}
                facebookLink={footerContent?.facebookLink}
                xLink={footerContent?.xLink}
            />
        </FontsProvider>
    );
}
