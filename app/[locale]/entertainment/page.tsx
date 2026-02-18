import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "@/lib/i18n";
import { getSiteSettings, getFooterContent } from "@/lib/data";
import { generateSEOMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FontsProvider from "@/components/FontsProvider";
import {
    Shield,
    Star,
    Crown,
    Heart,
    Sparkles,
    Music,
    Gamepad2,
    Palette,
    Users,
} from "lucide-react";
import type { Locale } from "@/i18n";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

// ─── Bilingual Content ───────────────────────────────────────────────
const content = {
    ar: {
        heroTitle: "عالم الترفيه",
        heroSubtitle:
            "نقدّم تجارب ترفيهية استثنائية تجمع بين الفخامة والمتعة لجميع أفراد العائلة",
        categoriesTitle: "قطاعاتنا الترفيهية",
        categoriesSubtitle:
            "نوادٍ راقية، مدن ملاهٍ عالمية، ومناطق ترفيهية مخصصة للأطفال",
        clubs: {
            title: "النوادي والصالات",
            desc: "أجواء فاخرة وتجارب اجتماعية راقية في فضاءات مصممة بأعلى المعايير",
        },
        parks: {
            title: "مدن الملاهي",
            desc: "مغامرات مثيرة وعوالم خيالية لكل الأعمار مع أحدث الألعاب العالمية",
        },
        kids: {
            title: "منطقة الأطفال",
            desc: "بيئة آمنة وممتعة تنمّي إبداع الأطفال وتمنحهم ذكريات لا تُنسى",
        },
        featuresTitle: "لماذا نتميّز",
        features: [
            { icon: "Crown", label: "تجربة VIP" },
            { icon: "Shield", label: "أعلى معايير السلامة" },
            { icon: "Star", label: "مرافق عالمية" },
            { icon: "Heart", label: "صديق للعائلة" },
        ],
        galleryTitle: "من أجواء مشاريعنا",
        ctaTitle: "ابدأ مشروعك الترفيهي معنا",
        ctaSubtitle:
            "تواصل مع فريقنا لتحويل رؤيتك إلى واقع ترفيهي استثنائي",
        ctaButton: "تواصل معنا",
    },
    en: {
        heroTitle: "Entertainment World",
        heroSubtitle:
            "We deliver exceptional entertainment experiences that combine luxury and fun for the whole family",
        categoriesTitle: "Our Entertainment Sectors",
        categoriesSubtitle:
            "Premium clubs, world-class amusement parks, and dedicated kids' zones",
        clubs: {
            title: "Clubs & Lounges",
            desc: "Luxurious ambiance and premium social experiences in spaces designed to the highest standards",
        },
        parks: {
            title: "Amusement Parks",
            desc: "Thrilling adventures and fantasy worlds for all ages with state-of-the-art rides",
        },
        kids: {
            title: "Kids Zone",
            desc: "A safe and fun environment that nurtures children's creativity and gives them unforgettable memories",
        },
        featuresTitle: "Why We Stand Out",
        features: [
            { icon: "Crown", label: "VIP Experience" },
            { icon: "Shield", label: "Top Safety Standards" },
            { icon: "Star", label: "World-Class Facilities" },
            { icon: "Heart", label: "Family Friendly" },
        ],
        galleryTitle: "From Our Projects",
        ctaTitle: "Start Your Entertainment Project With Us",
        ctaSubtitle:
            "Contact our team to turn your vision into an exceptional entertainment reality",
        ctaButton: "Contact Us",
    },
};

// ─── Images (Unsplash) ──────────────────────────────────────────────
const images = {
    hero: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1920&q=80&auto=format",
    clubs:
        "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80&auto=format",
    parks:
        "https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?w=800&q=80&auto=format",
    kids: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=800&q=80&auto=format",
    gallery: [
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80&auto=format",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80&auto=format",
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80&auto=format",
        "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=600&q=80&auto=format",
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&q=80&auto=format",
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80&auto=format",
    ],
};

// ─── Icon Map ────────────────────────────────────────────────────────
const iconMap: Record<string, React.ReactNode> = {
    Crown: <Crown size={32} />,
    Shield: <Shield size={32} />,
    Star: <Star size={32} />,
    Heart: <Heart size={32} />,
};

// ─── SEO Metadata ────────────────────────────────────────────────────
export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const validLocale = (
        locale === "ar" || locale === "en" ? locale : "ar"
    ) as Locale;

    const title =
        validLocale === "ar"
            ? "الترفيه - ظلال المدينة | عالم الترفيه"
            : "Entertainment - City Shadows | Entertainment World";

    const description =
        validLocale === "ar"
            ? "قطاع الترفيه في شركة ظلال المدينة: نوادٍ راقية، مدن ملاهٍ عالمية، ومناطق ترفيه مخصصة للأطفال. فخامة وترفيه لكل العائلة."
            : "City Shadows entertainment sector: premium clubs, world-class amusement parks, and dedicated kids zones. Luxury and fun for the whole family.";

    return generateSEOMetadata({
        title,
        description,
        locale: validLocale,
        path: "/entertainment",
        keywords:
            validLocale === "ar"
                ? [
                    "ترفيه",
                    "نوادي",
                    "ملاهي",
                    "أطفال",
                    "ظلال المدينة",
                    "مدن ترفيهية",
                ]
                : [
                    "Entertainment",
                    "Clubs",
                    "Amusement Parks",
                    "Kids",
                    "City Shadows",
                ],
    });
}

