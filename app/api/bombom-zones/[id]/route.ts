import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthForAdmin } from '@/lib/auth-middleware';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) return authResponse;

    const { id } = await params;
    const body = await request.json();

    const zone = await prisma.bombomPlayZone.update({
      where: { id },
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        buttonLabel: body.buttonLabel,
        buttonLabelEn: body.buttonLabelEn,
        icon: body.icon,
        color: body.color,
        gallery: body.gallery ? JSON.stringify(body.gallery) : null,
        order: body.order,
        isPublished: body.isPublished,
      },
    });

    return NextResponse.json(zone);
  } catch (error) {
    console.error('Error updating bombom zone:', error);
    return NextResponse.json({ error: 'Failed to update zone' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) return authResponse;

    const { id } = await params;

    await prisma.bombomPlayZone.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bombom zone:', error);
    return NextResponse.json({ error: 'Failed to delete zone' }, { status: 500 });
  }
}
