import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { AppController } from "./app.controller";
import { ArticleModule } from "./article/article.module";
import { READ_CONNECTION, WRITE_CONNECTION } from "./config";
import { MediaModule } from "./media/media.module";
import { ProfileModule } from "./profile/profile.module";
import { TagModule } from "./tag/tag.module";
import { UserModule } from "./user/user.module";

dotenv.config();

const defaultOptions = {
  type: process.env.DATABASE_ENGINE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: [process.env.TYPEORM_MIGRATIONS],
  logging: process.env.TYPEORM_LOGGING === "true" ? true : false,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === "true" ? true : false,
  migrationsRun: process.env.TYPEORM_MIGRATION_RUN === "true" ? true : false,
  migrationsTableName: "migrations",
  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    ArticleModule,
    UserModule,
    ProfileModule,
    TagModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}