// ─── Page Component ──────────────────────────────────────────────────
interface EntertainmentPageProps {
    params: Promise<{ locale: string }>;
}

export default async function EntertainmentPage({
    params,
}: EntertainmentPageProps) {
    const { locale } = await params;
    const validLocale = (
        locale === "ar" || locale === "en" ? locale : "ar"
    ) as Locale;
    const t = getTranslations(validLocale);
    const c = content[validLocale];

    const [settings, footerContent] = await Promise.all([
        getSiteSettings(),
        getFooterContent(validLocale),
    ]);

    const categoryCards = [
        {
            ...c.clubs,
            image: images.clubs,
            icon: <Music size={36} />,
        },
        {
            ...c.parks,
            image: images.parks,
            icon: <Gamepad2 size={36} />,
        },
        {
            ...c.kids,
            image: images.kids,
            icon: <Palette size={36} />,
        },
    ];

    return (
        <FontsProvider settings={settings}>
            <Header locale={validLocale} settings={settings} />

            <div className="entertainment-page">
                {/* ════════ HERO ════════ */}
                <div className="entertainment-hero">
                    <Image
                        src={images.hero}
                        alt={c.heroTitle}
                        fill
                        style={{ objectFit: "cover" }}
                        priority
                        unoptimized
                    />
                    <div className="entertainment-hero-overlay" />
                    <div className="entertainment-hero-content">
                        <div className="entertainment-hero-badge">
                            {/* <Sparkles size={18} /> */}
                            <span>
                                {validLocale === "ar"
                                    ? "قطاع الترفيه"
                                    : "Entertainment Sector"}
                            </span>
                        </div>
                        <h1>{c.heroTitle}</h1>
                        <p>{c.heroSubtitle}</p>
                    </div>
                </div>

                {/* ════════ CATEGORIES ════════ */}
                <div className="entertainment-categories">
                    <div className="entertainment-section-header">
                        <h2>{c.categoriesTitle}</h2>
                        <p>{c.categoriesSubtitle}</p>
                    </div>
                    <div className="entertainment-cards-grid">
                        {categoryCards.map((card, i) => (
                            <div key={i} className="entertainment-card">
                                <div className="entertainment-card-image">
                                    <Image
                                        src={card.image}
                                        alt={card.title}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        unoptimized
                                    />
                                    <div className="entertainment-card-image-overlay" />
                                </div>
                                <div className="entertainment-card-body">
                                    <div className="entertainment-card-icon">{card.icon}</div>
                                    <h3>{card.title}</h3>
                                    <p>{card.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════════ FEATURES ════════ */}
                <div className="entertainment-features">
                    <h2>{c.featuresTitle}</h2>
                    <div className="entertainment-features-grid">
                        {c.features.map((f, i) => (
                            <div key={i} className="entertainment-feature-item">
                                <div className="entertainment-feature-icon">
                                    {iconMap[f.icon]}
                                </div>
                                <span>{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════════ GALLERY ════════ */}
                <div className="entertainment-gallery">
                    <div className="entertainment-section-header">
                        <h2>{c.galleryTitle}</h2>
                    </div>
                    <div className="entertainment-gallery-grid">
                        {images.gallery.map((src, i) => (
                            <div
                                key={i}
                                className={`entertainment-gallery-item ${i === 0 || i === 3
                                    ? "entertainment-gallery-item-large"
                                    : ""
                                    }`}
                            >
                                <Image
                                    src={src}
                                    alt={`${c.galleryTitle} ${i + 1}`}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ════════ CTA ════════ */}
                <div className="entertainment-cta">
                    <div className="entertainment-cta-inner">
                        <Users size={48} className="entertainment-cta-icon" />
                        <h2>{c.ctaTitle}</h2>
                        <p>{c.ctaSubtitle}</p>
                        <Link
                            href={`/${validLocale}/contact-us`}
                            className="entertainment-cta-button"
                        >
                            {c.ctaButton}
                        </Link>
                    </div>
                </div>
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
