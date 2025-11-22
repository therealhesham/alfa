import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    
    let content = await prisma.homeContent.findFirst();
    
    if (!content) {
      // Create default content if none exists
      content = await prisma.homeContent.create({
        data: {},
      });
    }
    
    // Map content based on locale
    if (locale === 'en') {
      const contentAny = content as any;
      const englishContent = {
        id: content.id,
        heroTitle: contentAny.heroTitleEn,
        heroSubtitle: contentAny.heroSubtitleEn,
        heroLogo: content.heroLogo,
        aboutTitle: contentAny.aboutTitleEn,
        aboutP1: contentAny.aboutP1En,
        aboutP2: contentAny.aboutP2En,
        visionTitle: contentAny.visionTitleEn,
        visionVision: contentAny.visionVisionEn,
        visionVisionText: contentAny.visionVisionTextEn,
        visionMission: contentAny.visionMissionEn,
        visionMissionText: contentAny.visionMissionTextEn,
        visionValues: contentAny.visionValuesEn,
        visionValuesText: contentAny.visionValuesTextEn,
        statsTitle: contentAny.statsTitleEn,
        statsProjects: contentAny.statsProjectsEn,
        statsYears: contentAny.statsYearsEn,
        statsCountries: contentAny.statsCountriesEn,
        statsAwards: contentAny.statsAwardsEn,
        statsProjectsNum: content.statsProjectsNum,
        statsYearsNum: content.statsYearsNum,
        statsCountriesNum: content.statsCountriesNum,
        statsAwardsNum: content.statsAwardsNum,
        servicesTitle: contentAny.servicesTitleEn,
        servicesSubtitle: contentAny.servicesSubtitleEn,
        service1Title: contentAny.service1TitleEn,
        service1Desc: contentAny.service1DescEn,
        service2Title: contentAny.service2TitleEn,
        service2Desc: contentAny.service2DescEn,
        service3Title: contentAny.service3TitleEn,
        service3Desc: contentAny.service3DescEn,
        service4Title: contentAny.service4TitleEn,
        service4Desc: contentAny.service4DescEn,
        projectsTitle: contentAny.projectsTitleEn,
        projectsSubtitle: contentAny.projectsSubtitleEn,
        projectsViewMore: contentAny.projectsViewMoreEn,
        project1Title: contentAny.project1TitleEn,
        project1Desc: contentAny.project1DescEn,
        project1Image: contentAny.project1Image,
        project2Title: contentAny.project2TitleEn,
        project2Desc: contentAny.project2DescEn,
        project2Image: contentAny.project2Image,
        project3Title: contentAny.project3TitleEn,
        project3Desc: contentAny.project3DescEn,
        project3Image: contentAny.project3Image,
        footerCopyright: contentAny.footerCopyrightEn,
        footerLogo: content.footerLogo,
        headerLogo: content.headerLogo,
      };
      return NextResponse.json(englishContent);
    }
    
    // Arabic content (default)
    const contentAny = content as any;
    const arabicContent = {
      id: content.id,
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      heroLogo: content.heroLogo,
      aboutTitle: content.aboutTitle,
      aboutP1: content.aboutP1,
      aboutP2: content.aboutP2,
      visionTitle: content.visionTitle,
      visionVision: content.visionVision,
      visionVisionText: content.visionVisionText,
      visionMission: content.visionMission,
      visionMissionText: content.visionMissionText,
      visionValues: content.visionValues,
      visionValuesText: content.visionValuesText,
      statsTitle: content.statsTitle,
      statsProjects: content.statsProjects,
      statsYears: content.statsYears,
      statsCountries: content.statsCountries,
      statsAwards: content.statsAwards,
      statsProjectsNum: content.statsProjectsNum,
      statsYearsNum: content.statsYearsNum,
      statsCountriesNum: content.statsCountriesNum,
      statsAwardsNum: content.statsAwardsNum,
      servicesTitle: contentAny.servicesTitle,
      servicesSubtitle: contentAny.servicesSubtitle,
      service1Title: contentAny.service1Title,
      service1Desc: contentAny.service1Desc,
      service2Title: contentAny.service2Title,
      service2Desc: contentAny.service2Desc,
      service3Title: contentAny.service3Title,
      service3Desc: contentAny.service3Desc,
      service4Title: contentAny.service4Title,
      service4Desc: contentAny.service4Desc,
      projectsTitle: contentAny.projectsTitle,
      projectsSubtitle: contentAny.projectsSubtitle,
      projectsViewMore: contentAny.projectsViewMore,
      project1Title: contentAny.project1Title,
      project1Desc: contentAny.project1Desc,
      project1Image: contentAny.project1Image,
      project2Title: contentAny.project2Title,
      project2Desc: contentAny.project2Desc,
      project2Image: contentAny.project2Image,
      project3Title: contentAny.project3Title,
      project3Desc: contentAny.project3Desc,
      project3Image: contentAny.project3Image,
      footerCopyright: content.footerCopyright,
      footerLogo: content.footerLogo,
      headerLogo: content.headerLogo,
    };
    
    return NextResponse.json(arabicContent);
  } catch (error) {
    console.error('Error fetching home content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check authentication
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('auth-token')?.value;
    
    const token = tokenFromHeader || tokenFromCookie;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { verifyToken } = await import('@/lib/jwt');
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { locale, ...contentData } = body;
    
    let content = await prisma.homeContent.findFirst();
    
    // Map fields based on locale
    let updateData: any = {};
    
    if (locale === 'en') {
      // Map English fields
      if (contentData.heroTitle !== undefined) updateData.heroTitleEn = contentData.heroTitle;
      if (contentData.heroSubtitle !== undefined) updateData.heroSubtitleEn = contentData.heroSubtitle;
      if (contentData.aboutTitle !== undefined) updateData.aboutTitleEn = contentData.aboutTitle;
      if (contentData.aboutP1 !== undefined) updateData.aboutP1En = contentData.aboutP1;
      if (contentData.aboutP2 !== undefined) updateData.aboutP2En = contentData.aboutP2;
      if (contentData.visionTitle !== undefined) updateData.visionTitleEn = contentData.visionTitle;
      if (contentData.visionVision !== undefined) updateData.visionVisionEn = contentData.visionVision;
      if (contentData.visionVisionText !== undefined) updateData.visionVisionTextEn = contentData.visionVisionText;
      if (contentData.visionMission !== undefined) updateData.visionMissionEn = contentData.visionMission;
      if (contentData.visionMissionText !== undefined) updateData.visionMissionTextEn = contentData.visionMissionText;
      if (contentData.visionValues !== undefined) updateData.visionValuesEn = contentData.visionValues;
      if (contentData.visionValuesText !== undefined) updateData.visionValuesTextEn = contentData.visionValuesText;
      if (contentData.statsTitle !== undefined) updateData.statsTitleEn = contentData.statsTitle;
      if (contentData.statsProjects !== undefined) updateData.statsProjectsEn = contentData.statsProjects;
      if (contentData.statsYears !== undefined) updateData.statsYearsEn = contentData.statsYears;
      if (contentData.statsCountries !== undefined) updateData.statsCountriesEn = contentData.statsCountries;
      if (contentData.statsAwards !== undefined) updateData.statsAwardsEn = contentData.statsAwards;
      if (contentData.servicesTitle !== undefined) updateData.servicesTitleEn = contentData.servicesTitle;
      if (contentData.servicesSubtitle !== undefined) updateData.servicesSubtitleEn = contentData.servicesSubtitle;
      if (contentData.service1Title !== undefined) updateData.service1TitleEn = contentData.service1Title;
      if (contentData.service1Desc !== undefined) updateData.service1DescEn = contentData.service1Desc;
      if (contentData.service2Title !== undefined) updateData.service2TitleEn = contentData.service2Title;
      if (contentData.service2Desc !== undefined) updateData.service2DescEn = contentData.service2Desc;
      if (contentData.service3Title !== undefined) updateData.service3TitleEn = contentData.service3Title;
      if (contentData.service3Desc !== undefined) updateData.service3DescEn = contentData.service3Desc;
      if (contentData.service4Title !== undefined) updateData.service4TitleEn = contentData.service4Title;
      if (contentData.service4Desc !== undefined) updateData.service4DescEn = contentData.service4Desc;
      if (contentData.projectsTitle !== undefined) updateData.projectsTitleEn = contentData.projectsTitle;
      if (contentData.projectsSubtitle !== undefined) updateData.projectsSubtitleEn = contentData.projectsSubtitle;
      if (contentData.projectsViewMore !== undefined) updateData.projectsViewMoreEn = contentData.projectsViewMore;
      if (contentData.project1Title !== undefined) updateData.project1TitleEn = contentData.project1Title;
      if (contentData.project1Desc !== undefined) updateData.project1DescEn = contentData.project1Desc;
      if (contentData.project2Title !== undefined) updateData.project2TitleEn = contentData.project2Title;
      if (contentData.project2Desc !== undefined) updateData.project2DescEn = contentData.project2Desc;
      if (contentData.project3Title !== undefined) updateData.project3TitleEn = contentData.project3Title;
      if (contentData.project3Desc !== undefined) updateData.project3DescEn = contentData.project3Desc;
      if (contentData.footerCopyright !== undefined) updateData.footerCopyrightEn = contentData.footerCopyright;
    } else {
      // Map Arabic fields (default)
      if (contentData.heroTitle !== undefined) updateData.heroTitle = contentData.heroTitle;
      if (contentData.heroSubtitle !== undefined) updateData.heroSubtitle = contentData.heroSubtitle;
      if (contentData.aboutTitle !== undefined) updateData.aboutTitle = contentData.aboutTitle;
      if (contentData.aboutP1 !== undefined) updateData.aboutP1 = contentData.aboutP1;
      if (contentData.aboutP2 !== undefined) updateData.aboutP2 = contentData.aboutP2;
      if (contentData.visionTitle !== undefined) updateData.visionTitle = contentData.visionTitle;
      if (contentData.visionVision !== undefined) updateData.visionVision = contentData.visionVision;
      if (contentData.visionVisionText !== undefined) updateData.visionVisionText = contentData.visionVisionText;
      if (contentData.visionMission !== undefined) updateData.visionMission = contentData.visionMission;
      if (contentData.visionMissionText !== undefined) updateData.visionMissionText = contentData.visionMissionText;
      if (contentData.visionValues !== undefined) updateData.visionValues = contentData.visionValues;
      if (contentData.visionValuesText !== undefined) updateData.visionValuesText = contentData.visionValuesText;
      if (contentData.statsTitle !== undefined) updateData.statsTitle = contentData.statsTitle;
      if (contentData.statsProjects !== undefined) updateData.statsProjects = contentData.statsProjects;
      if (contentData.statsYears !== undefined) updateData.statsYears = contentData.statsYears;
      if (contentData.statsCountries !== undefined) updateData.statsCountries = contentData.statsCountries;
      if (contentData.statsAwards !== undefined) updateData.statsAwards = contentData.statsAwards;
      if (contentData.servicesTitle !== undefined) updateData.servicesTitle = contentData.servicesTitle;
      if (contentData.servicesSubtitle !== undefined) updateData.servicesSubtitle = contentData.servicesSubtitle;
      if (contentData.service1Title !== undefined) updateData.service1Title = contentData.service1Title;
      if (contentData.service1Desc !== undefined) updateData.service1Desc = contentData.service1Desc;
      if (contentData.service2Title !== undefined) updateData.service2Title = contentData.service2Title;
      if (contentData.service2Desc !== undefined) updateData.service2Desc = contentData.service2Desc;
      if (contentData.service3Title !== undefined) updateData.service3Title = contentData.service3Title;
      if (contentData.service3Desc !== undefined) updateData.service3Desc = contentData.service3Desc;
      if (contentData.service4Title !== undefined) updateData.service4Title = contentData.service4Title;
      if (contentData.service4Desc !== undefined) updateData.service4Desc = contentData.service4Desc;
      if (contentData.projectsTitle !== undefined) updateData.projectsTitle = contentData.projectsTitle;
      if (contentData.projectsSubtitle !== undefined) updateData.projectsSubtitle = contentData.projectsSubtitle;
      if (contentData.projectsViewMore !== undefined) updateData.projectsViewMore = contentData.projectsViewMore;
      if (contentData.project1Title !== undefined) updateData.project1Title = contentData.project1Title;
      if (contentData.project1Desc !== undefined) updateData.project1Desc = contentData.project1Desc;
      if (contentData.project2Title !== undefined) updateData.project2Title = contentData.project2Title;
      if (contentData.project2Desc !== undefined) updateData.project2Desc = contentData.project2Desc;
      if (contentData.project3Title !== undefined) updateData.project3Title = contentData.project3Title;
      if (contentData.project3Desc !== undefined) updateData.project3Desc = contentData.project3Desc;
      if (contentData.footerCopyright !== undefined) updateData.footerCopyright = contentData.footerCopyright;
    }
    
    // Common fields (not language-specific)
    if (contentData.heroLogo !== undefined) updateData.heroLogo = contentData.heroLogo;
    if (contentData.footerLogo !== undefined) updateData.footerLogo = contentData.footerLogo;
    if (contentData.headerLogo !== undefined) updateData.headerLogo = contentData.headerLogo;
    if (contentData.statsProjectsNum !== undefined) updateData.statsProjectsNum = contentData.statsProjectsNum;
    if (contentData.statsYearsNum !== undefined) updateData.statsYearsNum = contentData.statsYearsNum;
    if (contentData.statsCountriesNum !== undefined) updateData.statsCountriesNum = contentData.statsCountriesNum;
    if (contentData.statsAwardsNum !== undefined) updateData.statsAwardsNum = contentData.statsAwardsNum;
    if (contentData.project1Image !== undefined) updateData.project1Image = contentData.project1Image;
    if (contentData.project2Image !== undefined) updateData.project2Image = contentData.project2Image;
    if (contentData.project3Image !== undefined) updateData.project3Image = contentData.project3Image;
    
    if (!content) {
      content = await prisma.homeContent.create({
        data: updateData,
      });
    } else {
      content = await prisma.homeContent.update({
        where: { id: content.id },
        data: updateData,
      });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json(
      { error: 'Failed to update home content' },
      { status: 500 }
    );
  }
}

