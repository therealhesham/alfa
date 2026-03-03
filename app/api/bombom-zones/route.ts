import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthForAdmin } from '@/lib/auth-middleware';

export async function GET() {
  try {
    const zones = await prisma.bombomPlayZone.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(zones);
  } catch (error) {
    console.error('Error fetching bombom zones:', error);
    return NextResponse.json({ error: 'Failed to fetch zones' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) return authResponse;

    const body = await request.json();
    const maxOrder = await prisma.bombomPlayZone.aggregate({
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    const zone = await prisma.bombomPlayZone.create({
      data: {
        title: body.title || '',
        titleEn: body.titleEn || '',
        description: body.description || '',
        descriptionEn: body.descriptionEn || '',
        buttonLabel: body.buttonLabel || 'استكشف الآن',
        buttonLabelEn: body.buttonLabelEn || 'Explore Now',
        icon: body.icon || 'FerrisWheel',
        color: body.color || '#00BFFF',
        gallery: body.gallery ? JSON.stringify(body.gallery) : null,
        order: body.order ?? order,
        isPublished: body.isPublished ?? true,
      },
    });

    return NextResponse.json(zone);
  } catch (error) {
    console.error('Error creating bombom zone:', error);
    return NextResponse.json({ error: 'Failed to create zone' }, { status: 500 });
  }
}
