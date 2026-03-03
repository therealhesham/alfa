import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthForAdmin } from '@/lib/auth-middleware';

export async function GET() {
  try {
    const content = await prisma.bombomContent.findFirst();
    if (!content) {
      return NextResponse.json(null);
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching bombom content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) return authResponse;

    const body = await request.json();

    let content = await prisma.bombomContent.findFirst();
    if (!content) {
      content = await prisma.bombomContent.create({
        data: {
          heroDesc: body.heroDesc || '',
          heroDescEn: body.heroDescEn || '',
          eventDesc: body.eventDesc || '',
          eventDescEn: body.eventDescEn || '',
          ctaDesc: body.ctaDesc || '',
          ctaDescEn: body.ctaDescEn || '',
          footerDesc: body.footerDesc || '',
          footerDescEn: body.footerDescEn || '',
        },
      });
    }

    const updated = await prisma.bombomContent.update({
      where: { id: content.id },
      data: {
        homeLabel: body.homeLabel,
        homeLabelEn: body.homeLabelEn,
        zonesLabel: body.zonesLabel,
        zonesLabelEn: body.zonesLabelEn,
        bookNowLabel: body.bookNowLabel,
        bookNowLabelEn: body.bookNowLabelEn,
        heroLogo: body.heroLogo,
        tagline: body.tagline,
        taglineEn: body.taglineEn,
        heroTitle1: body.heroTitle1,
        heroTitle1En: body.heroTitle1En,
        heroBrand: body.heroBrand,
        heroBrandEn: body.heroBrandEn,
        heroTitle2: body.heroTitle2,
        heroTitle2En: body.heroTitle2En,
        heroDesc: body.heroDesc,
        heroDescEn: body.heroDescEn,
        playBtn: body.playBtn,
        playBtnEn: body.playBtnEn,
        exploreBtn: body.exploreBtn,
        exploreBtnEn: body.exploreBtnEn,
        galleryTitle: body.galleryTitle,
        galleryTitleEn: body.galleryTitleEn,
        gallerySub: body.gallerySub,
        gallerySubEn: body.gallerySubEn,
        gallery: body.gallery ? JSON.stringify(body.gallery) : null,
        showGallery: body.showGallery ?? true,
        zonesTitle: body.zonesTitle,
        zonesTitleEn: body.zonesTitleEn,
        zonesSub: body.zonesSub,
        zonesSubEn: body.zonesSubEn,
        eventsImage: body.eventsImage,
        eventTitle: body.eventTitle,
        eventTitleEn: body.eventTitleEn,
        eventTitleBrand: body.eventTitleBrand,
        eventTitleBrandEn: body.eventTitleBrandEn,
        eventTitle2: body.eventTitle2,
        eventTitle2En: body.eventTitle2En,
        eventDesc: body.eventDesc,
        eventDescEn: body.eventDescEn,
        eventFeat1: body.eventFeat1,
        eventFeat1En: body.eventFeat1En,
        eventFeat2: body.eventFeat2,
        eventFeat2En: body.eventFeat2En,
        eventFeat3: body.eventFeat3,
        eventFeat3En: body.eventFeat3En,
        eventBadge1: body.eventBadge1,
        eventBadge1En: body.eventBadge1En,
        eventBadge2: body.eventBadge2,
        eventBadge2En: body.eventBadge2En,
        ctaTitle: body.ctaTitle,
        ctaTitleEn: body.ctaTitleEn,
        ctaDesc: body.ctaDesc,
        ctaDescEn: body.ctaDescEn,
        ctaBtn1: body.ctaBtn1,
        ctaBtn1En: body.ctaBtn1En,
        ctaBtn2: body.ctaBtn2,
        ctaBtn2En: body.ctaBtn2En,
        bookTicketUrl: body.bookTicketUrl ?? null,
        contactUrl: body.contactUrl ?? null,
        footerLogo: body.footerLogo,
        footerDesc: body.footerDesc,
        footerDescEn: body.footerDescEn,
        footerExplore: body.footerExplore,
        footerExploreEn: body.footerExploreEn,
        footerAbout: body.footerAbout,
        footerAboutEn: body.footerAboutEn,
        footerZones: body.footerZones,
        footerZonesEn: body.footerZonesEn,
        footerPrices: body.footerPrices,
        footerPricesEn: body.footerPricesEn,
        footerContact: body.footerContact,
        footerContactEn: body.footerContactEn,
        footerCountry: body.footerCountry,
        footerCountryEn: body.footerCountryEn,
        footerPhone: body.footerPhone,
        footerPhoneEn: body.footerPhoneEn,
        footerFollow: body.footerFollow,
        footerFollowEn: body.footerFollowEn,
        instagramLink: body.instagramLink ?? null,
        facebookLink: body.facebookLink ?? null,
        copyright: body.copyright,
        copyrightEn: body.copyrightEn,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating bombom content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
