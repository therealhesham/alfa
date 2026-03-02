import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuthForAdmin } from '@/lib/auth-middleware';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    const all = searchParams.get('all') === 'true';

    if (all) {
      const authResponse = await requireAuthForAdmin(request);
      if (authResponse) return authResponse;
    }

    const projects = await prisma.entertainmentProject.findMany({
      where: all ? {} : { isPublished: true },
      orderBy: { order: 'asc' },
    });

    const mappedProjects = projects.map((project) => {
      let gallery: { image: string; caption: string; captionEn: string }[] = [];
      if (project.gallery) {
        try {
          gallery = JSON.parse(project.gallery);
          if (!Array.isArray(gallery)) gallery = [];
        } catch {
          gallery = [];
        }
      }

      return {
        id: project.id,
        title: project.title,
        titleEn: project.titleEn,
        description: project.description,
        descriptionEn: project.descriptionEn,
        fullDescription: project.fullDescription,
        fullDescriptionEn: project.fullDescriptionEn,
        image: project.image,
        gallery,
        category: project.category,
        categoryEn: project.categoryEn,
        location: project.location,
        locationEn: project.locationEn,
        year: project.year,
        status: project.status,
        statusEn: project.statusEn,
        order: project.order,
        isPublished: project.isPublished,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        ctaLabel: project.ctaLabel,
        ctaLabelEn: project.ctaLabelEn,
      };
    });

    return NextResponse.json({ projects: mappedProjects });
  } catch (error) {
    console.error('Error fetching entertainment projects:', error);
    return NextResponse.json({ error: 'Failed to fetch entertainment projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) return authResponse;

    const body = await request.json();

    const project = await prisma.entertainmentProject.create({
      data: {
        title: body.title || '',
        titleEn: body.titleEn || '',
        description: body.description || '',
        descriptionEn: body.descriptionEn || '',
        fullDescription: body.fullDescription || '',
        fullDescriptionEn: body.fullDescriptionEn || '',
        image: body.image || 'https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png',
        gallery: body.gallery ? JSON.stringify(body.gallery) : null,
        category: body.category || null,
        categoryEn: body.categoryEn || null,
        location: body.location || null,
        locationEn: body.locationEn || null,
        year: body.year || null,
        status: body.status || null,
        statusEn: body.statusEn || null,
        ctaLabel: body.ctaLabel || null,
        ctaLabelEn: body.ctaLabelEn || null,
        order: body.order || 0,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error creating entertainment project:', error);
    return NextResponse.json({ error: 'Failed to create entertainment project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) return authResponse;

    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    const fields = [
      'title', 'titleEn', 'description', 'descriptionEn',
      'fullDescription', 'fullDescriptionEn', 'image',
      'category', 'categoryEn', 'location', 'locationEn',
      'year', 'status', 'statusEn', 'ctaLabel', 'ctaLabelEn',
      'order', 'isPublished',
    ];

    for (const field of fields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    if (body.gallery !== undefined) {
      updateData.gallery = body.gallery ? JSON.stringify(body.gallery) : null;
    }

    const project = await prisma.entertainmentProject.update({
      where: { id: body.id },
      data: updateData,
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error updating entertainment project:', error);
    return NextResponse.json({ error: 'Failed to update entertainment project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) return authResponse;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    await prisma.entertainmentProject.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting entertainment project:', error);
    return NextResponse.json({ error: 'Failed to delete entertainment project' }, { status: 500 });
  }
}
