import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { join } from "path";

import { READ_CONNECTION, WRITE_CONNECTION } from "@configs";
import { RepositoryModule } from "./repositories/repository.module";

dotenv.config();

const defaultOptions = {
  type: process.env.DATABASE_ENGINE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [join(__dirname, "../../", process.env.TYPEORM_ENTITIES)],
  migrations: [join(__dirname, "../../", process.env.TYPEORM_MIGRATIONS)],
  logging: process.env.TYPEORM_LOGGING === "true",
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true",
  migrationsRun: process.env.TYPEORM_MIGRATION_RUN === "true",
  migrationsTableName: "migrations",
  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
  },
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultOptions,
      type: "postgres",
      database: process.env.WRITE_DATABASE_NAME,
      name: WRITE_CONNECTION,
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      type: "postgres",
      database: process.env.READ_DATABASE_NAME,
      name: READ_CONNECTION,
    }),
    RepositoryModule,
  ],
})
export class PersistenceModule {}
