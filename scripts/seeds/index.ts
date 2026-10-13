// #!/usr/bin/env node

import * as schema from '@/database/drizzle/schema';
import { NestFactory } from '@nestjs/core';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { seedRoles } from '../seed.roles';
import { seedUsers } from '../seed.users';
import { SeedModule } from './seed.module';
import { DrizzleAsyncProvider } from '@/database/drizzle/drizzle.provider';

export type DB = NodePgDatabase<typeof schema>;

async function main() {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const db = app.get<DB>(DrizzleAsyncProvider);
    console.log('Starting database seed...\n');

    await seedRoles(db);
    await seedUsers(db);

    console.log('\nDatabase seed completed successfully!');
  } catch (error) {
    console.error('\nDatabase seed failed:');
    console.error(error);

    process.exit(1);
  } finally {
    await app.close();
  }
}

main();
