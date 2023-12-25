export default () => ({
  serverPort: parseInt(process.env.SERVER_PORT, 10) || 3000,
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
