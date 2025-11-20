import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    
    let content = await prisma.aboutUs.findFirst();
    
    if (!content) {
      // Create default content if none exists
      content = await prisma.aboutUs.create({
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
        heroImage: content.heroImage,
        storyTitle: contentAny.storyTitleEn,
        storyContent: contentAny.storyContentEn,
        storyImage: content.storyImage,
        missionTitle: contentAny.missionTitleEn,
        missionContent: contentAny.missionContentEn,
        visionTitle: contentAny.visionTitleEn,
        visionContent: contentAny.visionContentEn,
        whyChooseTitle: contentAny.whyChooseTitleEn,
        whyChoosePoint1: contentAny.whyChoosePoint1En,
        whyChoosePoint2: contentAny.whyChoosePoint2En,
        whyChoosePoint3: contentAny.whyChoosePoint3En,
        whyChoosePoint4: contentAny.whyChoosePoint4En,
        valuesTitle: contentAny.valuesTitleEn,
        valuesContent: contentAny.valuesContentEn,
        milestone1Year: content.milestone1Year,
        milestone1Title: contentAny.milestone1TitleEn,
        milestone1Desc: contentAny.milestone1DescEn,
        milestone2Year: content.milestone2Year,
        milestone2Title: contentAny.milestone2TitleEn,
        milestone2Desc: contentAny.milestone2DescEn,
        milestone3Year: content.milestone3Year,
        milestone3Title: contentAny.milestone3TitleEn,
        milestone3Desc: contentAny.milestone3DescEn,
        milestone4Year: content.milestone4Year,
        milestone4Title: contentAny.milestone4TitleEn,
        milestone4Desc: contentAny.milestone4DescEn,
        foundersTitle: contentAny.foundersTitleEn,
        founder1Name: contentAny.founder1NameEn,
        founder1Position: contentAny.founder1PositionEn,
        founder1Image: content.founder1Image,
        founder1Bio: contentAny.founder1BioEn,
        founder2Name: contentAny.founder2NameEn,
        founder2Position: contentAny.founder2PositionEn,
        founder2Image: content.founder2Image,
        founder2Bio: contentAny.founder2BioEn,
      };
      return NextResponse.json(englishContent);
    }
    
    // Arabic content (default)
    const contentAny = content as any;
    const arabicContent = {
      id: content.id,
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      heroImage: content.heroImage,
      storyTitle: content.storyTitle,
      storyContent: content.storyContent,
      storyImage: content.storyImage,
      missionTitle: content.missionTitle,
      missionContent: content.missionContent,
      visionTitle: content.visionTitle,
      visionContent: content.visionContent,
      whyChooseTitle: content.whyChooseTitle,
      whyChoosePoint1: content.whyChoosePoint1,
      whyChoosePoint2: content.whyChoosePoint2,
      whyChoosePoint3: content.whyChoosePoint3,
      whyChoosePoint4: content.whyChoosePoint4,
      valuesTitle: content.valuesTitle,
      valuesContent: content.valuesContent,
      milestone1Year: content.milestone1Year,
      milestone1Title: content.milestone1Title,
      milestone1Desc: content.milestone1Desc,
      milestone2Year: content.milestone2Year,
      milestone2Title: content.milestone2Title,
      milestone2Desc: content.milestone2Desc,
      milestone3Year: content.milestone3Year,
      milestone3Title: content.milestone3Title,
      milestone3Desc: content.milestone3Desc,
      milestone4Year: content.milestone4Year,
      milestone4Title: content.milestone4Title,
      milestone4Desc: content.milestone4Desc,
      foundersTitle: content.foundersTitle,
      founder1Name: content.founder1Name,
      founder1Position: content.founder1Position,
      founder1Image: content.founder1Image,
      founder1Bio: content.founder1Bio,
      founder2Name: content.founder2Name,
      founder2Position: content.founder2Position,
      founder2Image: content.founder2Image,
      founder2Bio: content.founder2Bio,
    };
    
    return NextResponse.json(arabicContent);
  } catch (error) {
    console.error('Error fetching about us content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about us content' },
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
    
    let content = await prisma.aboutUs.findFirst();
    
    // Map fields based on locale
    let updateData: any = {};
    
    if (locale === 'en') {
      // Map English fields
      if (contentData.heroTitle !== undefined) updateData.heroTitleEn = contentData.heroTitle;
      if (contentData.heroSubtitle !== undefined) updateData.heroSubtitleEn = contentData.heroSubtitle;
      if (contentData.storyTitle !== undefined) updateData.storyTitleEn = contentData.storyTitle;
      if (contentData.storyContent !== undefined) updateData.storyContentEn = contentData.storyContent;
      if (contentData.missionTitle !== undefined) updateData.missionTitleEn = contentData.missionTitle;
      if (contentData.missionContent !== undefined) updateData.missionContentEn = contentData.missionContent;
      if (contentData.visionTitle !== undefined) updateData.visionTitleEn = contentData.visionTitle;
      if (contentData.visionContent !== undefined) updateData.visionContentEn = contentData.visionContent;
      if (contentData.whyChooseTitle !== undefined) updateData.whyChooseTitleEn = contentData.whyChooseTitle;
      if (contentData.whyChoosePoint1 !== undefined) updateData.whyChoosePoint1En = contentData.whyChoosePoint1;
      if (contentData.whyChoosePoint2 !== undefined) updateData.whyChoosePoint2En = contentData.whyChoosePoint2;
      if (contentData.whyChoosePoint3 !== undefined) updateData.whyChoosePoint3En = contentData.whyChoosePoint3;
      if (contentData.whyChoosePoint4 !== undefined) updateData.whyChoosePoint4En = contentData.whyChoosePoint4;
      if (contentData.valuesTitle !== undefined) updateData.valuesTitleEn = contentData.valuesTitle;
      if (contentData.valuesContent !== undefined) updateData.valuesContentEn = contentData.valuesContent;
      if (contentData.milestone1Title !== undefined) updateData.milestone1TitleEn = contentData.milestone1Title;
      if (contentData.milestone1Desc !== undefined) updateData.milestone1DescEn = contentData.milestone1Desc;
      if (contentData.milestone2Title !== undefined) updateData.milestone2TitleEn = contentData.milestone2Title;
      if (contentData.milestone2Desc !== undefined) updateData.milestone2DescEn = contentData.milestone2Desc;
      if (contentData.milestone3Title !== undefined) updateData.milestone3TitleEn = contentData.milestone3Title;
      if (contentData.milestone3Desc !== undefined) updateData.milestone3DescEn = contentData.milestone3Desc;
      if (contentData.milestone4Title !== undefined) updateData.milestone4TitleEn = contentData.milestone4Title;
      if (contentData.milestone4Desc !== undefined) updateData.milestone4DescEn = contentData.milestone4Desc;
      if (contentData.foundersTitle !== undefined) updateData.foundersTitleEn = contentData.foundersTitle;
      if (contentData.founder1Name !== undefined) updateData.founder1NameEn = contentData.founder1Name;
      if (contentData.founder1Position !== undefined) updateData.founder1PositionEn = contentData.founder1Position;
      if (contentData.founder1Bio !== undefined) updateData.founder1BioEn = contentData.founder1Bio;
      if (contentData.founder2Name !== undefined) updateData.founder2NameEn = contentData.founder2Name;
      if (contentData.founder2Position !== undefined) updateData.founder2PositionEn = contentData.founder2Position;
      if (contentData.founder2Bio !== undefined) updateData.founder2BioEn = contentData.founder2Bio;
    } else {
      // Map Arabic fields (default)
      if (contentData.heroTitle !== undefined) updateData.heroTitle = contentData.heroTitle;
      if (contentData.heroSubtitle !== undefined) updateData.heroSubtitle = contentData.heroSubtitle;
      if (contentData.storyTitle !== undefined) updateData.storyTitle = contentData.storyTitle;
      if (contentData.storyContent !== undefined) updateData.storyContent = contentData.storyContent;
      if (contentData.missionTitle !== undefined) updateData.missionTitle = contentData.missionTitle;
      if (contentData.missionContent !== undefined) updateData.missionContent = contentData.missionContent;
      if (contentData.visionTitle !== undefined) updateData.visionTitle = contentData.visionTitle;
      if (contentData.visionContent !== undefined) updateData.visionContent = contentData.visionContent;
      if (contentData.whyChooseTitle !== undefined) updateData.whyChooseTitle = contentData.whyChooseTitle;
      if (contentData.whyChoosePoint1 !== undefined) updateData.whyChoosePoint1 = contentData.whyChoosePoint1;
      if (contentData.whyChoosePoint2 !== undefined) updateData.whyChoosePoint2 = contentData.whyChoosePoint2;
      if (contentData.whyChoosePoint3 !== undefined) updateData.whyChoosePoint3 = contentData.whyChoosePoint3;
      if (contentData.whyChoosePoint4 !== undefined) updateData.whyChoosePoint4 = contentData.whyChoosePoint4;
      if (contentData.valuesTitle !== undefined) updateData.valuesTitle = contentData.valuesTitle;
      if (contentData.valuesContent !== undefined) updateData.valuesContent = contentData.valuesContent;
      if (contentData.milestone1Title !== undefined) updateData.milestone1Title = contentData.milestone1Title;
      if (contentData.milestone1Desc !== undefined) updateData.milestone1Desc = contentData.milestone1Desc;
      if (contentData.milestone2Title !== undefined) updateData.milestone2Title = contentData.milestone2Title;
      if (contentData.milestone2Desc !== undefined) updateData.milestone2Desc = contentData.milestone2Desc;
      if (contentData.milestone3Title !== undefined) updateData.milestone3Title = contentData.milestone3Title;
      if (contentData.milestone3Desc !== undefined) updateData.milestone3Desc = contentData.milestone3Desc;
      if (contentData.milestone4Title !== undefined) updateData.milestone4Title = contentData.milestone4Title;
      if (contentData.milestone4Desc !== undefined) updateData.milestone4Desc = contentData.milestone4Desc;
      if (contentData.foundersTitle !== undefined) updateData.foundersTitle = contentData.foundersTitle;
      if (contentData.founder1Name !== undefined) updateData.founder1Name = contentData.founder1Name;
      if (contentData.founder1Position !== undefined) updateData.founder1Position = contentData.founder1Position;
      if (contentData.founder1Bio !== undefined) updateData.founder1Bio = contentData.founder1Bio;
      if (contentData.founder2Name !== undefined) updateData.founder2Name = contentData.founder2Name;
      if (contentData.founder2Position !== undefined) updateData.founder2Position = contentData.founder2Position;
      if (contentData.founder2Bio !== undefined) updateData.founder2Bio = contentData.founder2Bio;
    }
    
    // Common fields (not language-specific)
    if (contentData.heroImage !== undefined) updateData.heroImage = contentData.heroImage;
    if (contentData.storyImage !== undefined) updateData.storyImage = contentData.storyImage;
    if (contentData.milestone1Year !== undefined) updateData.milestone1Year = contentData.milestone1Year;
    if (contentData.milestone2Year !== undefined) updateData.milestone2Year = contentData.milestone2Year;
    if (contentData.milestone3Year !== undefined) updateData.milestone3Year = contentData.milestone3Year;
    if (contentData.milestone4Year !== undefined) updateData.milestone4Year = contentData.milestone4Year;
    if (contentData.founder1Image !== undefined) updateData.founder1Image = contentData.founder1Image;
    if (contentData.founder2Image !== undefined) updateData.founder2Image = contentData.founder2Image;
    
    if (!content) {
      content = await prisma.aboutUs.create({
        data: updateData,
      });
    } else {
      content = await prisma.aboutUs.update({
        where: { id: content.id },
        data: updateData,
      });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating about us content:', error);
    return NextResponse.json(
      { error: 'Failed to update about us content' },
      { status: 500 }
    );
  }
}

