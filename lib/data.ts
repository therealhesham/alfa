import { prisma } from '@/lib/prisma';
import type { Locale } from '@/i18n';

export interface HomeContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroLogo: string;
  aboutTitle: string;
  aboutP1: string;
  aboutP2: string;
  visionTitle: string;
  visionVision: string;
  visionVisionText: string;
  visionMission: string;
  visionMissionText: string;
  visionValues: string;
  visionValuesText: string;
  quoteTitle: string;
  quoteText: string;
  quoteAuthor: string;
  statsTitle: string;
  statsProjects: string;
  statsYears: string;
  statsCountries: string;
  statsAwards: string;
  statsProjectsNum: string;
  statsYearsNum: string;
  statsCountriesNum: string;
  statsAwardsNum: string;
  servicesTitle: string;
  servicesSubtitle: string;
  service1Title: string;
  service1Desc: string;
  service2Title: string;
  service2Desc: string;
  service3Title: string;
  service3Desc: string;
  service4Title: string;
  service4Desc: string;
  projectsTitle: string;
  projectsSubtitle: string;
  projectsViewMore: string;
  project1Title: string;
  project1Desc: string;
  project1Image: string;
  project2Title: string;
  project2Desc: string;
  project2Image: string;
  project3Title: string;
  project3Desc: string;
  project3Image: string;
  footerCopyright: string;
  footerLogo: string;
  headerLogo: string;
}

export interface AboutUsContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  storyTitle: string;
  storyContent: string;
  storyImage: string;
  missionTitle: string;
  missionContent: string;
  visionTitle: string;
  visionContent: string;
  whyChooseTitle: string;
  whyChoosePoint1: string;
  whyChoosePoint2: string;
  whyChoosePoint3: string;
  whyChoosePoint4: string;
  valuesTitle: string;
  valuesContent: string;
  milestone1Year: string;
  milestone1Title: string;
  milestone1Desc: string;
  milestone2Year: string;
  milestone2Title: string;
  milestone2Desc: string;
  milestone3Year: string;
  milestone3Title: string;
  milestone3Desc: string;
  milestone4Year: string;
  milestone4Title: string;
  milestone4Desc: string;
  foundersTitle: string;
  founder1Name: string;
  founder1Position: string;
  founder1Image: string;
  founder1Bio: string;
  founder2Name: string;
  founder2Position: string;
  founder2Image: string;
  founder2Bio: string;
}

export interface ContactUsContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  formTitle: string;
  nameLabel: string;
  emailLabel: string;
  phoneLabel: string;
  subjectLabel: string;
  messageLabel: string;
  sendButton: string;
  sendingButton: string;
  infoTitle: string;
  infoDescription: string;
  addressLabel: string;
  addressValue: string;
  phoneLabelInfo: string;
  phoneValue: string;
  emailLabelInfo: string;
  emailValue: string;
  hoursLabel: string;
  hoursValue: string;
  successMessage: string;
  errorMessage: string;
  requiredField: string;
  invalidEmail: string;
}

export interface SiteSettings {
  id: string;
  primaryFont: string;
  headingFont: string;
  bodyFont: string;
  showHome: boolean;
  showAbout: boolean;
  showServices: boolean;
  showProjects: boolean;
  showContact: boolean;
  showLanguageSwitcher: boolean;
  whatsappNumber: string | null;
}

