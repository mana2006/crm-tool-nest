import { DrizzleModule } from '@/database/drizzle/drizzle.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DrizzleModule,
  ],
})
export class SeedModule {}
