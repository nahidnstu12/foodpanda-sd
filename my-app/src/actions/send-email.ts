"use server";
import { emailService } from "../lib/email-service";

// Legacy function for backward compatibility
export async function sendEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  return emailService.sendCustomEmail(
    email,
    `New message from ${name}`,
    `<h2>Message from ${name}</h2><p>${message}</p>`,
    `Message from ${name}: ${message}`,
    { replyTo: email }
  );
}

// New email functions using templates
export async function sendWelcomeEmail(email: string, userName: string) {
  return emailService.sendWelcomeEmail(email, userName);
}

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verificationLink: string
) {
  return emailService.sendVerificationEmail(email, userName, verificationLink);
}

export async function sendPasswordResetEmail(
  email: string,
  userName: string,
  resetLink: string
) {
  return emailService.sendPasswordResetEmail(email, userName, resetLink);
}

export async function sendOrderConfirmationEmail(
  email: string,
  userName: string,
  orderDetails: any,
  restaurantName: string
) {
  return emailService.sendOrderConfirmationEmail(
    email,
    userName,
    orderDetails,
    restaurantName
  );
}

export async function sendRiderAssignmentEmail(
  email: string,
  userName: string,
  riderName: string,
  orderDetails: any
) {
  return emailService.sendRiderAssignmentEmail(
    email,
    userName,
    riderName,
    orderDetails
  );
}

export async function sendPartnerWelcomeEmail(
  email: string,
  partnerName: string
) {
  return emailService.sendPartnerWelcomeEmail(email, partnerName);
}

export async function sendRiderWelcomeEmail(email: string, riderName: string) {
  return emailService.sendRiderWelcomeEmail(email, riderName);
}

// Utility function to verify email configuration
export async function verifyEmailConfig() {
  return emailService.verifyConnection();
}
