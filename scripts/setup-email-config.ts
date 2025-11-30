/**
 * Script to setup email configuration
 * Run with: tsx scripts/setup-email-config.ts
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function setupEmailConfig() {
  try {
    console.log('Setting up email configuration...\n');

    // 1. Update SMTP settings in SiteSettings
    let siteSettings = await prisma.siteSettings.findFirst();
    
    const emailConfig = {
      fromEmail: 'contactus_madinah@alfagolden.com',
      smtpUser: 'contactus_madinah@alfagolden.com',
      smtpPass: 'hj]$wcdNI8Cu(7;V',
      smtpHost: 'mail.alfagolden.com', // cPanel SMTP server (usually mail.domain.com or smtp.domain.com)
      smtpPort: '587', // Port 587 for TLS (cPanel standard) - alternative: 465 for SSL
      emailEnabled: true,
    };

    if (siteSettings) {
      siteSettings = await prisma.siteSettings.update({
        where: { id: siteSettings.id },
        data: emailConfig,
      });
      console.log('✅ SMTP settings updated in SiteSettings');
    } else {
      siteSettings = await prisma.siteSettings.create({
        data: emailConfig,
      });
      console.log('✅ SMTP settings created in SiteSettings');
    }

    console.log('\nSMTP Configuration:');
    console.log(`  From Email: ${siteSettings.fromEmail}`);
    console.log(`  SMTP Host: ${siteSettings.smtpHost}`);
    console.log(`  SMTP Port: ${siteSettings.smtpPort}`);
    console.log(`  SMTP User: ${siteSettings.smtpUser}`);
    console.log(`  Email Enabled: ${siteSettings.emailEnabled}`);

    // 2. Add recipient email to ContactEmail
    const recipientEmail = 'essam.os@madinashadows.com';
    
    const existingEmail = await prisma.contactEmail.findUnique({
      where: { email: recipientEmail },
    });

    if (existingEmail) {
      // Update to ensure it's active
      await prisma.contactEmail.update({
        where: { id: existingEmail.id },
        data: { isActive: true },
      });
      console.log(`\n✅ Contact email already exists and is now active: ${recipientEmail}`);
    } else {
      await prisma.contactEmail.create({
        data: {
          email: recipientEmail,
          isActive: true,
        },
      });
      console.log(`\n✅ Contact email added as recipient: ${recipientEmail}`);
    }

    console.log('\n✅ Email configuration setup completed!');
    console.log('\n📝 cPanel Email Configuration:');
    console.log('  - SMTP Host: mail.alfagolden.com (cPanel standard)');
    console.log('  - Alternative: smtp.alfagolden.com (also works with cPanel)');
    console.log('  - SMTP Port: 587 (TLS) - recommended for cPanel');
    console.log('  - Alternative ports: 465 (SSL) or 25 (non-encrypted, not recommended)');
    console.log('  - Username: Full email address (contactus_madinah@alfagolden.com)');
    console.log('  - Password: Email account password from cPanel');
    console.log('\n💡 To find exact SMTP settings in cPanel:');
    console.log('  1. Login to cPanel');
    console.log('  2. Go to "Email Accounts"');
    console.log('  3. Click "Connect Devices" or "Configure Mail Client"');
    console.log('  4. Check SMTP settings shown there');

  } catch (error) {
    console.error('❌ Error setting up email configuration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupEmailConfig();

