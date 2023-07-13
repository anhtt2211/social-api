module.exports = [
  {
    type: process.env.DATABASE_ENGINE,
    name: "master-db",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.WRITE_DATABASE_NAME,
    entities: [process.env.TYPEORM_ENTITIES],
    migrations: [process.env.TYPEORM_MIGRATIONS],
    logging: process.env.TYPEORM_LOGGING === "true" ? true : false,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === "true" ? true : false,
    migrationsRun: process.env.TYPEORM_MIGRATION_RUN === "true" ? true : false,
    migrationsTableName: "migrations",
    cli: {
      migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
    },
  },
  {
    type: process.env.DATABASE_ENGINE,
    name: "slave-db",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.READ_DATABASE_NAME,
    entities: [process.env.TYPEORM_ENTITIES],
    migrations: [process.env.TYPEORM_MIGRATIONS],
    logging: process.env.TYPEORM_LOGGING === "true" ? true : false,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === "true" ? true : false,
    migrationsRun: process.env.TYPEORM_MIGRATION_RUN === "true" ? true : false,
    migrationsTableName: "migrations",
    cli: {
      migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
    },
  },
];