export async function getHomeContent(locale: Locale): Promise<HomeContent | null> {
  try {
    let content = await prisma.homeContent.findFirst();
    
    if (!content) {
      content = await prisma.homeContent.create({
        data: {
          aboutP1: '',
          aboutP1En: '',
          aboutP2: '',
          aboutP2En: '',
          visionVisionText: '',
          visionVisionTextEn: '',
          visionMissionText: '',
          visionMissionTextEn: '',
          quoteText: '',
          quoteTextEn: '',
          service1Desc: '',
          service1DescEn: '',
          service2Desc: '',
          service2DescEn: '',
          service3Desc: '',
          service3DescEn: '',
          service4Desc: '',
          service4DescEn: '',
          project1Desc: '',
          project1DescEn: '',
          project2Desc: '',
          project2DescEn: '',
          project3Desc: '',
          project3DescEn: '',
        },
      });
    }
    
    if (locale === 'en') {
      const contentAny = content as any;
      return {
        id: content.id,
        heroTitle: contentAny.heroTitleEn || '',
        heroSubtitle: contentAny.heroSubtitleEn || '',
        heroLogo: content.heroLogo || '',
        aboutTitle: contentAny.aboutTitleEn || '',
        aboutP1: contentAny.aboutP1En || '',
        aboutP2: contentAny.aboutP2En || '',
        visionTitle: contentAny.visionTitleEn || '',
        visionVision: contentAny.visionVisionEn || '',
        visionVisionText: contentAny.visionVisionTextEn || '',
        visionMission: contentAny.visionMissionEn || '',
        visionMissionText: contentAny.visionMissionTextEn || '',
        visionValues: contentAny.visionValuesEn || '',
        visionValuesText: contentAny.visionValuesTextEn || '',
        quoteTitle: contentAny.quoteTitleEn ?? '',
        quoteText: contentAny.quoteTextEn ?? '',
        quoteAuthor: contentAny.quoteAuthorEn ?? '',
        statsTitle: contentAny.statsTitleEn || '',
        statsProjects: contentAny.statsProjectsEn || '',
        statsYears: contentAny.statsYearsEn || '',
        statsCountries: contentAny.statsCountriesEn || '',
        statsAwards: contentAny.statsAwardsEn || '',
        statsProjectsNum: content.statsProjectsNum || '',
        statsYearsNum: content.statsYearsNum || '',
        statsCountriesNum: content.statsCountriesNum || '',
        statsAwardsNum: content.statsAwardsNum || '',
        servicesTitle: contentAny.servicesTitleEn || '',
        servicesSubtitle: contentAny.servicesSubtitleEn || '',
        service1Title: contentAny.service1TitleEn || '',
        service1Desc: contentAny.service1DescEn || '',
        service2Title: contentAny.service2TitleEn || '',
        service2Desc: contentAny.service2DescEn || '',
        service3Title: contentAny.service3TitleEn || '',
        service3Desc: contentAny.service3DescEn || '',
        service4Title: contentAny.service4TitleEn || '',
        service4Desc: contentAny.service4DescEn || '',
        projectsTitle: contentAny.projectsTitleEn || '',
        projectsSubtitle: contentAny.projectsSubtitleEn || '',
        projectsViewMore: contentAny.projectsViewMoreEn || '',
        project1Title: contentAny.project1TitleEn || '',
        project1Desc: contentAny.project1DescEn || '',
        project1Image: content.project1Image || '',
        project2Title: contentAny.project2TitleEn || '',
        project2Desc: contentAny.project2DescEn || '',
        project2Image: content.project2Image || '',
        project3Title: contentAny.project3TitleEn || '',
        project3Desc: contentAny.project3DescEn || '',
        project3Image: content.project3Image || '',
        footerCopyright: contentAny.footerCopyrightEn || '',
        footerLogo: content.footerLogo || '',
        headerLogo: content.headerLogo || '',
      };
    }
    
    const contentAny = content as any;
    return {
      id: content.id,
      heroTitle: content.heroTitle || '',
      heroSubtitle: content.heroSubtitle || '',
      heroLogo: content.heroLogo || '',
      aboutTitle: content.aboutTitle || '',
      aboutP1: content.aboutP1 || '',
      aboutP2: content.aboutP2 || '',
      visionTitle: content.visionTitle || '',
      visionVision: content.visionVision || '',
      visionVisionText: content.visionVisionText || '',
      visionMission: content.visionMission || '',
      visionMissionText: content.visionMissionText || '',
      visionValues: content.visionValues || '',
      visionValuesText: content.visionValuesText || '',
      quoteTitle: contentAny.quoteTitle ?? '',
      quoteText: contentAny.quoteText ?? '',
      quoteAuthor: contentAny.quoteAuthor ?? '',
      statsTitle: content.statsTitle || '',
      statsProjects: content.statsProjects || '',
      statsYears: content.statsYears || '',
      statsCountries: content.statsCountries || '',
      statsAwards: content.statsAwards || '',
      statsProjectsNum: content.statsProjectsNum || '',
      statsYearsNum: content.statsYearsNum || '',
      statsCountriesNum: content.statsCountriesNum || '',
      statsAwardsNum: content.statsAwardsNum || '',
      servicesTitle: contentAny.servicesTitle || '',
      servicesSubtitle: contentAny.servicesSubtitle || '',
      service1Title: contentAny.service1Title || '',
      service1Desc: contentAny.service1Desc || '',
      service2Title: contentAny.service2Title || '',
      service2Desc: contentAny.service2Desc || '',
      service3Title: contentAny.service3Title || '',
      service3Desc: contentAny.service3Desc || '',
      service4Title: contentAny.service4Title || '',
      service4Desc: contentAny.service4Desc || '',
      projectsTitle: contentAny.projectsTitle || '',
      projectsSubtitle: contentAny.projectsSubtitle || '',
      projectsViewMore: contentAny.projectsViewMore || '',
      project1Title: contentAny.project1Title || '',
      project1Desc: contentAny.project1Desc || '',
      project1Image: contentAny.project1Image || '',
      project2Title: contentAny.project2Title || '',
      project2Desc: contentAny.project2Desc || '',
      project2Image: contentAny.project2Image || '',
      project3Title: contentAny.project3Title || '',
      project3Desc: contentAny.project3Desc || '',
      project3Image: contentAny.project3Image || '',
      footerCopyright: content.footerCopyright || '',
      footerLogo: content.footerLogo || '',
      headerLogo: content.headerLogo || '',
    };
  } catch (error) {
    console.error('Error fetching home content:', error);
    return null;
  }
}

