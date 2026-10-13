import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';

import * as schema from '@/database/drizzle/schema';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

export const DrizzleAsyncProvider = Symbol('DrizzleAsyncProvider');
export const PG_POOL = Symbol('PG_POOL');
export type DrizzleDB = NodePgDatabase<typeof schema>;

export const drizzleProvider = [
  {
    provide: PG_POOL,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const pool = new Pool({
        connectionString: config.get<string>('DATABASE_URL'),
        max: 10,
      });
      pool.on('error', (err) => console.error('Unexpected PG pool error', err));
      return pool;
    },
  },
  {
    provide: DrizzleAsyncProvider,
    inject: [PG_POOL],
    useFactory: (pool: Pool) => drizzle(pool, { schema }),
  },
];
