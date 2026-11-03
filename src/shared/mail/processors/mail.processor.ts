import { KeyEmailTemplate } from '@/shared/constants/mail.constants';
import {
  ResetPasswordContext,
  SendEmailTemplateOptionDto,
} from '@/shared/mail/presentation/dto/mail.dto';
import ResetPasswordTemplate from '@/modules/auth/mail/reset-password';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { render } from '@react-email/components';
import { Job } from 'bullmq';
import nodemailer, {
  Mail,
  SMTPSentMessageInfo,
  SMTPTransportOptions,
} from 'nodemailer';
import React from 'react';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/config/envs';

@Processor('mail')
export class MailProcessor extends WorkerHost {
  private readonly transporter: Mail<SMTPSentMessageInfo, SMTPTransportOptions>;

  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly config: ConfigService<Env, true>) {
    super();
    this.transporter = nodemailer.createTransport({
      host: this.config.get('SMTP_HOST'),
      port: this.config.get('SMTP_PORT'),
      secure: this.config.get('SMTP_SECURE'),
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASSWORD'),
      },
    });
  }

  @OnWorkerEvent('ready')
  onWorkerReady(): void {
    this.logger.log('Mail worker is ready');
  }

  @OnWorkerEvent('error')
  onWorkerError(error: Error): void {
    this.logger.error('Mail worker error', error.stack);
  }

  async process(job: Job<SendEmailTemplateOptionDto>): Promise<void> {
    this.logger.log(
      `Processing mail job ${job.id} of type ${job.data.template}`,
    );

    if (!job.data.template || !job.data.to) {
      throw new Error('Unknown email');
    }

    try {
      switch (job.data.template) {
        case KeyEmailTemplate.RESET_PASSWORD:
          const contextReset = job.data
            .context as unknown as ResetPasswordContext;

          await this.transporter.sendMail({
            from: {
              name: this.config.get('MAIL_FROM_NAME'),
              address: this.config.get('MAIL_FROM'),
            },
            to: job.data.to,
            subject: 'Reset password',
            html: await render(
              React.createElement(ResetPasswordTemplate, {
                name: contextReset.name,
                resetUrl: contextReset.resetUrl,
              }),
            ),
          });
          break;
      }
      this.logger.log(`Mail job ${job.id} completed`);
    } catch (error) {
      this.logger.error(`Mail job ${job.id} failed`, error);
      throw error;
    }
  }
}