export async function getAboutUsContent(locale: Locale): Promise<AboutUsContent | null> {
  try {
    let content = await prisma.aboutUs.findFirst();
    
    if (!content) {
      content = await prisma.aboutUs.create({
        data: {
          heroSubtitleEn: '',
          storyContent: '',
          storyContentEn: '',
          missionContent: '',
          missionContentEn: '',
          visionContent: '',
          visionContentEn: '',
          milestone1Desc: '',
          milestone1DescEn: '',
          milestone2Desc: '',
          milestone2DescEn: '',
          milestone3Desc: '',
          milestone3DescEn: '',
          milestone4Desc: '',
          milestone4DescEn: '',
          founder1Bio: '',
          founder1BioEn: '',
          founder2Bio: '',
          founder2BioEn: '',
        },
      });
    }
    
    if (locale === 'en') {
      const contentAny = content as any;
      return {
        id: content.id,
        heroTitle: contentAny.heroTitleEn || '',
        heroSubtitle: contentAny.heroSubtitleEn || '',
        heroImage: content.heroImage || '',
        storyTitle: contentAny.storyTitleEn || '',
        storyContent: contentAny.storyContentEn || '',
        storyImage: content.storyImage || '',
        missionTitle: contentAny.missionTitleEn || '',
        missionContent: contentAny.missionContentEn || '',
        visionTitle: contentAny.visionTitleEn || '',
        visionContent: contentAny.visionContentEn || '',
        whyChooseTitle: contentAny.whyChooseTitleEn || '',
        whyChoosePoint1: contentAny.whyChoosePoint1En || '',
        whyChoosePoint2: contentAny.whyChoosePoint2En || '',
        whyChoosePoint3: contentAny.whyChoosePoint3En || '',
        whyChoosePoint4: contentAny.whyChoosePoint4En || '',
        valuesTitle: contentAny.valuesTitleEn || '',
        valuesContent: contentAny.valuesContentEn || '',
        milestone1Year: content.milestone1Year || '',
        milestone1Title: contentAny.milestone1TitleEn || '',
        milestone1Desc: contentAny.milestone1DescEn || '',
        milestone2Year: content.milestone2Year || '',
        milestone2Title: contentAny.milestone2TitleEn || '',
        milestone2Desc: contentAny.milestone2DescEn || '',
        milestone3Year: content.milestone3Year || '',
        milestone3Title: contentAny.milestone3TitleEn || '',
        milestone3Desc: contentAny.milestone3DescEn || '',
        milestone4Year: content.milestone4Year || '',
        milestone4Title: contentAny.milestone4TitleEn || '',
        milestone4Desc: contentAny.milestone4DescEn || '',
        foundersTitle: contentAny.foundersTitleEn || '',
        founder1Name: contentAny.founder1NameEn || '',
        founder1Position: contentAny.founder1PositionEn || '',
        founder1Image: content.founder1Image || '',
        founder1Bio: contentAny.founder1BioEn || '',
        founder2Name: contentAny.founder2NameEn || '',
        founder2Position: contentAny.founder2PositionEn || '',
        founder2Image: content.founder2Image || '',
        founder2Bio: contentAny.founder2BioEn || '',
      };
    }
    
    const contentAny = content as any;
    return {
      id: content.id,
      heroTitle: content.heroTitle || '',
      heroSubtitle: content.heroSubtitle || '',
      heroImage: content.heroImage || '',
      storyTitle: content.storyTitle || '',
      storyContent: content.storyContent || '',
      storyImage: content.storyImage || '',
      missionTitle: content.missionTitle || '',
      missionContent: content.missionContent || '',
      visionTitle: content.visionTitle || '',
      visionContent: content.visionContent || '',
      whyChooseTitle: content.whyChooseTitle || '',
      whyChoosePoint1: content.whyChoosePoint1 || '',
      whyChoosePoint2: content.whyChoosePoint2 || '',
      whyChoosePoint3: content.whyChoosePoint3 || '',
      whyChoosePoint4: content.whyChoosePoint4 || '',
      valuesTitle: content.valuesTitle || '',
      valuesContent: content.valuesContent || '',
      milestone1Year: content.milestone1Year || '',
      milestone1Title: content.milestone1Title || '',
      milestone1Desc: content.milestone1Desc || '',
      milestone2Year: content.milestone2Year || '',
      milestone2Title: content.milestone2Title || '',
      milestone2Desc: content.milestone2Desc || '',
      milestone3Year: content.milestone3Year || '',
      milestone3Title: content.milestone3Title || '',
      milestone3Desc: content.milestone3Desc || '',
      milestone4Year: content.milestone4Year || '',
      milestone4Title: content.milestone4Title || '',
      milestone4Desc: content.milestone4Desc || '',
      foundersTitle: content.foundersTitle || '',
      founder1Name: content.founder1Name || '',
      founder1Position: content.founder1Position || '',
      founder1Image: content.founder1Image || '',
      founder1Bio: content.founder1Bio || '',
      founder2Name: content.founder2Name || '',
      founder2Position: content.founder2Position || '',
      founder2Image: content.founder2Image || '',
      founder2Bio: content.founder2Bio || '',
    };
  } catch (error) {
    console.error('Error fetching about us content:', error);
    return null;
  }
}

