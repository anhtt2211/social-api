const ormconfigs = [
  {
    type: process.env.DATABASE_ENGINE,
    name: process.env.WRITE_CONNECTION,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.WRITE_DATABASE_NAME,
    entities: [__dirname + "/dist" + process.env.TYPEORM_ENTITIES],
    migrations: [__dirname + "/dist" + process.env.TYPEORM_MIGRATIONS_MASTER],
    logging: process.env.TYPEORM_LOGGING === "true",
    synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
    migrationsRun: process.env.TYPEORM_MIGRATION_RUN === "true",
    migrationsTableName: "migrations",
    cli: {
      migrationsDir: process.env.TYPEORM_MIGRATIONS_MASTER_DIR,
    },
  },
  {
    type: process.env.DATABASE_ENGINE,
    name: process.env.READ_CONNECTION,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.READ_DATABASE_NAME,
    entities: [__dirname + "/dist" + process.env.TYPEORM_ENTITIES],
    migrations: [__dirname + "/dist" + process.env.TYPEORM_MIGRATIONS_SLAVE],
    logging: process.env.TYPEORM_LOGGING === "true",
    synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
    migrationsRun: process.env.TYPEORM_MIGRATION_RUN === "true",
    migrationsTableName: "migrations",
    cli: {
      migrationsDir: process.env.TYPEORM_MIGRATIONS_SLAVE_DIR,
    },
  },
];

console.log({ ormconfig: ormconfigs[0] });

module.exports = ormconfigs;
