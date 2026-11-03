import * as argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { roles, users } from '../src/database/drizzle/schema';
import { UserStatus } from '../src/shared/constants/user.constants';
import { DB } from './seeds';

export async function seedUsers(db: DB) {
  console.log('Seeding users...\n');
  const passwordHash = await argon2.hash('Password123!');

  const [adminRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.slug, 'admin'));
  const [managerRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.slug, 'manager'));
  const [staffRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.slug, 'staff'));

  await db
    .insert(users)
    .values([
      {
        email: 'admin@example.com',
        firstName: 'admin',
        lastName: 'admin',
        password: passwordHash,
        roleId: adminRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: new Date(),
        mfaEnabled: false,
      },
      {
        email: 'manager@example.com',
        firstName: 'manager',
        lastName: 'manager',
        password: passwordHash,
        roleId: managerRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: new Date(),
        mfaEnabled: false,
      },
      {
        email: 'staff@example.com',
        firstName: 'staff',
        lastName: 'staff',
        password: passwordHash,
        roleId: staffRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: new Date(),
        mfaEnabled: false,
      },
      {
        email: 'user01@example.com',
        firstName: '01',
        lastName: 'user',
        password: passwordHash,
        roleId: adminRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: new Date(),
      },
      {
        email: 'user02@example.com',
        firstName: '02',
        lastName: 'user',
        password: passwordHash,
        roleId: managerRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: null,
      },
      {
        email: 'user03@example.com',
        firstName: '03',
        lastName: 'user',
        password: passwordHash,
        roleId: staffRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: null,
      },
      {
        email: 'user04@example.com',
        firstName: '04',
        lastName: 'user',
        password: passwordHash,
        roleId: adminRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: null,
      },
      {
        email: 'user05@example.com',
        firstName: '05',
        lastName: 'user',
        password: passwordHash,
        roleId: managerRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: null,
      },
      {
        email: 'user06@example.com',
        firstName: '06',
        lastName: 'user',
        password: passwordHash,
        roleId: staffRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: null,
      },
      {
        email: 'user07@example.com',
        firstName: '07',
        lastName: 'user',
        password: passwordHash,
        roleId: staffRole.id,
        status: UserStatus.PENDING,
        emailVerifiedAt: null,
      },
    ])
    .onConflictDoNothing({ target: users.email });

  console.log('Seeding users sucessfully! \n');
}
