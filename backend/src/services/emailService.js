"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.sendParkingEmail = void 0;var _email = require("../config/email");

// Combined Email: Registration + Approval Flow
const sendParkingEmail = async (options) =>









{
  const {
    to,
    name,
    email,
    password,
    rollNumber,
    vehicleNumber,
    slotId,
    slotZone,
    isApproved
  } = options;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">🏫 Smart Campus Parking</h1>
      </div>
      
      <div style="padding: 30px 20px; background: #ffffff;">
        <h2 style="color: #059669; margin-top: 0;">Hello, ${name}</h2>
        
        ${!isApproved ? `
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your parking registration request has been successfully received and is currently under review.
        </p>
        ` : `
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your parking request has been approved and your slot has been successfully allotted.
        </p>
        `}

        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">📋 Student Details</h3>
          <table style="width: 100%; color: #374151;">
            <tr>
              <td><strong>Name:</strong></td>
              <td>${name}</td>
            </tr>
            <tr>
              <td><strong>Email:</strong></td>
              <td>${email}</td>
            </tr>
            <tr>
              <td><strong>Roll Number:</strong></td>
              <td>${rollNumber}</td>
            </tr>
            <tr>
              <td><strong>Vehicle Number:</strong></td>
              <td>${vehicleNumber}</td>
            </tr>
          </table>
        </div>

        ${!isApproved ? `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; color: #92400e; font-weight: 600;">⏱️ Slot Allocation in 48 Hours</p>
          <p style="margin: 8px 0 0 0; color: #92400e; font-size: 14px;">
            Your parking slot will be allotted within 48 hours.
          </p>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0;">🔐 Portal Login Credentials</h3>
          <p><strong>Username:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        ` : `
        <div style="background: #ecfdf5; border: 2px solid #059669; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin-top: 0; text-align: center;">🅿️ Parking Slot Details</h3>
          <p style="text-align:center; font-size: 24px; font-weight: bold; color: #059669;">${slotId}</p>
          ${slotZone ? `<p style="text-align:center; color:#6b7280;">${slotZone}</p>` : ''}
        </div>

        <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 4px;">
          <h4 style="color: #1e40af; margin-top: 0;">📍 Collect Your Parking Sticker</h4>
          <p style="color: #1e40af;">Please visit <strong>Admin Bhavan</strong> to collect your parking sticker at the earliest.</p>
        </div>
        `}

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          This is an automated email from Smart Campus Parking System.
        </p>
      </div>
    </div>
  `;

  const payload = {
    to,
    subject: isApproved ?
    'Parking Slot Allotted - Collect Your Sticker' :
    'Parking Registration Received - Processing',
    html,
    secret: process.env.EMAIL_API_SECRET || 'fallback_secret_campus_parking_123'
  };

  try {
    const vercelUrl = process.env.FRONTEND_URL || 'https://campusconnect-kappa-sable.vercel.app';
    const response = await fetch(`${vercelUrl}/api/sendEmail`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Vercel API responded with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Email successfully handed off to Vercel:', data.messageId || 'Success');
    return data;
  } catch (error) {
    console.error('❌ Failed to hand off email to Vercel:', error);
    throw error;
  }
};exports.sendParkingEmail = sendParkingEmail;