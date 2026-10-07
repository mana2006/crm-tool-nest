import { db } from '../src/database/drizzle';
import { roles } from '../src/database/schema';

export async function seedRoles() {
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
