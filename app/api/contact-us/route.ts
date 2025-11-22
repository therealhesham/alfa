import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    
    let content = await prisma.contactUs.findFirst();
    
    if (!content) {
      // Create default content if none exists
      content = await prisma.contactUs.create({
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
        formTitle: contentAny.formTitleEn,
        nameLabel: contentAny.nameLabelEn,
        emailLabel: contentAny.emailLabelEn,
        phoneLabel: contentAny.phoneLabelEn,
        subjectLabel: contentAny.subjectLabelEn,
        messageLabel: contentAny.messageLabelEn,
        sendButton: contentAny.sendButtonEn,
        sendingButton: contentAny.sendingButtonEn,
        infoTitle: contentAny.infoTitleEn,
        infoDescription: contentAny.infoDescriptionEn,
        addressLabel: contentAny.addressLabelEn,
        addressValue: contentAny.addressValueEn,
        phoneLabelInfo: contentAny.phoneLabelInfoEn,
        phoneValue: content.phoneValue,
        emailLabelInfo: contentAny.emailLabelInfoEn,
        emailValue: content.emailValue,
        hoursLabel: contentAny.hoursLabelEn,
        hoursValue: contentAny.hoursValueEn,
        successMessage: contentAny.successMessageEn,
        errorMessage: contentAny.errorMessageEn,
        requiredField: contentAny.requiredFieldEn,
        invalidEmail: contentAny.invalidEmailEn,
      };
      return NextResponse.json(englishContent);
    }
    
    // Arabic content (default)
    const contentAny = content as any;
    const arabicContent = {
      id: content.id,
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      formTitle: content.formTitle,
      nameLabel: content.nameLabel,
      emailLabel: content.emailLabel,
      phoneLabel: content.phoneLabel,
      subjectLabel: content.subjectLabel,
      messageLabel: content.messageLabel,
      sendButton: content.sendButton,
      sendingButton: content.sendingButton,
      infoTitle: content.infoTitle,
      infoDescription: content.infoDescription,
      addressLabel: content.addressLabel,
      addressValue: content.addressValue,
      phoneLabelInfo: content.phoneLabelInfo,
      phoneValue: content.phoneValue,
      emailLabelInfo: content.emailLabelInfo,
      emailValue: content.emailValue,
      hoursLabel: content.hoursLabel,
      hoursValue: content.hoursValue,
      successMessage: content.successMessage,
      errorMessage: content.errorMessage,
      requiredField: content.requiredField,
      invalidEmail: content.invalidEmail,
    };
    
    return NextResponse.json(arabicContent);
  } catch (error) {
    console.error('Error fetching contact us content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact us content' },
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
    
    let content = await prisma.contactUs.findFirst();
    
    // Map fields based on locale
    let updateData: any = {};
    
    if (locale === 'en') {
      // Map English fields
      if (contentData.heroTitle !== undefined) updateData.heroTitleEn = contentData.heroTitle;
      if (contentData.heroSubtitle !== undefined) updateData.heroSubtitleEn = contentData.heroSubtitle;
      if (contentData.formTitle !== undefined) updateData.formTitleEn = contentData.formTitle;
      if (contentData.nameLabel !== undefined) updateData.nameLabelEn = contentData.nameLabel;
      if (contentData.emailLabel !== undefined) updateData.emailLabelEn = contentData.emailLabel;
      if (contentData.phoneLabel !== undefined) updateData.phoneLabelEn = contentData.phoneLabel;
      if (contentData.subjectLabel !== undefined) updateData.subjectLabelEn = contentData.subjectLabel;
      if (contentData.messageLabel !== undefined) updateData.messageLabelEn = contentData.messageLabel;
      if (contentData.sendButton !== undefined) updateData.sendButtonEn = contentData.sendButton;
      if (contentData.sendingButton !== undefined) updateData.sendingButtonEn = contentData.sendingButton;
      if (contentData.infoTitle !== undefined) updateData.infoTitleEn = contentData.infoTitle;
      if (contentData.infoDescription !== undefined) updateData.infoDescriptionEn = contentData.infoDescription;
      if (contentData.addressLabel !== undefined) updateData.addressLabelEn = contentData.addressLabel;
      if (contentData.addressValue !== undefined) updateData.addressValueEn = contentData.addressValue;
      if (contentData.phoneLabelInfo !== undefined) updateData.phoneLabelInfoEn = contentData.phoneLabelInfo;
      if (contentData.emailLabelInfo !== undefined) updateData.emailLabelInfoEn = contentData.emailLabelInfo;
      if (contentData.hoursLabel !== undefined) updateData.hoursLabelEn = contentData.hoursLabel;
      if (contentData.hoursValue !== undefined) updateData.hoursValueEn = contentData.hoursValue;
      if (contentData.successMessage !== undefined) updateData.successMessageEn = contentData.successMessage;
      if (contentData.errorMessage !== undefined) updateData.errorMessageEn = contentData.errorMessage;
      if (contentData.requiredField !== undefined) updateData.requiredFieldEn = contentData.requiredField;
      if (contentData.invalidEmail !== undefined) updateData.invalidEmailEn = contentData.invalidEmail;
    } else {
      // Map Arabic fields (default)
      if (contentData.heroTitle !== undefined) updateData.heroTitle = contentData.heroTitle;
      if (contentData.heroSubtitle !== undefined) updateData.heroSubtitle = contentData.heroSubtitle;
      if (contentData.formTitle !== undefined) updateData.formTitle = contentData.formTitle;
      if (contentData.nameLabel !== undefined) updateData.nameLabel = contentData.nameLabel;
      if (contentData.emailLabel !== undefined) updateData.emailLabel = contentData.emailLabel;
      if (contentData.phoneLabel !== undefined) updateData.phoneLabel = contentData.phoneLabel;
      if (contentData.subjectLabel !== undefined) updateData.subjectLabel = contentData.subjectLabel;
      if (contentData.messageLabel !== undefined) updateData.messageLabel = contentData.messageLabel;
      if (contentData.sendButton !== undefined) updateData.sendButton = contentData.sendButton;
      if (contentData.sendingButton !== undefined) updateData.sendingButton = contentData.sendingButton;
      if (contentData.infoTitle !== undefined) updateData.infoTitle = contentData.infoTitle;
      if (contentData.infoDescription !== undefined) updateData.infoDescription = contentData.infoDescription;
      if (contentData.addressLabel !== undefined) updateData.addressLabel = contentData.addressLabel;
      if (contentData.addressValue !== undefined) updateData.addressValue = contentData.addressValue;
      if (contentData.phoneLabelInfo !== undefined) updateData.phoneLabelInfo = contentData.phoneLabelInfo;
      if (contentData.emailLabelInfo !== undefined) updateData.emailLabelInfo = contentData.emailLabelInfo;
      if (contentData.hoursLabel !== undefined) updateData.hoursLabel = contentData.hoursLabel;
      if (contentData.hoursValue !== undefined) updateData.hoursValue = contentData.hoursValue;
      if (contentData.successMessage !== undefined) updateData.successMessage = contentData.successMessage;
      if (contentData.errorMessage !== undefined) updateData.errorMessage = contentData.errorMessage;
      if (contentData.requiredField !== undefined) updateData.requiredField = contentData.requiredField;
      if (contentData.invalidEmail !== undefined) updateData.invalidEmail = contentData.invalidEmail;
    }
    
    // Common fields (not language-specific)
    if (contentData.phoneValue !== undefined) updateData.phoneValue = contentData.phoneValue;
    if (contentData.emailValue !== undefined) updateData.emailValue = contentData.emailValue;
    
    if (!content) {
      content = await prisma.contactUs.create({
        data: updateData,
      });
    } else {
      content = await prisma.contactUs.update({
        where: { id: content.id },
        data: updateData,
      });
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating contact us content:', error);
    return NextResponse.json(
      { error: 'Failed to update contact us content' },
      { status: 500 }
    );
  }
}

