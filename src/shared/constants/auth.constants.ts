export const COOKIES = {
  REFRESH_TOKEN: 'refresh_token',
  ACCESS_TOKEN: 'access_token',
  PAYLOAD_TOKEN: 'payload_token',
  TWO_FACTORY_VERIFIED: 'two_factor_verified',
  PASSWORD_VERIFICATION_TOKEN: 'password_verification_token',
};

export const resetTokenKey = (hashToken: string) =>
  `reset-password:token:${hashToken}`;
export const resetUserKey = (userId: number) => `reset-password:user:${userId}`;
// export const RESET_PASSWORD_TTL_SECONDS = 15 * 60
export const RESET_PASSWORD_TTL_SECONDS = 2 * 60;
export const BLACKLIST_TTL_SECONDS = 15 * 60;
export const blackListKey = (sessionId: string) =>
  `black-list:sessionId:${sessionId}`;
export const RESET_REASON = {
  LOGOUT: 'logout',
  RESET_PASSWORD: 'reset password',
};
