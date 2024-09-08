import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { AppController } from "./app.controller";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import {
  ArticleModule,
  MediaModule,
  ProfileModule,
  TagModule,
  UserModule,
} from "./modules";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ArticleModule,
    MediaModule,
    ProfileModule,
    TagModule,
    UserModule,
    InfrastructureModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}
