import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to send email (you can replace this with your email service)
async function sendEmail(to: string, subject: string, html: string) {
  // TODO: Implement actual email sending using your preferred service
  // Examples: nodemailer, Resend, SendGrid, AWS SES, etc.
  
  // For now, we'll log the email details
  console.log('Email would be sent:', {
    to,
    subject,
    html,
    timestamp: new Date().toISOString(),
  });

  // Example with nodemailer (uncomment and configure):
  /*
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  });
  */

  return true;
}

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

    // Save message to database
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        isRead: false,
      },
    });

    // Get all active contact emails from database
    const contactEmails = await prisma.contactEmail.findMany({
      where: {
        isActive: true,
      },
    });

    // If no contact emails are configured, just save and return success
    if (contactEmails.length === 0) {
      console.log('Contact form submission (no emails configured):', {
        name,
        email,
        phone: phone || 'Not provided',
        subject,
        message,
        messageId: savedMessage.id,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: 'Your message has been received. We will get back to you soon.',
      });
    }

    // Prepare email content
    const emailSubject = `New Contact Form Submission: ${subject}`;
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
    `;

    // Send email to all active contact emails
    const emailPromises = contactEmails.map(contactEmail =>
      sendEmail(contactEmail.email, emailSubject, emailHtml)
    );

    // Wait for all emails to be sent (or logged)
    await Promise.all(emailPromises);

    console.log('Contact form submission processed:', {
      name,
      email,
      phone: phone || 'Not provided',
      subject,
      message,
      messageId: savedMessage.id,
      sentTo: contactEmails.map(e => e.email),
      timestamp: new Date().toISOString(),
    });

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

