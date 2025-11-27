import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthForAdmin } from '@/lib/auth-middleware';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    
    // Check if model exists in Prisma client
    if (!('ourClientsContent' in prisma)) {
      console.error('OurClientsContent model not found in Prisma client. Please run: npx prisma generate');
      return NextResponse.json(
        { error: 'Database model not available. Please run database migrations.' },
        { status: 500 }
      );
    }
    
    let content = await (prisma as any).ourClientsContent.findFirst();
    
    if (!content) {
      // Create default content if none exists
      content = await (prisma as any).ourClientsContent.create({
        data: {},
      });
    }
    
    // Parse client logos JSON
    let clientLogos = [];
    try {
      clientLogos = JSON.parse(content.clientLogos || '[]');
    } catch (e) {
      clientLogos = [];
    }
    
    // Map content based on locale
    if (locale === 'en') {
      return NextResponse.json({
        id: content.id,
        statsTitle: content.statsTitleEn || content.statsTitle,
        statsTitleEn: content.statsTitleEn,
        statsSubtitle: content.statsSubtitleEn || content.statsSubtitle,
        statsSubtitleEn: content.statsSubtitleEn,
        showStats: (content as any).showStats ?? true,
        statsStat1Icon: content.statsStat1Icon,
        statsStat1Number: content.statsStat1Number,
        statsStat1Label: content.statsStat1LabelEn || content.statsStat1Label,
        statsStat1LabelEn: content.statsStat1LabelEn,
        statsStat2Icon: content.statsStat2Icon,
        statsStat2Number: content.statsStat2Number,
        statsStat2Label: content.statsStat2LabelEn || content.statsStat2Label,
        statsStat2LabelEn: content.statsStat2LabelEn,
        statsStat3Icon: content.statsStat3Icon,
        statsStat3Number: content.statsStat3Number,
        statsStat3Label: content.statsStat3LabelEn || content.statsStat3Label,
        statsStat3LabelEn: content.statsStat3LabelEn,
        statsStat4Icon: content.statsStat4Icon,
        statsStat4Number: content.statsStat4Number,
        statsStat4Label: content.statsStat4LabelEn || content.statsStat4Label,
        statsStat4LabelEn: content.statsStat4LabelEn,
        clientsTitle: content.clientsTitleEn || content.clientsTitle,
        clientsTitleEn: content.clientsTitleEn,
        clientsSubtitle: content.clientsSubtitleEn || content.clientsSubtitle,
        clientsSubtitleEn: content.clientsSubtitleEn,
        clientLogos: clientLogos,
      });
    }
    
    return NextResponse.json({
      id: content.id,
      statsTitle: content.statsTitle,
      statsTitleEn: content.statsTitleEn,
      statsSubtitle: content.statsSubtitle,
      statsSubtitleEn: content.statsSubtitleEn,
      showStats: (content as any).showStats ?? true,
      statsStat1Icon: content.statsStat1Icon,
      statsStat1Number: content.statsStat1Number,
      statsStat1Label: content.statsStat1Label,
      statsStat1LabelEn: content.statsStat1LabelEn,
      statsStat2Icon: content.statsStat2Icon,
      statsStat2Number: content.statsStat2Number,
      statsStat2Label: content.statsStat2Label,
      statsStat2LabelEn: content.statsStat2LabelEn,
      statsStat3Icon: content.statsStat3Icon,
      statsStat3Number: content.statsStat3Number,
      statsStat3Label: content.statsStat3Label,
      statsStat3LabelEn: content.statsStat3LabelEn,
      statsStat4Icon: content.statsStat4Icon,
      statsStat4Number: content.statsStat4Number,
      statsStat4Label: content.statsStat4Label,
      statsStat4LabelEn: content.statsStat4LabelEn,
      clientsTitle: content.clientsTitle,
      clientsTitleEn: content.clientsTitleEn,
      clientsSubtitle: content.clientsSubtitle,
      clientsSubtitleEn: content.clientsSubtitleEn,
      clientLogos: clientLogos,
    });
  } catch (error: any) {
    console.error('Error fetching our-clients content:', error);
    // Check if it's a Prisma error about missing table/model
    if (error?.code === 'P2001' || error?.message?.includes('does not exist') || error?.message?.includes('Unknown table')) {
      return NextResponse.json(
        { error: 'Database table not found. Please ensure the OurClientsContent table exists in the database.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error?.message || 'Unknown error' },
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
    
    // Check if model exists in Prisma client
    if (!('ourClientsContent' in prisma)) {
      console.error('OurClientsContent model not found in Prisma client. Please run: npx prisma generate');
      return NextResponse.json(
        { error: 'Database model not available. Please run database migrations.' },
        { status: 500 }
      );
    }
    
    const body = await request.json();
    const contentData = body;
    
    let content = await (prisma as any).ourClientsContent.findFirst();
    
    const updateData: any = {};
    
    // Update all fields
    if (contentData.statsTitle !== undefined) updateData.statsTitle = contentData.statsTitle;
    if (contentData.statsTitleEn !== undefined) updateData.statsTitleEn = contentData.statsTitleEn;
    if (contentData.statsSubtitle !== undefined) updateData.statsSubtitle = contentData.statsSubtitle;
    if (contentData.statsSubtitleEn !== undefined) updateData.statsSubtitleEn = contentData.statsSubtitleEn;
    if (contentData.showStats !== undefined) updateData.showStats = contentData.showStats;
    
    if (contentData.statsStat1Icon !== undefined) updateData.statsStat1Icon = contentData.statsStat1Icon;
    if (contentData.statsStat1Number !== undefined) updateData.statsStat1Number = contentData.statsStat1Number;
    if (contentData.statsStat1Label !== undefined) updateData.statsStat1Label = contentData.statsStat1Label;
    if (contentData.statsStat1LabelEn !== undefined) updateData.statsStat1LabelEn = contentData.statsStat1LabelEn;
    
    if (contentData.statsStat2Icon !== undefined) updateData.statsStat2Icon = contentData.statsStat2Icon;
    if (contentData.statsStat2Number !== undefined) updateData.statsStat2Number = contentData.statsStat2Number;
    if (contentData.statsStat2Label !== undefined) updateData.statsStat2Label = contentData.statsStat2Label;
    if (contentData.statsStat2LabelEn !== undefined) updateData.statsStat2LabelEn = contentData.statsStat2LabelEn;
    
    if (contentData.statsStat3Icon !== undefined) updateData.statsStat3Icon = contentData.statsStat3Icon;
    if (contentData.statsStat3Number !== undefined) updateData.statsStat3Number = contentData.statsStat3Number;
    if (contentData.statsStat3Label !== undefined) updateData.statsStat3Label = contentData.statsStat3Label;
    if (contentData.statsStat3LabelEn !== undefined) updateData.statsStat3LabelEn = contentData.statsStat3LabelEn;
    
    if (contentData.statsStat4Icon !== undefined) updateData.statsStat4Icon = contentData.statsStat4Icon;
    if (contentData.statsStat4Number !== undefined) updateData.statsStat4Number = contentData.statsStat4Number;
    if (contentData.statsStat4Label !== undefined) updateData.statsStat4Label = contentData.statsStat4Label;
    if (contentData.statsStat4LabelEn !== undefined) updateData.statsStat4LabelEn = contentData.statsStat4LabelEn;
    
    if (contentData.clientsTitle !== undefined) updateData.clientsTitle = contentData.clientsTitle;
    if (contentData.clientsTitleEn !== undefined) updateData.clientsTitleEn = contentData.clientsTitleEn;
    if (contentData.clientsSubtitle !== undefined) updateData.clientsSubtitle = contentData.clientsSubtitle;
    if (contentData.clientsSubtitleEn !== undefined) updateData.clientsSubtitleEn = contentData.clientsSubtitleEn;
    
    if (contentData.clientLogos !== undefined) {
      updateData.clientLogos = JSON.stringify(contentData.clientLogos);
    }
    
    if (!content) {
      content = await (prisma as any).ourClientsContent.create({
        data: updateData,
      });
    } else {
      content = await (prisma as any).ourClientsContent.update({
        where: { id: content.id },
        data: updateData,
      });
    }
    
    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Error updating our-clients content:', error);
    // Check if it's a Prisma error about missing table/model
    if (error?.code === 'P2001' || error?.message?.includes('does not exist') || error?.message?.includes('Unknown table')) {
      return NextResponse.json(
        { error: 'Database table not found. Please ensure the OurClientsContent table exists in the database.' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update content', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

