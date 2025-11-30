import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to send email using settings from database
async function sendEmail(to: string, subject: string, html: string, emailSettings: any) {
  // Check if email is enabled
  if (!emailSettings.emailEnabled) {
    console.log('Email sending is disabled in settings');
    return false;
  }

  // Check if all required settings are provided
  if (!emailSettings.smtpHost || !emailSettings.smtpUser || !emailSettings.smtpPass || !emailSettings.fromEmail) {
    console.log('Email settings are incomplete:', {
      hasHost: !!emailSettings.smtpHost,
      hasUser: !!emailSettings.smtpUser,
      hasPass: !!emailSettings.smtpPass,
      hasFrom: !!emailSettings.fromEmail,
    });
    return false;
  }

  try {
    // Try to use nodemailer if available
    let nodemailer;
    try {
      nodemailer = require('nodemailer');
    } catch (e) {
      console.log('Nodemailer is not installed. Install it with: npm install nodemailer');
      console.log('Email would be sent:', {
        to,
        subject,
        from: emailSettings.fromEmail,
        timestamp: new Date().toISOString(),
      });
      return false;
    }

    console.log('Attempting to send email with settings:', {
      host: emailSettings.smtpHost,
      port: emailSettings.smtpPort,
      user: emailSettings.smtpUser,
      from: emailSettings.fromEmail,
      to,
    });

    const transporter = nodemailer.createTransport({
      host: emailSettings.smtpHost,
      port: parseInt(emailSettings.smtpPort || '587'),
      secure: parseInt(emailSettings.smtpPort || '587') === 465,
      requireTLS: parseInt(emailSettings.smtpPort || '587') === 587, // Require TLS for port 587
      auth: {
        user: emailSettings.smtpUser,
        pass: emailSettings.smtpPass,
      },
      tls: {
        // Allow self-signed certificates (useful for some hosting providers)
        rejectUnauthorized: false,
      },
      // Add connection timeout
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verify connection before sending
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    await transporter.sendMail({
      from: emailSettings.fromEmail,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully to:', to);
    return true;
  } catch (error: any) {
    console.error('Error sending email:', {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
      command: error.command,
      host: emailSettings.smtpHost,
    });
    
    // If connection to wrong server (Microsoft 365), suggest checking SMTP host
    if (error.response && error.response.includes('OUTLOOK.COM')) {
      console.error('⚠️ Warning: Connection to Microsoft 365 detected. Make sure SMTP host is set to cPanel server (mail.alfagolden.com or smtp.alfagolden.com)');
    }
    
    return false;
  }
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

    // Get email settings from database
    const siteSettings = await prisma.siteSettings.findFirst();
    
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

    // Send email to all active contact emails if email settings are configured
    if (siteSettings) {
      const emailPromises = contactEmails.map(contactEmail =>
        sendEmail(contactEmail.email, emailSubject, emailHtml, {
          emailEnabled: siteSettings.emailEnabled,
          smtpHost: siteSettings.smtpHost,
          smtpPort: siteSettings.smtpPort,
          smtpUser: siteSettings.smtpUser,
          smtpPass: siteSettings.smtpPass,
          fromEmail: siteSettings.fromEmail,
        })
      );

      // Wait for all emails to be sent
      await Promise.all(emailPromises);
    } else {
      console.log('Email settings not found in database');
    }

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

