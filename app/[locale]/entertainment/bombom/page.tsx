import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Sun,
  ToyBrick,
  MountainSnow,
  FerrisWheel,
  Castle,
  Brain,
  CheckCircle2,
  ThumbsUp,
  Camera,
  Sparkles,
  PartyPopper,
  Ticket,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { generateSEOMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n";
import { getBombomContent, getBombomPlayZones } from "@/lib/bombom-data";
import BombomZoneGallery from "./BombomZoneGallery";
import BookingModalTrigger from "./BookingModal";

export const revalidate = 60;

const BB_PINK = "#FF1493";
const BB_BLUE = "#00BFFF";
const BB_YELLOW = "#FFD700";
const BB_LIGHT_BLUE = "#E0F7FF";

const DEFAULT_EVENTS_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBd_mp04_37pqtdIle_Yz0cYv97vLiQUQs_FqzXv8Y4O-ULy1O_TZ_JzKAiDfz9OsCEnO8aQV4DwpFx5dQ_mFLS8-LDEk0kD2KMPNG1qBRbstA4r7a19DpUTFe8vqk1aQjSorKHnXMrXnyo5oobbH5lEFLhscJx_xq76m7Er80TWLlNHmYo9K0AAO4AS2zNUDbMRN58FaZO8qIeklSkqhbNyBIBz_aYGi-8srRIbRXdVJP16tbADyCsxUotvgPKStkP_kNdb5DXHHU";
const DEFAULT_FOOTER_LOGO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB4NP_RNEE9emQW5l6SETS7smg4VR_rPeLJlFLElit56JvBIvRrtqcWaq7QTQXsoh_nz_SX8dXr-9jxfo-9643RcsekxHcF2pZc_5p1KkeRkcVR_BN_iwocE9g4vhSbXqQHr4--E3yUX9YayIkOtdQaIEw5l3ILTA6NXDmXWS9x7DNWoNo72mzZa9l9ewoYCcq1lVMVwfTW_1HunyI41cEcBC3JKsV-MNpRo_qvaGF5_xfQ7H2OY5T2d8dvOI-rG_rSzq3v0NKJKSs";

const ICON_MAP: Record<string, LucideIcon> = {
  FerrisWheel,
  Castle,
  Brain,
  Sun,
  ToyBrick,
  MountainSnow,
};

const CLOUD_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M25 40c-5 0-9 4-9 9s4 9 9 9h30c7 0 13-6 13-13s-6-13-13-13c-2 0-4 1-6 2-3-4-8-7-14-7-9 0-16 7-16 16 0 1 0 2 0 3h-4z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E";

const BASE_FONT = '"Changa", "Almarai", sans-serif';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;
  return generateSEOMetadata({
    title: validLocale === "ar" ? "بوم بوم بلاي كيد | عالم المرح والمغامرة" : "Bom Bom Play Kid | World of Fun & Adventure",
    description: validLocale === "ar"
      ? "أهلاً بكم في أسعد مكان على الأرض! حيث تتحول الأحلام إلى حقيقة واللعب هو لغتنا الوحيدة في بوم بوم بلاي كيد."
      : "Welcome to the happiest place on earth! Where dreams come true and play is our only language at Bom Bom Play Kid.",
    locale: validLocale,
    path: "/entertainment/bombom",
    keywords: validLocale === "ar"
      ? ["بوم بوم بلاي كيد", "مناطق لعب", "ألعاب أطفال", "تزحلق", "قلعة قفز", "مركز ترفيهي"]
      : ["Bom Bom Play Kid", "Play Zones", "Kids Games", "Skating", "Jump Castle", "Entertainment Center"],
    type: "website",
  });
}

interface BombomPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BombomPage({ params }: BombomPageProps) {
  const { locale } = await params;
  const isAr = locale === "ar";
  const validLocale = (locale === "ar" || locale === "en" ? locale : "ar") as Locale;

  const [content, zones] = await Promise.all([
    getBombomContent(validLocale),
    getBombomPlayZones(validLocale),
  ]);

  const t = content;

