import { Inject, Module } from '@nestjs/common';
import {
  DrizzleAsyncProvider,
  drizzleProvider,
  PG_POOL,
} from './drizzle.provider';
import { Pool } from 'pg';

@Module({
  providers: [...drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onModuleDestroy() {
    await this.pool.end();
  }
}
