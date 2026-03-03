import { prisma } from '@/lib/prisma';
import type { Locale } from '@/i18n';

export interface BombomContentLocalized {
  id: string;
  homeLabel: string;
  zonesLabel: string;
  bookNowLabel: string;
  heroLogo: string;
  tagline: string;
  heroTitle1: string;
  heroBrand: string;
  heroTitle2: string;
  heroDesc: string;
  playBtn: string;
  exploreBtn: string;
  galleryTitle: string;
  gallerySub: string;
  gallery: { image: string; caption: string }[];
  showGallery: boolean;
  zonesTitle: string;
  zonesSub: string;
  eventsImage: string;
  eventTitle: string;
  eventTitleBrand: string;
  eventTitle2: string;
  eventDesc: string;
  eventFeat1: string;
  eventFeat2: string;
  eventFeat3: string;
  eventBadge1: string;
  eventBadge2: string;
  ctaTitle: string;
  ctaDesc: string;
  ctaBtn1: string;
  ctaBtn2: string;
  bookTicketUrl: string | null;
  contactUrl: string | null;
  footerLogo: string;
  footerDesc: string;
  footerExplore: string;
  footerAbout: string;
  footerZones: string;
  footerPrices: string;
  footerContact: string;
  footerCountry: string;
  footerPhone: string;
  footerFollow: string;
  instagramLink: string | null;
  facebookLink: string | null;
  copyright: string;
}

export interface BombomPlayZoneLocalized {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  icon: string;
  color: string;
  gallery: { image: string; caption: string }[];
  order: number;
}

const DEFAULT_BOMBOM_CONTENT = {
  heroDesc: 'أهلاً بكم في أسعد مكان على الأرض! حيث تتحول الأحلام إلى حقيقة واللعب هو لغتنا الوحيدة.',
  heroDescEn: "Welcome to the happiest place on earth! Where dreams come true and play is our only language.",
  eventDesc: 'نحول عيد ميلاد طفلك إلى يوم لا ينسى مليء بالمفاجآت والنشاطات الحركية الممتعة.',
  eventDescEn: "We turn your child's birthday into an unforgettable day full of surprises and fun activities.",
  ctaDesc: 'احجز مكان طفلك الآن في بوم بوم بلاي كيد واستعد ليوم مليء بالبهجة!',
  ctaDescEn: "Book your child's spot now at Bom Bom Play Kid and get ready for a day full of joy!",
  footerDesc: 'بوم بوم بلاي كيد: حيث تبدأ أعظم مغامرات الأطفال الحركية والذهنية.',
  footerDescEn: 'Bom Bom Play Kid: Where the greatest adventures of children begin.',
};

const DEFAULT_ZONES = [
  { title: 'منطقة التزحلق', titleEn: 'Skating Zone', description: 'استمتع بأطول المنزلقات الملونة التي تأخذك إلى عالم من الضحك!', descriptionEn: 'Enjoy the longest colorful slides that take you to a world of laughter!', buttonLabel: 'استكشف الآن', buttonLabelEn: 'Explore Now', icon: 'FerrisWheel', color: '#00BFFF', order: 0 },
  { title: 'قلعة القفز', titleEn: 'Jump Castle', description: 'اقفز عالياً بين الغيوم في قلعتنا المطاطية الضخمة والآمنة تماماً.', descriptionEn: 'Jump high among the clouds in our huge, completely safe rubber castle.', buttonLabel: 'ابدأ القفز', buttonLabelEn: 'Start Jumping', icon: 'Castle', color: '#FF1493', order: 1 },
  { title: 'ركن الأذكياء', titleEn: 'Smart Corner', description: 'مجموعة من الألعاب التعليمية والمكعبات لبناء مدينتك الخيالية الخاصة.', descriptionEn: 'Educational games and blocks to build your own imaginary city.', buttonLabel: 'هيا نبني', buttonLabelEn: "Let's Build", icon: 'Brain', color: '#FFD700', order: 2 },
];

