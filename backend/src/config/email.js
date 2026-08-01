"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.verifyEmailConfig = exports.transporter = exports.sendEmail = void 0;var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _dotenv = _interopRequireDefault(require("dotenv"));function _interopRequireDefault(e) {return e && e.__esModule ? e : { default: e };}

_dotenv.default.config();

// Create email transporter
const transporter = exports.transporter = _nodemailer.default.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  connectionTimeout: 5000, // Fail fast (5 seconds) if SMTP is blocked
  greetingTimeout: 5000,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration on startup
const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error);
    console.log('⚠️  Emails will be logged to console instead of being sent');
    return false;
  }
};

// Send email wrapper with fallback to console logging
exports.verifyEmailConfig = verifyEmailConfig;const sendEmail = async (options) =>




{
  const { to, subject, html, text } = options;

  // Always log email for debugging
  console.log('\n📧 === EMAIL ===');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`From: ${process.env.EMAIL_FROM}`);
  console.log('=================\n');

  // If email is not configured, just log and return success
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS ||
  process.env.EMAIL_USER === 'your-email@gmail.com') {
    console.log('⚠️  Email not configured. Add EMAIL_USER and EMAIL_PASS to .env file');
    console.log('📧 Email content (HTML):', html.substring(0, 200) + '...');
    return { success: true, messageId: 'console-logged' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Campus Parking <noreply@campus.edu>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    });

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    throw error;
  }
};exports.sendEmail = sendEmail;