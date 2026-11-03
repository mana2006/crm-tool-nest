export const KeyEmailTemplate = {
  WELCOME: 'welcome',
  VERIFY_EMAIL: 'verify-email',
  RESET_PASSWORD: 'reset-password',
  TWO_FACTOR_AUTH: '2fa-code',
  PASSWORD_CHANGED: 'password-changed',
};

export type EmailTemplate =
  (typeof KeyEmailTemplate)[keyof typeof KeyEmailTemplate];
