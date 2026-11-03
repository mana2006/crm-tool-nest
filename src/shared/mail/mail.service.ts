import {
  EmailTemplate,
  KeyEmailTemplate,
} from '@/shared/constants/mail.constants';
import { SendEmailTemplateOptionDto } from '@/shared/mail/presentation/dto/mail.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async addMailJob(template: EmailTemplate, data: SendEmailTemplateOptionDto) {
    try {
      await this.mailQueue.add(template, data, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 3000,
        },
        removeOnComplete: {
          age: 24 * 3600,
          count: 1000,
        },
        removeOnFail: {
          age: 7 * 24 * 3600,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendForgotPasswordEmail(data: SendEmailTemplateOptionDto) {
    await this.addMailJob(KeyEmailTemplate.RESET_PASSWORD, data);
  }
}
