import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    
    let content = await prisma.footer.findFirst();
    
    if (!content) {
      // Create default content if none exists
      content = await prisma.footer.create({
        data: {} as any,
      });
    }
    
    // Map content based on locale
    if (locale === 'en') {
      const contentAny = content as any;
      const englishContent = {
        id: content.id,
        footerLogo: content.footerLogo,
        companyName: contentAny.companyNameEn,
        footerCopyright: contentAny.footerCopyrightEn,
        addressLabel: contentAny.addressLabelEn,
        addressValue: contentAny.addressValueEn,
        phoneLabelInfo: contentAny.phoneLabelInfoEn,
        phoneValue: content.phoneValue,
      };
      return NextResponse.json(englishContent);
    }
    
    // Arabic content (default)
    const arabicContent = {
      id: content.id,
      footerLogo: content.footerLogo,
      companyName: content.companyName,
      footerCopyright: content.footerCopyright,
      addressLabel: content.addressLabel,
      addressValue: content.addressValue,
      phoneLabelInfo: content.phoneLabelInfo,
      phoneValue: content.phoneValue,
    };
    
    return NextResponse.json(arabicContent);
  } catch (error) {
    console.error('Error fetching footer content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer content' },
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
    
    let content = await prisma.footer.findFirst();
    
    // Map fields based on locale
    let updateData: any = {};
    
    if (locale === 'en') {
      // Map English fields
      if (contentData.companyName !== undefined) updateData.companyNameEn = contentData.companyName;
      if (contentData.footerCopyright !== undefined) updateData.footerCopyrightEn = contentData.footerCopyright;
      if (contentData.addressLabel !== undefined) updateData.addressLabelEn = contentData.addressLabel;
      if (contentData.addressValue !== undefined) updateData.addressValueEn = contentData.addressValue;
      if (contentData.phoneLabelInfo !== undefined) updateData.phoneLabelInfoEn = contentData.phoneLabelInfo;
    } else {
      // Map Arabic fields (default)
      if (contentData.companyName !== undefined) updateData.companyName = contentData.companyName;
      if (contentData.footerCopyright !== undefined) updateData.footerCopyright = contentData.footerCopyright;
      if (contentData.addressLabel !== undefined) updateData.addressLabel = contentData.addressLabel;
      if (contentData.addressValue !== undefined) updateData.addressValue = contentData.addressValue;
      if (contentData.phoneLabelInfo !== undefined) updateData.phoneLabelInfo = contentData.phoneLabelInfo;
    }
    
    // Common fields (not language-specific)
    if (contentData.footerLogo !== undefined) updateData.footerLogo = contentData.footerLogo;
    if (contentData.phoneValue !== undefined) updateData.phoneValue = contentData.phoneValue;
    
    if (!content) {
      content = await prisma.footer.create({
        data: updateData,
      });
    } else {
      content = await prisma.footer.update({
        where: { id: content.id },
        data: updateData,
      });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating footer content:', error);
    return NextResponse.json(
      { error: 'Failed to update footer content' },
      { status: 500 }
    );
  }
}

