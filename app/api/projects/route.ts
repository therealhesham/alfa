import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { requireAuthForAdmin } from '@/lib/auth-middleware';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    const all = searchParams.get('all') === 'true';
    
    // Check if requesting all projects (for admin)
    if (all) {
      const authResponse = await requireAuthForAdmin(request);
      if (authResponse) {
        return authResponse;
      }
    }
    
    const projects = await prisma.project.findMany({
      where: all ? {} : {
        isPublished: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    
    // Map projects based on locale
    const mappedProjects = projects.map((project) => {
      if (locale === 'en') {
        return {
          id: project.id,
          title: project.titleEn || project.title,
          titleEn: project.titleEn,
          description: project.descriptionEn || project.description,
          descriptionEn: project.descriptionEn,
          image: project.image,
          location: project.locationEn || project.location,
          locationEn: project.locationEn,
          category: project.categoryEn || project.category,
          categoryEn: project.categoryEn,
          year: project.year,
          order: project.order,
          isPublished: project.isPublished,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        };
      }
      
      return {
        id: project.id,
        title: project.title,
        titleEn: project.titleEn,
        description: project.description,
        descriptionEn: project.descriptionEn,
        image: project.image,
        location: project.location,
        locationEn: project.locationEn,
        category: project.category,
        categoryEn: project.categoryEn,
        year: project.year,
        order: project.order,
        isPublished: project.isPublished,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    });
    
    return NextResponse.json({ projects: mappedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) {
      return authResponse;
    }
    
    const body = await request.json();
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      image,
      location,
      locationEn,
      category,
      categoryEn,
      year,
      order,
      isPublished,
    } = body;
    
    const project = await prisma.project.create({
      data: {
        title: title || '',
        titleEn: titleEn || '',
        description: description || '',
        descriptionEn: descriptionEn || '',
        image: image || 'https://res.cloudinary.com/duo8svqci/image/upload/v1763643456/dattvtozngwdrakiop4j.png',
        location: location || null,
        locationEn: locationEn || null,
        category: category || null,
        categoryEn: categoryEn || null,
        year: year || null,
        order: order || 0,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
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
    
    const body = await request.json();
    const {
      id,
      title,
      titleEn,
      description,
      descriptionEn,
      image,
      location,
      locationEn,
      category,
      categoryEn,
      year,
      order,
      isPublished,
    } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        titleEn: titleEn !== undefined ? titleEn : undefined,
        description: description !== undefined ? description : undefined,
        descriptionEn: descriptionEn !== undefined ? descriptionEn : undefined,
        image: image !== undefined ? image : undefined,
        location: location !== undefined ? location : undefined,
        locationEn: locationEn !== undefined ? locationEn : undefined,
        category: category !== undefined ? category : undefined,
        categoryEn: categoryEn !== undefined ? categoryEn : undefined,
        year: year !== undefined ? year : undefined,
        order: order !== undefined ? order : undefined,
        isPublished: isPublished !== undefined ? isPublished : undefined,
      },
    });
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const authResponse = await requireAuthForAdmin(request);
    if (authResponse) {
      return authResponse;
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    await prisma.project.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

