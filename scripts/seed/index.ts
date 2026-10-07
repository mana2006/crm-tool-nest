// #!/usr/bin/env node

import { seedRoles } from '../seed.roles';
import { seedUsers } from '../seed.users';

// import { spawnSync } from "node:child_process";

// spawnSync("pnpm", ['exec', 'tsx', 'scripts/seed.ts']);

// const stages = [
//   'scripts/seed.roles.ts',
//   'scripts/seed.users.ts',
// ];

// const pnpm = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

// for (const stage of stages) {
//   const result = spawnSync(pnpm, ['exec', 'tsx', stage], {
//     env: process.env,
//     stdio: 'inherit',
//     shell: true,
//   });

//   if (result.error) {
//     console.error(`Seed stage failed to start: ${stage}`);
//     console.error(result.error);
//     process.exit(1);
// }

//   if (result.status !== 0) {
//     process.exit(result.status ?? 1);
//   }
// }

async function main() {
  console.log('Starting database seed...\n');

  await seedRoles();
  await seedUsers();

  console.log('\nDatabase seed completed successfully!');
}

main().catch((error) => {
  console.error('\nDatabase seed failed:');
  console.error(error);

  process.exit(1);
});
