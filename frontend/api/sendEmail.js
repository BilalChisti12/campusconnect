import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  // Set CORS headers so the backend can hit this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { to, subject, html, text, secret } = req.body;

    // Verify secret to prevent abuse of this public Vercel endpoint
    const expectedSecret = process.env.EMAIL_API_SECRET || 'fallback_secret_campus_parking_123';
    if (secret !== expectedSecret) {
      return res.status(401).json({ success: false, message: 'Unauthorized Email Request' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️ Email environment variables not configured on Vercel.');
      return res.status(200).json({ success: true, message: 'Simulated email sent (no env vars)' });
    }

    // Create the transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // STARTTLS
      connectionTimeout: 10000,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Campus Parking <noreply@campus.edu>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '') // Strip HTML tags for fallback
    });

    console.log('✅ Email successfully sent via Vercel:', info.messageId);
    return res.status(200).json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('❌ Failed to send email via Vercel:', error);
    return res.status(500).json({ success: false, message: 'Vercel SMTP Error', error: error.message });
  }
}
