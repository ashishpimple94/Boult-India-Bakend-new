const nodemailer = require('nodemailer');
require('dotenv').config({ path: './boult-backend/.env' });

async function testContactEmail() {
  console.log('🧪 Testing Contact Email with Hostinger SMTP...\n');
  
  console.log('📧 SMTP Settings:');
  console.log('Host:', 'smtp.hostinger.com');
  console.log('Port:', 465);
  console.log('Secure:', true);
  console.log('User:', process.env.HOSTINGER_EMAIL);
  console.log('Pass:', process.env.HOSTINGER_PASSWORD ? '***' + process.env.HOSTINGER_PASSWORD.slice(-3) : 'NOT SET');
  console.log('');

  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_PASSWORD
    },
    debug: true,
    logger: true
  });

  try {
    // Verify connection
    console.log('🔍 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified!\n');

    // Send test email
    console.log('📤 Sending test contact email...');
    const info = await transporter.sendMail({
      from: `"Boult India Contact" <${process.env.HOSTINGER_EMAIL}>`,
      to: 'vtechmultisolutions@gmail.com',
      cc: process.env.HOSTINGER_EMAIL,
      subject: '[Test] Contact Form Test',
      html: `
        <h1>Test Contact Form Submission</h1>
        <p><strong>Name:</strong> Test User</p>
        <p><strong>Email:</strong> test@example.com</p>
        <p><strong>Enquiry Type:</strong> General Inquiry</p>
        <p><strong>Subject:</strong> Testing Contact Form</p>
        <p><strong>Message:</strong> This is a test message to verify the contact form email is working.</p>
        <hr>
        <p><small>Sent at: ${new Date().toISOString()}</small></p>
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testContactEmail();
