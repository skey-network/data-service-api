const { env } = process

export default () => ({
  app: {
    port: Number(env.APP_PORT ?? '3000'),
    defaultPaginationLimit: Number(env.APP_DEFAULT_PAGINATION_LIMIT ?? '25'),
    maxPaginationLimit: Number(env.APP_MAX_PAGINATION_LIMIT ?? '1000'),
    requireApiKey: (env.APP_REQUIRE_API_KEY ?? 'true') === 'true',
    apiKey: env.APP_API_KEY ?? 'super-secret-api-key'
  },
  database: {
    name: env.DB_NAME ?? 'admin',
    host: env.DB_HOST ?? 'localhost',
    port: Number(env.DB_PORT ?? '27017'),
    username: env.DB_USERNAME ?? 'root',
    password: env.DB_PASSWORD ?? 'password'
  }
})
