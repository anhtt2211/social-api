const path = require("path");

const ormconfigs = {
  type: process.env.DATABASE_ENGINE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    path.join(
      __dirname,
      process.env.NODE_ENV === "production" ? "/dist" : "/src",
      "/modules/**/core/entities/**/*.entity{.ts,.js}"
    ),
  ],
  migrations: [
    path.join(
      __dirname,
      process.env.NODE_ENV === "production" ? "/dist" : "/src",
      "/infrastructure/persistence/migrations/*{.ts,.js}"
    ),
  ],
  logging: process.env.TYPEORM_LOGGING === "true",
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
  migrationsRun: process.env.TYPEORM_MIGRATION_RUN === "true",
  migrationsTableName: "migrations",
  cli: {
    migrationsDir: "src/infrastructure/persistence/migrations",
  },
};
console.log("🚀 ~ ormconfigs:", ormconfigs);

module.exports = ormconfigs;