  const pageStyle: React.CSSProperties = {
    fontFamily: BASE_FONT,
    backgroundColor: BB_LIGHT_BLUE,
    backgroundImage: `url("${CLOUD_SVG}")`,
    color: "#1f2937",
    minHeight: "100vh",
    direction: isAr ? "rtl" : "ltr",
  };

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    padding: "1rem 1.5rem",
  };

  const navInnerStyle: React.CSSProperties = {
    maxWidth: "80rem",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    borderRadius: "999px",
    padding: "0.75rem 2rem",
    border: `2px solid rgba(0,191,255,0.2)`,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    position: "relative",
  };

  const cardStyle: React.CSSProperties = {
    background: "#ffffff",
    padding: "2.5rem",
    borderRadius: "3rem",
    border: "6px solid #ffffff",
    boxShadow: "0 15px 35px rgba(0, 191, 255, 0.1)",
    textAlign: "center",
    transition: "transform 0.3s ease",
  };

  const jellyBtnBase: React.CSSProperties = {
    fontFamily: BASE_FONT,
    fontWeight: 900,
    borderRadius: "1rem",
    cursor: "pointer",
    border: "none",
    transition: "transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275)",
    boxShadow: "0 6px 0 rgba(0,0,0,0.1)",
    display: "inline-block",
  };

  return (
    <>
      {/* Body/HTML override — scoped via inline on wrapper */}
      <style>{`
        html, body { background: ${BB_LIGHT_BLUE} !important; overflow-x: hidden; }
        .bb-card:hover { transform: translateY(-1rem); }
        .bb-card-mid { transform: translateY(-2rem); }
        .bb-card-mid:hover { transform: translateY(-3rem); }
        .bb-jelly:hover { transform: scale(1.05) translateY(-2px) !important; box-shadow: 0 10px 0 rgba(0,0,0,0.05) !important; }
        .bb-jelly:active { transform: scale(0.95) translateY(4px) !important; box-shadow: 0 2px 0 rgba(0,0,0,0.1) !important; }
        .bb-icon-spin { animation: bbBounce 2s ease-in-out infinite; }
        @keyframes bbBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @media (max-width: 768px) {
          .bb-grid-3 { grid-template-columns: 1fr !important; }
          .bb-grid-2 { flex-direction: column !important; }
          .bb-card-mid { transform: none !important; }
          .bb-hero-title { font-size: 3.5rem !important; }
          .bb-cta-btns { flex-direction: column !important; align-items: center !important; }
          .bb-footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={pageStyle}>
        {/* ── NAV ── */}
        <nav style={navStyle}>
          <div style={navInnerStyle}>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <Link href={`/${validLocale}/home`} style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "1.1rem", color: BB_BLUE, textDecoration: "none" }}>
                {t.homeLabel}
              </Link>
              <a href="#zones" style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "1.1rem", color: BB_BLUE, textDecoration: "none" }}>
                {t.zonesLabel}
              </a>
            </div>
            <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              <Image alt="Bom Bom Logo" src={t.heroLogo || "/logo.png"} width={80} height={64} unoptimized style={{ height: 64, width: "auto", objectFit: "contain", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))" }} />
            </div>
            <BookingModalTrigger locale={validLocale} className="bb-jelly" style={{ ...jellyBtnBase, background: BB_PINK, color: "#fff", padding: "0.5rem 2rem", fontSize: "1.05rem", borderRadius: "999px", boxShadow: "0 4px 0 rgba(0,0,0,0.15)", textDecoration: "none" }}>
              {t.bookNowLabel}
            </BookingModalTrigger>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "7rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", overflow: "hidden" }}>
          <div className="bb-icon-spin" style={{ position: "absolute", top: "10rem", right: "8%", opacity: 0.6 }}>
            <Sun size={160} color={BB_YELLOW} strokeWidth={2.5} />
          </div>

          <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "56rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: BB_YELLOW, color: BB_PINK, padding: "0.5rem 2rem", borderRadius: "999px", fontFamily: BASE_FONT, fontWeight: 900, fontSize: "1.3rem", marginBottom: "2rem", transform: "rotate(-2deg)", border: "4px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
              {t.tagline}
              <Sparkles size={22} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            </div>
            <h1 className="bb-hero-title" style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "6rem", color: BB_BLUE, lineHeight: 1.1, marginBottom: "1.5rem" }}>
              {isAr ? (
                <>{t.heroTitle1} <span style={{ color: BB_PINK }}>{t.heroBrand}</span><br />{t.heroTitle2}</>
              ) : (
                <><span style={{ color: BB_PINK }}>{t.heroBrand}</span> {t.heroTitle2}</>
              )}
            </h1>
            <p style={{ fontFamily: BASE_FONT, fontSize: "1.4rem", fontWeight: 700, color: "#4b5563", marginBottom: "3rem", lineHeight: 1.7 }}>
              {t.heroDesc}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
              <BookingModalTrigger locale={validLocale} className="bb-jelly" style={{ ...jellyBtnBase, background: BB_PINK, color: "#fff", padding: "1.25rem 3rem", fontSize: "1.5rem", borderRadius: "1.5rem", border: "4px solid #fff", boxShadow: "0 8px 0 rgba(0,0,0,0.1)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                {t.playBtn}
                <PartyPopper size={26} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              </BookingModalTrigger>
              <a href="#zones" className="bb-jelly" style={{ ...jellyBtnBase, background: BB_YELLOW, color: BB_PINK, padding: "1.25rem 3rem", fontSize: "1.5rem", borderRadius: "1.5rem", border: "4px solid #fff", boxShadow: "0 8px 0 rgba(0,0,0,0.1)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                {t.exploreBtn}
                <Sparkles size={26} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              </a>
            </div>
          </div>

          <div style={{ position: "absolute", left: "-5%", bottom: "2.5rem", opacity: 0.15, pointerEvents: "none" }}>
            <ToyBrick size={260} color={BB_BLUE} strokeWidth={1.5} />
          </div>
          <div style={{ position: "absolute", right: "-5%", bottom: "5rem", opacity: 0.15, pointerEvents: "none" }}>
            <MountainSnow size={220} color={BB_PINK} strokeWidth={1.5} />
          </div>
        </section>

        {/* ── GALLERY (above zones) ── */}
        {t.showGallery && (t.gallery?.length ?? 0) > 0 && (
          <section style={{ padding: "6rem 1.5rem", background: "rgba(255,255,255,0.4)", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h2 style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "3rem", color: BB_BLUE, marginBottom: "0.75rem" }}>{t.galleryTitle}</h2>
                <p style={{ fontFamily: BASE_FONT, fontWeight: 700, fontSize: "1.2rem", color: "#6b7280" }}>{t.gallerySub}</p>
              </div>
              <BombomZoneGallery images={t.gallery} variant="main" />
            </div>
          </section>
        )}

        {/* ── ZONES ── */}
        <section id="zones" style={{ padding: "8rem 1.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
              <h2 style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "3.5rem", color: BB_BLUE, marginBottom: "1rem" }}>{t.zonesTitle}</h2>
              <p style={{ fontFamily: BASE_FONT, fontWeight: 700, fontSize: "1.3rem", color: "#6b7280" }}>{t.zonesSub}</p>
            </div>

            <div className="bb-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "start" }}>
              {zones.map((zone, idx) => {
                const ZoneIcon = ICON_MAP[zone.icon] || FerrisWheel;
                const isMid = zones.length >= 3 && idx === 1;
                return (
                  <div
                    key={zone.id}
                    className={`bb-card ${isMid ? "bb-card-mid" : ""}`}
                    style={{ ...cardStyle, ...(isMid ? { boxShadow: "0 20px 50px rgba(255,20,147,0.12)" } : {}) }}
                  >
                    <div style={{ width: 112, height: 112, background: zone.color === BB_PINK ? "#fff" : BB_LIGHT_BLUE, borderRadius: "50%", margin: "0 auto 2rem", display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${zone.color}`, boxShadow: zone.color === BB_PINK ? "inset 0 2px 8px rgba(0,0,0,0.06)" : undefined }}>
                      <ZoneIcon size={56} color={zone.color} strokeWidth={2.5} />
                    </div>
                    <h3 style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "2rem", color: zone.color, marginBottom: "1rem" }}>{zone.title}</h3>
                    <p style={{ fontFamily: BASE_FONT, fontWeight: 700, fontSize: "1rem", color: "#6b7280", marginBottom: "1rem", lineHeight: 1.6 }}>{zone.description}</p>
                    {zone.gallery.length > 0 && (
                      <div style={{ marginBottom: "1.5rem" }}>
                        <BombomZoneGallery images={zone.gallery} variant="card" />
                      </div>
                    )}
                    <BookingModalTrigger locale={validLocale} className="bb-jelly" style={{ ...jellyBtnBase, background: zone.color, color: zone.color === BB_YELLOW ? BB_PINK : "#fff", padding: "1rem 0", width: "100%", fontSize: "1.1rem", borderRadius: "0.75rem", display: "block" }}>{zone.buttonLabel}</BookingModalTrigger>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── EVENTS ── */}
        <section style={{ padding: "8rem 1.5rem", background: "rgba(255,255,255,0.6)" }}>
          <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
            <div className="bb-grid-2" style={{ display: "flex", alignItems: "center", gap: "4rem", background: "#fff", borderRadius: "4rem", padding: "3rem", border: `4px solid rgba(0,191,255,0.08)`, boxShadow: "0 20px 60px rgba(0,191,255,0.06)" }}>
              {/* Image side */}
              <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
                <div style={{ position: "relative", display: "inline-block", width: "100%" }}>
                  <Image
                    alt="Events"
                    src={t.eventsImage || DEFAULT_EVENTS_IMG}
                    width={600}
                    height={400}
                    unoptimized
                    style={{ width: "100%", height: "auto", borderRadius: "3rem", border: `8px solid ${BB_YELLOW}`, boxShadow: "0 20px 60px rgba(0,0,0,0.12)", transform: "rotate(3deg)" }}
                  />
                  <div style={{ position: "absolute", bottom: "-2rem", right: "-2rem", background: BB_PINK, padding: "1.5rem 2rem", borderRadius: "1.5rem", border: "4px solid #fff", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", transform: "rotate(-6deg)", color: "#fff" }}>
                    <p style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "1.5rem", margin: 0 }}>{t.eventBadge1}</p>
                    <p style={{ fontFamily: BASE_FONT, fontWeight: 700, fontSize: "1rem", margin: 0 }}>{t.eventBadge2}</p>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "2.8rem", color: BB_BLUE, marginBottom: "1.25rem", lineHeight: 1.2 }}>
                  {t.eventTitle} <span style={{ color: BB_PINK }}>{t.eventTitleBrand}</span> {t.eventTitle2}
                </h2>
                <p style={{ fontFamily: BASE_FONT, fontWeight: 700, fontSize: "1.2rem", color: "#4b5563", marginBottom: "2rem", lineHeight: 1.8 }}>{t.eventDesc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[t.eventFeat1, t.eventFeat2, t.eventFeat3].map((feat, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", fontFamily: BASE_FONT, fontWeight: 900, fontSize: "1.1rem", color: "#374151" }}>
                      <CheckCircle2 size={28} color={BB_PINK} strokeWidth={2.5} style={{ flexShrink: 0 }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "8rem 1.5rem", background: BB_BLUE, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: `url("${CLOUD_SVG}")`, backgroundSize: "100px 100px", pointerEvents: "none" }} />
          <div style={{ maxWidth: "56rem", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <h2 style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "5rem", color: "#fff", marginBottom: "1.5rem", lineHeight: 1.1, display: "inline-flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
              {t.ctaTitle}
              <PartyPopper size={56} color="#fff" strokeWidth={2.5} style={{ flexShrink: 0 }} />
            </h2>
            <p style={{ fontFamily: BASE_FONT, fontWeight: 700, fontSize: "1.5rem", color: "rgba(255,255,255,0.9)", marginBottom: "3rem", lineHeight: 1.6 }}>{t.ctaDesc}</p>
            <div className="bb-cta-btns" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
              <BookingModalTrigger locale={validLocale} className="bb-jelly" style={{ ...jellyBtnBase, background: BB_YELLOW, color: BB_PINK, padding: "1.5rem 4rem", fontSize: "1.8rem", borderRadius: "2rem", border: "4px solid #fff", boxShadow: "0 8px 0 rgba(0,0,0,0.1)", display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                {t.ctaBtn1}
                <Ticket size={28} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              </BookingModalTrigger>
              <Link href={t.contactUrl || `/${validLocale}/contact`} className="bb-jelly" style={{ ...jellyBtnBase, background: "#fff", color: BB_BLUE, padding: "1.5rem 4rem", fontSize: "1.8rem", borderRadius: "2rem", border: `4px solid ${BB_BLUE}`, boxShadow: "0 8px 0 rgba(0,0,0,0.1)", display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
                {t.ctaBtn2}
                <Phone size={28} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "#fff", padding: "6rem 1.5rem 3rem", borderTop: `8px solid ${BB_YELLOW}`, color: "#1f2937" }}>
          <div className="bb-footer-grid" style={{ maxWidth: "80rem", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3rem", marginBottom: "4rem" }}>
            <div>
              <Image alt="Footer Logo" src={t.footerLogo || DEFAULT_FOOTER_LOGO} width={120} height={96} unoptimized style={{ height: 80, width: "auto", objectFit: "contain", marginBottom: "1.5rem" }} />
              <p style={{ fontFamily: BASE_FONT, fontWeight: 700, fontSize: "1rem", color: "#6b7280", lineHeight: 1.7 }}>{t.footerDesc}</p>
            </div>
            <div>
              <h5 style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "1.3rem", color: BB_BLUE, marginBottom: "1.5rem" }}>{t.footerExplore}</h5>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li><Link href={`/${validLocale}/entertainment/bombom`} style={{ fontFamily: BASE_FONT, fontWeight: 700, color: "#374151", textDecoration: "none" }}>{t.footerAbout}</Link></li>
                <li><a href="#zones" style={{ fontFamily: BASE_FONT, fontWeight: 700, color: "#374151", textDecoration: "none" }}>{t.footerZones}</a></li>
                <li><Link href={`/${validLocale}/entertainment/bombom`} style={{ fontFamily: BASE_FONT, fontWeight: 700, color: "#374151", textDecoration: "none" }}>{t.footerPrices}</Link></li>
              </ul>
            </div>
            <div>
              <h5 style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "1.3rem", color: BB_PINK, marginBottom: "1.5rem" }}>{t.footerContact}</h5>
              <p style={{ fontFamily: BASE_FONT, fontWeight: 700, color: "#6b7280", marginBottom: "0.5rem" }}>{t.footerCountry}</p>
              <p style={{ fontFamily: BASE_FONT, fontWeight: 700, color: "#6b7280" }}>{t.footerPhone}</p>
            </div>
            <div>
              <h5 style={{ fontFamily: BASE_FONT, fontWeight: 900, fontSize: "1.3rem", color: BB_YELLOW, marginBottom: "1.5rem" }}>{t.footerFollow}</h5>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {t.instagramLink && (
                  <a href={t.instagramLink} target="_blank" rel="noopener noreferrer" style={{ width: 52, height: 52, background: BB_LIGHT_BLUE, borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", color: BB_BLUE, textDecoration: "none" }}>
                    <Camera size={22} color={BB_BLUE} strokeWidth={2.5} />
                  </a>
                )}
                {t.facebookLink && (
                  <a href={t.facebookLink} target="_blank" rel="noopener noreferrer" style={{ width: 52, height: 52, background: BB_LIGHT_BLUE, borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", color: BB_BLUE, textDecoration: "none" }}>
                    <ThumbsUp size={22} color={BB_BLUE} strokeWidth={2.5} />
                  </a>
                )}
                {!t.instagramLink && !t.facebookLink && (
                  <>
                    <a href="#" style={{ width: 52, height: 52, background: BB_LIGHT_BLUE, borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", color: BB_BLUE, textDecoration: "none" }}>
                      <ThumbsUp size={22} color={BB_BLUE} strokeWidth={2.5} />
                    </a>
                    <a href="#" style={{ width: 52, height: 52, background: BB_LIGHT_BLUE, borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", color: BB_BLUE, textDecoration: "none" }}>
                      <Camera size={22} color={BB_BLUE} strokeWidth={2.5} />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: BASE_FONT, fontWeight: 700, color: "#9ca3af" }}>{t.copyright}</p>
          </div>
        </footer>
      </div>
    </>
  );
}