export async function getContactUsContent(locale: Locale): Promise<ContactUsContent | null> {
  try {
    let content = await prisma.contactUs.findFirst();
    
    if (!content) {
      content = await prisma.contactUs.create({
        data: {
          infoDescription: '',
          infoDescriptionEn: '',
        },
      });
    }
    
    if (locale === 'en') {
      const contentAny = content as any;
      return {
        id: content.id,
        heroTitle: contentAny.heroTitleEn || '',
        heroSubtitle: contentAny.heroSubtitleEn || '',
        formTitle: contentAny.formTitleEn || '',
        nameLabel: contentAny.nameLabelEn || '',
        emailLabel: contentAny.emailLabelEn || '',
        phoneLabel: contentAny.phoneLabelEn || '',
        subjectLabel: contentAny.subjectLabelEn || '',
        messageLabel: contentAny.messageLabelEn || '',
        sendButton: contentAny.sendButtonEn || '',
        sendingButton: contentAny.sendingButtonEn || '',
        infoTitle: contentAny.infoTitleEn || '',
        infoDescription: contentAny.infoDescriptionEn || '',
        addressLabel: contentAny.addressLabelEn || '',
        addressValue: contentAny.addressValueEn || '',
        phoneLabelInfo: contentAny.phoneLabelInfoEn || '',
        phoneValue: content.phoneValue || '',
        emailLabelInfo: contentAny.emailLabelInfoEn || '',
        emailValue: content.emailValue || '',
        hoursLabel: contentAny.hoursLabelEn || '',
        hoursValue: contentAny.hoursValueEn || '',
        successMessage: contentAny.successMessageEn || '',
        errorMessage: contentAny.errorMessageEn || '',
        requiredField: contentAny.requiredFieldEn || '',
        invalidEmail: contentAny.invalidEmailEn || '',
      };
    }
    
    const contentAny = content as any;
    return {
      id: content.id,
      heroTitle: content.heroTitle || '',
      heroSubtitle: content.heroSubtitle || '',
      formTitle: content.formTitle || '',
      nameLabel: content.nameLabel || '',
      emailLabel: content.emailLabel || '',
      phoneLabel: content.phoneLabel || '',
      subjectLabel: content.subjectLabel || '',
      messageLabel: content.messageLabel || '',
      sendButton: content.sendButton || '',
      sendingButton: content.sendingButton || '',
      infoTitle: content.infoTitle || '',
      infoDescription: content.infoDescription || '',
      addressLabel: content.addressLabel || '',
      addressValue: content.addressValue || '',
      phoneLabelInfo: content.phoneLabelInfo || '',
      phoneValue: content.phoneValue || '',
      emailLabelInfo: content.emailLabelInfo || '',
      emailValue: content.emailValue || '',
      hoursLabel: content.hoursLabel || '',
      hoursValue: content.hoursValue || '',
      successMessage: content.successMessage || '',
      errorMessage: content.errorMessage || '',
      requiredField: content.requiredField || '',
      invalidEmail: content.invalidEmail || '',
    };
  } catch (error) {
    console.error('Error fetching contact us content:', error);
    return null;
  }
}

