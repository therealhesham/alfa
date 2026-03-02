import { prisma } from '@/lib/prisma';

export interface EntertainmentContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImages: string[];
  showStats: boolean;
  stat1Icon: string;
  stat1Number: string;
  stat1Label: string;
  stat2Icon: string;
  stat2Number: string;
  stat2Label: string;
  stat3Icon: string;
  stat3Number: string;
  stat3Label: string;
  sectionTitle: string;
  sectionSubtitle: string;
  emptyMessage: string;
}

function parseHeroImages(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((s: any) => typeof s === 'string' && s.trim() !== '') : [];
  } catch {
    return [];
  }
}

export async function getEntertainmentContent(locale: string): Promise<EntertainmentContent> {
  const defaults: EntertainmentContent = {
    heroTitle: locale === 'ar' ? 'عالم الترفيه' : 'Entertainment World',
    heroSubtitle: locale === 'ar'
      ? 'نبتكر تجارب ترفيهية استثنائية تجمع بين أحدث التقنيات والتصاميم الفاخرة لصناعة ذكريات لا تُنسى'
      : 'We create exceptional entertainment experiences combining cutting-edge technology with luxury designs to craft unforgettable memories',
    heroImages: [],
    showStats: true,
    stat1Icon: 'Sparkles', stat1Number: '4+', stat1Label: locale === 'ar' ? 'مشاريع ترفيهية' : 'Entertainment Projects',
    stat2Icon: 'Star', stat2Number: '4', stat2Label: locale === 'ar' ? 'محافظات' : 'Governorates',
    stat3Icon: 'Clapperboard', stat3Number: '100K+', stat3Label: locale === 'ar' ? 'زائر متوقع' : 'Expected Visitors',
    sectionTitle: locale === 'ar' ? 'مشاريعنا الترفيهية' : 'Our Entertainment Projects',
    sectionSubtitle: locale === 'ar'
      ? 'اكتشف مجموعة مشاريعنا الترفيهية المتنوعة التي تلبي جميع الأذواق'
      : 'Explore our diverse entertainment projects that cater to all tastes',
    emptyMessage: locale === 'ar' ? 'لا توجد مشاريع ترفيهية متاحة حالياً' : 'No entertainment projects available at the moment',
  };

  try {
    let content = await prisma.entertainmentContent.findFirst();
    if (!content) {
      content = await prisma.entertainmentContent.create({ data: {} as any });
    }

    const isEn = locale === 'en';
    return {
      heroTitle: isEn ? (content.heroTitleEn || defaults.heroTitle) : (content.heroTitle || defaults.heroTitle),
      heroSubtitle: isEn ? (content.heroSubtitleEn || defaults.heroSubtitle) : (content.heroSubtitle || defaults.heroSubtitle),
      heroImages: parseHeroImages(content.heroImages),
      showStats: content.showStats ?? true,
      stat1Icon: content.stat1Icon || 'Sparkles',
      stat1Number: content.stat1Number || '4+',
      stat1Label: isEn ? (content.stat1LabelEn || defaults.stat1Label) : (content.stat1Label || defaults.stat1Label),
      stat2Icon: content.stat2Icon || 'Star',
      stat2Number: content.stat2Number || '3',
      stat2Label: isEn ? (content.stat2LabelEn || defaults.stat2Label) : (content.stat2Label || defaults.stat2Label),
      stat3Icon: content.stat3Icon || 'Clapperboard',
      stat3Number: content.stat3Number || '100K+',
      stat3Label: isEn ? (content.stat3LabelEn || defaults.stat3Label) : (content.stat3Label || defaults.stat3Label),
      sectionTitle: isEn ? (content.sectionTitleEn || defaults.sectionTitle) : (content.sectionTitle || defaults.sectionTitle),
      sectionSubtitle: isEn ? (content.sectionSubtitleEn || defaults.sectionSubtitle) : (content.sectionSubtitle || defaults.sectionSubtitle),
      emptyMessage: isEn ? (content.emptyMessageEn || defaults.emptyMessage) : (content.emptyMessage || defaults.emptyMessage),
    };
  } catch (error) {
    console.error('Error fetching entertainment content:', error);
    return defaults;
  }
}

