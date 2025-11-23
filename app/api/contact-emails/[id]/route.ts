import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

// PUT - Update contact email (toggle active status)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    const contactEmail = await prisma.contactEmail.update({
      where: { id },
      data: {
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(contactEmail);
  } catch (error) {
    console.error('Error updating contact email:', error);
    return NextResponse.json(
      { error: 'Failed to update contact email' },
      { status: 500 }
    );
  }
}

