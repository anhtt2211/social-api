module.exports = {
  type: process.env.DATABASE_ENGINE,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: [process.env.TYPEORM_MIGRATIONS],
  logging: process.env.TYPEORM_LOGGING === "true" ? true : false,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true" ? true : false,
  migrationRun: process.env.TYPEORM_MIGRATION_RUN,
  migrationsTableName: "migrations",
  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
  },
};