export interface GalleryImage {
  image: string;
  caption: string;
  captionEn?: string;
}

export interface EntertainmentProjectRaw {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  fullDescription: string;
  fullDescriptionEn: string;
  image: string;
  gallery: GalleryImage[];
  category: string | null;
  categoryEn: string | null;
  location: string | null;
  locationEn: string | null;
  year: string | null;
  status: string | null;
  statusEn: string | null;
  order: number;
  isPublished: boolean;
}

function parseGallery(galleryJson: string | null): GalleryImage[] {
  if (!galleryJson) return [];
  try {
    const parsed = JSON.parse(galleryJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getEntertainmentProjects(): Promise<EntertainmentProjectRaw[]> {
  try {
    const projects = await prisma.entertainmentProject.findMany({
      where: { isPublished: true },
      orderBy: { order: 'asc' },
    });

    return projects.map((p) => ({
      id: p.id,
      title: p.title,
      titleEn: p.titleEn,
      description: p.description,
      descriptionEn: p.descriptionEn,
      fullDescription: p.fullDescription,
      fullDescriptionEn: p.fullDescriptionEn,
      image: p.image,
      gallery: parseGallery(p.gallery),
      category: p.category,
      categoryEn: p.categoryEn,
      location: p.location,
      locationEn: p.locationEn,
      year: p.year,
      status: p.status,
      statusEn: p.statusEn,
      order: p.order,
      isPublished: p.isPublished,
    }));
  } catch (error) {
    console.error('Error fetching entertainment projects:', error);
    return [];
  }
}

export async function getEntertainmentProjectById(id: string): Promise<EntertainmentProjectRaw | null> {
  try {
    const p = await prisma.entertainmentProject.findUnique({
      where: { id },
    });

    if (!p || !p.isPublished) return null;

    return {
      id: p.id,
      title: p.title,
      titleEn: p.titleEn,
      description: p.description,
      descriptionEn: p.descriptionEn,
      fullDescription: p.fullDescription,
      fullDescriptionEn: p.fullDescriptionEn,
      image: p.image,
      gallery: parseGallery(p.gallery),
      category: p.category,
      categoryEn: p.categoryEn,
      location: p.location,
      locationEn: p.locationEn,
      year: p.year,
      status: p.status,
      statusEn: p.statusEn,
      order: p.order,
      isPublished: p.isPublished,
    };
  } catch (error) {
    console.error('Error fetching entertainment project:', error);
    return null;
  }
}

export function localizeProject(project: EntertainmentProjectRaw, locale: string) {
  return {
    id: project.id,
    title: locale === 'en' ? (project.titleEn || project.title) : project.title,
    description: locale === 'en' ? (project.descriptionEn || project.description) : project.description,
    fullDescription: locale === 'en' ? (project.fullDescriptionEn || project.fullDescription) : project.fullDescription,
    image: project.image,
    category: locale === 'en' ? (project.categoryEn || project.category || '') : (project.category || ''),
    location: locale === 'en' ? (project.locationEn || project.location || '') : (project.location || ''),
    year: project.year || '',
    status: locale === 'en' ? (project.statusEn || project.status || '') : (project.status || ''),
    gallery: project.gallery.map(g => ({
      image: g.image,
      caption: locale === 'en' ? (g.captionEn || g.caption) : g.caption,
    })),
  };
}

export async function getEntertainmentProjectLocalized(id: string, locale: string) {
  const project = await getEntertainmentProjectById(id);
  if (!project) return null;
  return localizeProject(project, locale);
}

export async function getAllEntertainmentProjectsLocalized(locale: string) {
  const projects = await getEntertainmentProjects();
  return projects.map(p => localizeProject(p, locale));
}
