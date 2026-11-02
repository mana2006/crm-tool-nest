import { EmailTemplate } from '@/shared/constants/mail.constants';

export interface SendEmailTemplateOptionDto {
  to: string;
  template: EmailTemplate;
  context: Record<string, unknown>;
}

export interface ResetPasswordContext {
  resetUrl: string;
  name: string;
}
