require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('🔍 Checking SMTP Configuration...');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-3) : 'NOT SET');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  debug: true, // Enable debug output
  logger: true // Log to console
});

console.log('\n🧪 Testing SMTP connection...');

// Verify connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ SMTP Connection Failed:', error);
    process.exit(1);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
    
    // Send test email
    const mailOptions = {
      from: `"Boult India Test" <${process.env.SMTP_USER}>`,
      to: 'ashishpimple94@gmail.com',
      cc: process.env.ADMIN_EMAIL,
      subject: 'Test Email from Boult India',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from Boult India order system.</p>
        <p>If you receive this, the email system is working correctly!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    };

    console.log('\n📧 Sending test email...');
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Email sending failed:', error);
        process.exit(1);
      } else {
        console.log('✅ Email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log('📝 Response:', info.response);
        process.exit(0);
      }
    });
  }
});