function localizeBombomContent(row: {
  id: string;
  homeLabel: string;
  homeLabelEn: string;
  zonesLabel: string;
  zonesLabelEn: string;
  bookNowLabel: string;
  bookNowLabelEn: string;
  heroLogo: string;
  tagline: string;
  taglineEn: string;
  heroTitle1: string;
  heroTitle1En: string;
  heroBrand: string;
  heroBrandEn: string;
  heroTitle2: string;
  heroTitle2En: string;
  heroDesc: string;
  heroDescEn: string;
  playBtn: string;
  playBtnEn: string;
  exploreBtn: string;
  exploreBtnEn: string;
  galleryTitle?: string;
  galleryTitleEn?: string;
  gallerySub?: string;
  gallerySubEn?: string;
  gallery?: string | null;
  showGallery?: boolean;
  zonesTitle: string;
  zonesTitleEn: string;
  zonesSub: string;
  zonesSubEn: string;
  eventsImage: string;
  eventTitle: string;
  eventTitleEn: string;
  eventTitleBrand: string;
  eventTitleBrandEn: string;
  eventTitle2: string;
  eventTitle2En: string;
  eventDesc: string;
  eventDescEn: string;
  eventFeat1: string;
  eventFeat1En: string;
  eventFeat2: string;
  eventFeat2En: string;
  eventFeat3: string;
  eventFeat3En: string;
  eventBadge1: string;
  eventBadge1En: string;
  eventBadge2: string;
  eventBadge2En: string;
  ctaTitle: string;
  ctaTitleEn: string;
  ctaDesc: string;
  ctaDescEn: string;
  ctaBtn1: string;
  ctaBtn1En: string;
  ctaBtn2: string;
  ctaBtn2En: string;
  bookTicketUrl: string | null;
  contactUrl: string | null;
  footerLogo: string;
  footerDesc: string;
  footerDescEn: string;
  footerExplore: string;
  footerExploreEn: string;
  footerAbout: string;
  footerAboutEn: string;
  footerZones: string;
  footerZonesEn: string;
  footerPrices: string;
  footerPricesEn: string;
  footerContact: string;
  footerContactEn: string;
  footerCountry: string;
  footerCountryEn: string;
  footerPhone: string;
  footerPhoneEn: string;
  footerFollow: string;
  footerFollowEn: string;
  instagramLink: string | null;
  facebookLink: string | null;
  copyright: string;
  copyrightEn: string;
}, locale: Locale): BombomContentLocalized {
  const isEn = locale === 'en';
  return {
    id: row.id,
    homeLabel: isEn ? row.homeLabelEn : row.homeLabel,
    zonesLabel: isEn ? row.zonesLabelEn : row.zonesLabel,
    bookNowLabel: isEn ? row.bookNowLabelEn : row.bookNowLabel,
    heroLogo: row.heroLogo,
    tagline: isEn ? row.taglineEn : row.tagline,
    heroTitle1: isEn ? row.heroTitle1En : row.heroTitle1,
    heroBrand: isEn ? row.heroBrandEn : row.heroBrand,
    heroTitle2: isEn ? row.heroTitle2En : row.heroTitle2,
    heroDesc: isEn ? row.heroDescEn : row.heroDesc,
    playBtn: isEn ? row.playBtnEn : row.playBtn,
    exploreBtn: isEn ? row.exploreBtnEn : row.exploreBtn,
    galleryTitle: isEn ? (row.galleryTitleEn ?? 'Photo Gallery') : (row.galleryTitle ?? 'معرض الصور'),
    gallerySub: isEn ? (row.gallerySubEn ?? 'Discover Bom Bom world through photos') : (row.gallerySub ?? 'اكتشف عالم بوم بوم من خلال الصور'),
    gallery: (() => {
      try {
        return row.gallery ? (JSON.parse(row.gallery) as { image: string; caption: string }[]) : [];
      } catch { return []; }
    })(),
    showGallery: row.showGallery ?? true,
    zonesTitle: isEn ? row.zonesTitleEn : row.zonesTitle,
    zonesSub: isEn ? row.zonesSubEn : row.zonesSub,
    eventsImage: row.eventsImage,
    eventTitle: isEn ? row.eventTitleEn : row.eventTitle,
    eventTitleBrand: isEn ? row.eventTitleBrandEn : row.eventTitleBrand,
    eventTitle2: isEn ? row.eventTitle2En : row.eventTitle2,
    eventDesc: isEn ? row.eventDescEn : row.eventDesc,
    eventFeat1: isEn ? row.eventFeat1En : row.eventFeat1,
    eventFeat2: isEn ? row.eventFeat2En : row.eventFeat2,
    eventFeat3: isEn ? row.eventFeat3En : row.eventFeat3,
    eventBadge1: isEn ? row.eventBadge1En : row.eventBadge1,
    eventBadge2: isEn ? row.eventBadge2En : row.eventBadge2,
    ctaTitle: isEn ? row.ctaTitleEn : row.ctaTitle,
    ctaDesc: isEn ? row.ctaDescEn : row.ctaDesc,
    ctaBtn1: isEn ? row.ctaBtn1En : row.ctaBtn1,
    ctaBtn2: isEn ? row.ctaBtn2En : row.ctaBtn2,
    bookTicketUrl: row.bookTicketUrl,
    contactUrl: row.contactUrl,
    footerLogo: row.footerLogo,
    footerDesc: isEn ? row.footerDescEn : row.footerDesc,
    footerExplore: isEn ? row.footerExploreEn : row.footerExplore,
    footerAbout: isEn ? row.footerAboutEn : row.footerAbout,
    footerZones: isEn ? row.footerZonesEn : row.footerZones,
    footerPrices: isEn ? row.footerPricesEn : row.footerPrices,
    footerContact: isEn ? row.footerContactEn : row.footerContact,
    footerCountry: isEn ? row.footerCountryEn : row.footerCountry,
    footerPhone: isEn ? row.footerPhoneEn : row.footerPhone,
    footerFollow: isEn ? row.footerFollowEn : row.footerFollow,
    instagramLink: row.instagramLink,
    facebookLink: row.facebookLink,
    copyright: isEn ? row.copyrightEn : row.copyright,
  };
}

export async function getBombomContent(locale: Locale): Promise<BombomContentLocalized> {
  let content = await prisma.bombomContent.findFirst();

  if (!content) {
    content = await prisma.bombomContent.create({
      data: {
        ...DEFAULT_BOMBOM_CONTENT,
      },
    });
  }

  return localizeBombomContent(content as Parameters<typeof localizeBombomContent>[0], locale);
}

export async function getBombomPlayZones(locale: Locale): Promise<BombomPlayZoneLocalized[]> {
  let zones = await prisma.bombomPlayZone.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
  });

  if (zones.length === 0) {
    await prisma.bombomPlayZone.createMany({
      data: DEFAULT_ZONES,
    });
    zones = await prisma.bombomPlayZone.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });
  }

  const isEn = locale === 'en';
  return zones.map((z) => {
    let gallery: { image: string; caption: string }[] = [];
    try {
      if (z.gallery) gallery = JSON.parse(z.gallery) as { image: string; caption: string }[];
    } catch {
      // ignore
    }
    return {
      id: z.id,
      title: isEn ? z.titleEn : z.title,
      description: isEn ? z.descriptionEn : z.description,
      buttonLabel: isEn ? z.buttonLabelEn : z.buttonLabel,
      icon: z.icon,
      color: z.color,
      gallery,
      order: z.order,
    };
  });
}
