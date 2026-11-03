import { MailService } from '@/shared/mail/mail.service';
import { MailProcessor } from '@/shared/mail/processors/mail.processor';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

@Module({
  imports: [BullModule.registerQueue({ name: 'mail' })],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
