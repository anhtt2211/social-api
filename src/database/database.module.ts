import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";

import { READ_CONNECTION, WRITE_CONNECTION } from "../configs";
import { join } from "path";

dotenv.config();

const defaultOptions = {
  type: process.env.DATABASE_ENGINE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [join(__dirname, "../", "/**/core/entities/**.entity{.ts,.js}")],
  migrations: [join(__dirname, "../", "/database/migrations/**{.ts,.js}")],
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
    TypeOrmModule.forRootAsync({
      name: WRITE_CONNECTION,
      useFactory: () => ({
        ...defaultOptions,
        type: "postgres",
        database: process.env.WRITE_DATABASE_NAME,
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: READ_CONNECTION,
      useFactory: () => ({
        ...defaultOptions,
        type: "postgres",
        database: process.env.READ_DATABASE_NAME,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