export interface FooterContent {
  id: string;
  footerLogo: string;
  companyName: string;
  footerCopyright: string;
  addressLabel: string;
  addressValue: string;
  phoneLabelInfo: string;
  phoneValue: string;
}

export async function getFooterContent(locale: Locale): Promise<FooterContent | null> {
  try {
    let content = await prisma.footer.findFirst();
    
    if (!content) {
      content = await prisma.footer.create({
        data: {},
      });
    }
    
    if (locale === 'en') {
      const contentAny = content as any;
      return {
        id: content.id,
        footerLogo: content.footerLogo || '',
        companyName: contentAny.companyNameEn || '',
        footerCopyright: contentAny.footerCopyrightEn || '',
        addressLabel: contentAny.addressLabelEn || '',
        addressValue: contentAny.addressValueEn || '',
        phoneLabelInfo: contentAny.phoneLabelInfoEn || '',
        phoneValue: content.phoneValue || '',
      };
    }
    
    const contentAny = content as any;
    return {
      id: content.id,
      footerLogo: content.footerLogo || '',
      companyName: content.companyName || '',
      footerCopyright: content.footerCopyright || '',
      addressLabel: content.addressLabel || '',
      addressValue: content.addressValue || '',
      phoneLabelInfo: content.phoneLabelInfo || '',
      phoneValue: content.phoneValue || '',
    };
  } catch (error) {
    console.error('Error fetching footer content:', error);
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    let settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {},
      });
    }
    
    return {
      id: settings.id,
      primaryFont: settings.primaryFont || '',
      headingFont: settings.headingFont || '',
      bodyFont: settings.bodyFont || '',
      showHome: settings.showHome ?? true,
      showAbout: settings.showAbout ?? true,
      showServices: settings.showServices ?? true,
      showProjects: settings.showProjects ?? true,
      showContact: settings.showContact ?? true,
      showLanguageSwitcher: settings.showLanguageSwitcher ?? true,
      whatsappNumber: settings.whatsappNumber || null,
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  location?: string | null;
  category?: string | null;
  year?: string | null;
}

export async function getProjects(locale: Locale, limit?: number): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        order: 'asc',
      },
      take: limit,
    });
    
    // Map projects based on locale
    return projects.map((project) => {
      if (locale === 'en') {
        return {
          id: project.id,
          title: (project as any).titleEn || project.title,
          description: (project as any).descriptionEn || project.description,
          image: project.image,
          location: (project as any).locationEn || project.location,
          category: (project as any).categoryEn || project.category,
          year: project.year,
        };
      }
      
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        image: project.image,
        location: project.location,
        category: project.category,
        year: project.year,
      };
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

