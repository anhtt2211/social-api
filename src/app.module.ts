import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { ArticleModule } from "./article/article.module";
import { MediaModule } from "./media/media.module";
import { ProfileModule } from "./profile/profile.module";
import { TagModule } from "./tag/tag.module";
import { UserModule } from "./user/user.module";

const defaultOptions = {
  migrations: ["src/database/migrations/*{.ts,.js}"],
  logging: true,
  synchronize: false,
  migrationsRun: false,
  migrationsTableName: "migrations",
  cli: {
    migrationsDir: "src/database/migrations",
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      name: "write_db",
      useFactory: () => ({
        ...defaultOptions,
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "anhtran",
        password: "_briantran",
        database: "social_write",
        entities: ["src/**/**.entity{.ts,.js}"],
      }),
    }),
    TypeOrmModule.forRootAsync({
      name: "read_db",
      useFactory: () => ({
        ...defaultOptions,
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "anhtran",
        password: "_briantran",
        database: "social_read",
        entities: ["src/**/**.entity{.ts,.js}"],
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
