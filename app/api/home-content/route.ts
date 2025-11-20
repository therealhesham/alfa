import { NextResponse } from 'next/server';
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
        footerCopyright: contentAny.footerCopyrightEn,
        footerLogo: content.footerLogo,
        headerLogo: content.headerLogo,
      };
      return NextResponse.json(englishContent);
    }
    
    // Arabic content (default)
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

