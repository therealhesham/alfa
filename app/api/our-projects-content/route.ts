import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthForAdmin } from '@/lib/auth-middleware';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    
    let content = await prisma.ourProjectsContent.findFirst();
    
    if (!content) {
      // Create default content if none exists
      content = await prisma.ourProjectsContent.create({
        data: {},
      });
    }
    
    // Map content based on locale - return all fields for admin editing
    if (locale === 'en') {
      return NextResponse.json({
        id: content.id,
        heroLogo: content.heroLogo,
        heroTitle: content.heroTitleEn || content.heroTitle,
        heroTitleEn: content.heroTitleEn,
        heroSubtitle: content.heroSubtitleEn || content.heroSubtitle,
        heroSubtitleEn: content.heroSubtitleEn,
        showStats: content.showStats ?? true,
        stat1Icon: content.stat1Icon,
        stat1Number: content.stat1Number,
        stat1Label: content.stat1LabelEn || content.stat1Label,
        stat1LabelEn: content.stat1LabelEn,
        stat2Icon: content.stat2Icon,
        stat2Number: content.stat2Number,
        stat2Label: content.stat2LabelEn || content.stat2Label,
        stat2LabelEn: content.stat2LabelEn,
        stat3Icon: content.stat3Icon,
        stat3Number: content.stat3Number,
        stat3Label: content.stat3LabelEn || content.stat3Label,
        stat3LabelEn: content.stat3LabelEn,
        galleryIcon: content.galleryIcon,
        galleryTitle: content.galleryTitleEn || content.galleryTitle,
        galleryTitleEn: content.galleryTitleEn,
        gallerySubtitle: content.gallerySubtitleEn || content.gallerySubtitle,
        gallerySubtitleEn: content.gallerySubtitleEn,
        emptyMessage: content.emptyMessageEn || content.emptyMessage,
        emptyMessageEn: content.emptyMessageEn,
      });
    }
    
    return NextResponse.json({
      id: content.id,
      heroLogo: content.heroLogo,
      heroTitle: content.heroTitle,
      heroTitleEn: content.heroTitleEn,
      heroSubtitle: content.heroSubtitle,
      heroSubtitleEn: content.heroSubtitleEn,
      showStats: content.showStats ?? true,
      stat1Icon: content.stat1Icon,
      stat1Number: content.stat1Number,
      stat1Label: content.stat1Label,
      stat1LabelEn: content.stat1LabelEn,
      stat2Icon: content.stat2Icon,
      stat2Number: content.stat2Number,
      stat2Label: content.stat2Label,
      stat2LabelEn: content.stat2LabelEn,
      stat3Icon: content.stat3Icon,
      stat3Number: content.stat3Number,
      stat3Label: content.stat3Label,
      stat3LabelEn: content.stat3LabelEn,
      galleryIcon: content.galleryIcon,
      galleryTitle: content.galleryTitle,
      galleryTitleEn: content.galleryTitleEn,
      gallerySubtitle: content.gallerySubtitle,
      gallerySubtitleEn: content.gallerySubtitleEn,
      emptyMessage: content.emptyMessage,
      emptyMessageEn: content.emptyMessageEn,
    });
  } catch (error) {
    console.error('Error fetching our-projects content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) {
      return authResponse;
    }
    
    const body = await request.json();
    const { locale, ...contentData } = body;
    
    let content = await prisma.ourProjectsContent.findFirst();
    
    const updateData: any = {};
    
    // Map fields based on locale (similar to home-content)
    if (locale === 'en') {
      // Map English fields
      if (contentData.heroTitle !== undefined) updateData.heroTitleEn = contentData.heroTitle;
      if (contentData.heroSubtitle !== undefined) updateData.heroSubtitleEn = contentData.heroSubtitle;
      if (contentData.stat1Label !== undefined) updateData.stat1LabelEn = contentData.stat1Label;
      if (contentData.stat2Label !== undefined) updateData.stat2LabelEn = contentData.stat2Label;
      if (contentData.stat3Label !== undefined) updateData.stat3LabelEn = contentData.stat3Label;
      if (contentData.galleryTitle !== undefined) updateData.galleryTitleEn = contentData.galleryTitle;
      if (contentData.gallerySubtitle !== undefined) updateData.gallerySubtitleEn = contentData.gallerySubtitle;
      if (contentData.emptyMessage !== undefined) updateData.emptyMessageEn = contentData.emptyMessage;
    } else {
      // Map Arabic fields (default)
      if (contentData.heroTitle !== undefined) updateData.heroTitle = contentData.heroTitle;
      if (contentData.heroSubtitle !== undefined) updateData.heroSubtitle = contentData.heroSubtitle;
      if (contentData.stat1Label !== undefined) updateData.stat1Label = contentData.stat1Label;
      if (contentData.stat2Label !== undefined) updateData.stat2Label = contentData.stat2Label;
      if (contentData.stat3Label !== undefined) updateData.stat3Label = contentData.stat3Label;
      if (contentData.galleryTitle !== undefined) updateData.galleryTitle = contentData.galleryTitle;
      if (contentData.gallerySubtitle !== undefined) updateData.gallerySubtitle = contentData.gallerySubtitle;
      if (contentData.emptyMessage !== undefined) updateData.emptyMessage = contentData.emptyMessage;
    }
    
    // Common fields (not language-specific)
    if (contentData.heroLogo !== undefined) updateData.heroLogo = contentData.heroLogo;
    if (contentData.showStats !== undefined) updateData.showStats = contentData.showStats;
    if (contentData.stat1Icon !== undefined) updateData.stat1Icon = contentData.stat1Icon;
    if (contentData.stat1Number !== undefined) updateData.stat1Number = contentData.stat1Number;
    if (contentData.stat2Icon !== undefined) updateData.stat2Icon = contentData.stat2Icon;
    if (contentData.stat2Number !== undefined) updateData.stat2Number = contentData.stat2Number;
    if (contentData.stat3Icon !== undefined) updateData.stat3Icon = contentData.stat3Icon;
    if (contentData.stat3Number !== undefined) updateData.stat3Number = contentData.stat3Number;
    if (contentData.galleryIcon !== undefined) updateData.galleryIcon = contentData.galleryIcon;
    
    // Also handle direct En field updates
    if (contentData.heroTitleEn !== undefined) updateData.heroTitleEn = contentData.heroTitleEn;
    if (contentData.heroSubtitleEn !== undefined) updateData.heroSubtitleEn = contentData.heroSubtitleEn;
    if (contentData.stat1LabelEn !== undefined) updateData.stat1LabelEn = contentData.stat1LabelEn;
    if (contentData.stat2LabelEn !== undefined) updateData.stat2LabelEn = contentData.stat2LabelEn;
    if (contentData.stat3LabelEn !== undefined) updateData.stat3LabelEn = contentData.stat3LabelEn;
    if (contentData.galleryTitleEn !== undefined) updateData.galleryTitleEn = contentData.galleryTitleEn;
    if (contentData.gallerySubtitleEn !== undefined) updateData.gallerySubtitleEn = contentData.gallerySubtitleEn;
    if (contentData.emptyMessageEn !== undefined) updateData.emptyMessageEn = contentData.emptyMessageEn;
    
    if (!content) {
      content = await prisma.ourProjectsContent.create({
        data: updateData,
      });
    } else {
      content = await prisma.ourProjectsContent.update({
        where: { id: content.id },
        data: updateData,
      });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating our-projects content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

