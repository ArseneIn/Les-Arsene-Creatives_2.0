import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    void this.initTransporter();
  }

  private async initTransporter() {
    // Check if we have real SMTP credentials in env
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.logger.log('Production SMTP Mailer initialized.');
    } else {
      // Create a testing account on Ethereal (fake SMTP)
      try {
        const testAccount = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
          },
        });
        this.logger.log(
          'Ethereal Mailer initialized for testing. Emails will not actually be sent.',
        );
      } catch (err) {
        this.logger.error('Failed to create ethereal test account', err);
      }
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    if (!this.transporter) {
      this.logger.error('Transporter is not initialized.');
      return;
    }

    // Determine the frontend URL based on the environment
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.transporter.sendMail({
        from: '"Typespire Support" <support@typespire.com>',
        to,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click the link to reset your password: ${resetLink} \n\nIf you did not request this, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #094A71; margin-bottom: 20px;">Password Reset</h2>
            <p style="color: #334155; line-height: 1.6;">You recently requested to reset your password for your Typespire account. Click the button below to proceed.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" style="background-color: #33B974; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #64748b; font-size: 14px; line-height: 1.5;">If you did not request a password reset, please ignore this email or reply to let us know. This password reset is only valid for the next hour.</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="color: #94a3b8; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} Typespire. All rights reserved.</p>
          </div>
        `,
      });

      this.logger.log(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Password reset email sent to ${to}. Message ID: ${info.messageId}`,
      );

      // If we are using ethereal, log the preview URL
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        this.logger.log(`Ethereal Preview URL: ${previewUrl}`);
      }
    } catch (err) {
      this.logger.error('Failed to send password reset email', err);
      throw err;
    }
  }
}
