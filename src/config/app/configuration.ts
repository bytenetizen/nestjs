function validateBoolean(input: boolean | string): boolean {
  if (typeof input === 'string') {
    const lowercaseInput = input.toLowerCase();
    if (lowercaseInput === 'true') {
      return true;
    } else if (lowercaseInput === 'false') {
      return false;
    }
  }
  return !!input;
}
export default () => ({
  serverPort: parseInt(process.env.SERVER_PORT, 10) || 3000,
  saltRounds: parseInt(process.env.SALT_ROUNDS, 13) || 13,
  accessTokenSecret:
    process.env.APP_ACCESS_TOKEN_PRIVATE_KEY || 'bu!a2L&IND6kTs',
  refreshTokenSecret:
    process.env.APP_REFRESH_TOKEN_PRIVATE_KEY || 'NWM<0B1-cVIm',
  accessTokenTime: process.env.APP_ACCESS_TOKEN_TIME || 16,
  refreshTokenTime: process.env.APP_REFRESH_TOKEN_TIME || 30240,
  isUseBlacklist: validateBoolean(process.env.IS_USE_BLACKLIST || false),
  isUseBlacklistBd: validateBoolean(process.env.IS_USE_BLACKLIST_BD || false),
  isUseBlacklistFile: validateBoolean(
    process.env.IS_USE_BLACKLIST_FILE || false,
  ),
  db: {
    postgres: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_DATABASE || 'valun',
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    },
    mongo: {
      mongoHost: process.env.MONGO_HOST || 'mongodb://127.0.0.1:27017/errors',
    },
    redis: {
      redisHost: process.env.REDIS_HOST || '127.0.0.1',
      redisPort: process.env.REDIS_PORT || 6379,
    },
  },
});
