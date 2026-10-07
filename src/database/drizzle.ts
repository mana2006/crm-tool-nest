import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
// You can specify any property from the node-postgres connection options
export const db = drizzle(process.env.DATABASE_URL!);
// const db = drizzle({
//   connection: {
//     connectionString: process.env.DATABASE_URL!,
//     // ssl: true
//   }
// });

// async function testConnection() {
//   try {
//     await db.execute('SELECT 1');

//     console.log('✅ Database connected successfully');
//   } catch (error) {
//     console.error('❌ Database connection failed');
//     console.error(error);
//   }
// }

// testConnection();
