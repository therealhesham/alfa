import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you can:
    // 1. Save to database (create a Contact model in Prisma schema)
    // 2. Send email notification
    // 3. Integrate with a third-party service
    
    // For now, we'll just log it and return success
    console.log('Contact form submission:', {
      name,
      email,
      phone: phone || 'Not provided',
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Add database storage
    // Example:
    // await prisma.contact.create({
    //   data: {
    //     name,
    //     email,
    //     phone: phone || null,
    //     subject,
    //     message,
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you soon.',
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form submission' },
      { status: 500 }
    );
  }
}

