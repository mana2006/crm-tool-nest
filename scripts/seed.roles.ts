import { roles } from '../src/database/drizzle/schema';
import { DB } from './seeds';

export async function seedRoles(db: DB) {
  console.log('Seeding roles...\n');

  await db
    .insert(roles)
    .values([
      {
        name: 'Admin Role',
        slug: 'admin',
      },
      {
        name: 'Manager Role',
        slug: 'manager',
      },
      {
        name: 'Staff Role',
        slug: 'staff',
      },
    ])
    .onConflictDoNothing({ target: roles.slug });

  console.log('Seeding roles sucessfully! \n');
}
