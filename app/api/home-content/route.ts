import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let content = await prisma.homeContent.findFirst();
    
    if (!content) {
      // Create default content if none exists
      content = await prisma.homeContent.create({
        data: {},
      });
    }
    
    return NextResponse.json(content);
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
    
    let content = await prisma.homeContent.findFirst();
    
    if (!content) {
      content = await prisma.homeContent.create({
        data: body,
      });
    } else {
      content = await prisma.homeContent.update({
        where: { id: content.id },
        data: body,
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

