process.env.DATABASE_URL ??=
  'postgres://postgres:postgres@localhost:5432/crm_test';
process.env.JWT_ACCESS_SECRET ??= 'test-access-secret';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret';
process.env.SMTP_HOST ??= 'localhost';
process.env.SMTP_PORT ??= '1025';
process.env.SMTP_SERVICE ??= 'test';
process.env.SMTP_USER ??= 'test';
process.env.SMTP_PASSWORD ??= 'test';
