import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthForAdmin } from '@/lib/auth-middleware';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    let content = await prisma.entertainmentContent.findFirst();
    if (!content) {
      content = await prisma.entertainmentContent.create({ data: {} as any });
    }
    let heroImages: string[] = [];
    try {
      if (content.heroImages) heroImages = JSON.parse(content.heroImages);
    } catch { /* noop */ }

    return NextResponse.json({ ...content, heroImages });
  } catch (error) {
    console.error('Error fetching entertainment content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) return authResponse;

    const body = await request.json();

    let content = await prisma.entertainmentContent.findFirst();
    if (!content) {
      content = await prisma.entertainmentContent.create({ data: {} as any });
    }

    const updated = await prisma.entertainmentContent.update({
      where: { id: content.id },
      data: {
        heroTitle: body.heroTitle,
        heroTitleEn: body.heroTitleEn,
        heroSubtitle: body.heroSubtitle,
        heroSubtitleEn: body.heroSubtitleEn,
        heroImages: Array.isArray(body.heroImages) ? JSON.stringify(body.heroImages) : (body.heroImages || null),
        showStats: body.showStats,
        stat1Icon: body.stat1Icon,
        stat1Number: body.stat1Number,
        stat1Label: body.stat1Label,
        stat1LabelEn: body.stat1LabelEn,
        stat2Icon: body.stat2Icon,
        stat2Number: body.stat2Number,
        stat2Label: body.stat2Label,
        stat2LabelEn: body.stat2LabelEn,
        stat3Icon: body.stat3Icon,
        stat3Number: body.stat3Number,
        stat3Label: body.stat3Label,
        stat3LabelEn: body.stat3LabelEn,
        sectionTitle: body.sectionTitle,
        sectionTitleEn: body.sectionTitleEn,
        sectionSubtitle: body.sectionSubtitle,
        sectionSubtitleEn: body.sectionSubtitleEn,
        emptyMessage: body.emptyMessage,
        emptyMessageEn: body.emptyMessageEn,
        ...(body.showBombom !== undefined && { showBombom: body.showBombom }),
        ...(body.isUnderConstruction !== undefined && { isUnderConstruction: body.isUnderConstruction }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating entertainment content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
