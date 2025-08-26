import nodemailer from "nodemailer";
import { emailTemplates, EmailTemplateData } from "./email-templates";

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface SendEmailParams extends EmailOptions {
  template: keyof typeof emailTemplates;
  data: EmailTemplateData;
  from?: string;
  subject?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;

  constructor(config?: EmailConfig) {
    // Use provided config or default to Gmail
    const emailConfig = config || {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || process.env.GMAIL_USERNAME || "",
        pass: process.env.SMTP_PASS || process.env.GMAIL_PASSWORD || "",
      },
    };

    this.transporter = nodemailer.createTransport(emailConfig);
    this.defaultFrom = process.env.SMTP_FROM || emailConfig.auth.user;
  }

  /**
   * Send email using a template
   */
  async sendTemplateEmail(params: SendEmailParams) {
    const { template, data, to, cc, bcc, replyTo, attachments, from, subject } =
      params;

    const templateData = emailTemplates[template](data);

    const mailOptions: nodemailer.SendMailOptions = {
      from: from || this.defaultFrom,
      to: Array.isArray(to) ? to.join(", ") : to,
      cc: cc ? (Array.isArray(cc) ? cc.join(", ") : cc) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.join(", ") : bcc) : undefined,
      replyTo: replyTo,
      subject: subject || templateData.subject,
      text: templateData.text,
      html: templateData.html,
      attachments: attachments,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId,
        message: "Email sent successfully!",
      };
    } catch (error) {
      console.error("Email sending failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to send email.",
      };
    }
  }

  /**
   * Send welcome email to new users
   */
  async sendWelcomeEmail(to: string, userName: string) {
    return this.sendTemplateEmail({
      to,
      template: "welcome",
      data: { userName },
    });
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(
    to: string,
    userName: string,
    verificationLink: string
  ) {
    return this.sendTemplateEmail({
      to,
      template: "emailVerification",
      data: { userName, verificationLink },
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    userName: string,
    resetLink: string
  ) {
    return this.sendTemplateEmail({
      to,
      template: "passwordReset",
      data: { userName, resetLink },
    });
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmationEmail(
    to: string,
    userName: string,
    orderDetails: any,
    restaurantName: string
  ) {
    return this.sendTemplateEmail({
      to,
      template: "orderConfirmation",
      data: { userName, orderDetails, restaurantName },
    });
  }

  /**
   * Send rider assignment notification
   */
  async sendRiderAssignmentEmail(
    to: string,
    userName: string,
    riderName: string,
    orderDetails: any
  ) {
    return this.sendTemplateEmail({
      to,
      template: "riderAssignment",
      data: { userName, riderName, orderDetails },
    });
  }

  /**
   * Send partner welcome email
   */
  async sendPartnerWelcomeEmail(to: string, partnerName: string) {
    return this.sendTemplateEmail({
      to,
      template: "partnerWelcome",
      data: { partnerName },
    });
  }

  /**
   * Send rider welcome email
   */
  async sendRiderWelcomeEmail(to: string, riderName: string) {
    return this.sendTemplateEmail({
      to,
      template: "riderWelcome",
      data: { riderName },
    });
  }

  /**
   * Send custom email with custom subject and content
   */
  async sendCustomEmail(
    to: string | string[],
    subject: string,
    htmlContent: string,
    textContent?: string,
    options?: Omit<EmailOptions, "to">
  ) {
    const mailOptions: nodemailer.SendMailOptions = {
      from: this.defaultFrom,
      to: Array.isArray(to) ? to.join(", ") : to,
      cc: options?.cc
        ? Array.isArray(options.cc)
          ? options.cc.join(", ")
          : options.cc
        : undefined,
      bcc: options?.bcc
        ? Array.isArray(options.bcc)
          ? options.bcc.join(", ")
          : options.bcc
        : undefined,
      replyTo: options?.replyTo,
      subject,
      html: htmlContent,
      text: textContent,
      attachments: options?.attachments,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId,
        message: "Email sent successfully!",
      };
    } catch (error) {
      console.error("Email sending failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to send email.",
      };
    }
  }

  /**
   * Send bulk emails using a template
   */
  async sendBulkTemplateEmails(
    recipients: Array<{ email: string; data: EmailTemplateData }>,
    template: keyof typeof emailTemplates,
    options?: Omit<EmailOptions, "to">
  ) {
    const results = [];

    for (const recipient of recipients) {
      const result = await this.sendTemplateEmail({
        to: recipient.email,
        template,
        data: recipient.data,
        ...options,
      });
      results.push({ email: recipient.email, result });
    }

    return results;
  }

  /**
   * Verify email configuration
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      return { success: true, message: "Email configuration is valid" };
    } catch (error) {
      console.error("Email configuration verification failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Email configuration verification failed",
      };
    }
  }

  /**
   * Close transporter connection
   */
  async close() {
    if (this.transporter) {
      await this.transporter.close();
    }
  }
}

// Create default instance
export const emailService = new EmailService();

// Export individual methods for convenience
export const {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendRiderAssignmentEmail,
  sendPartnerWelcomeEmail,
  sendRiderWelcomeEmail,
} = emailService;
