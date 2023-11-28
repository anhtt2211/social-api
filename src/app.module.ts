import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

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
    ArticleModule,
    MediaModule,
    ProfileModule,
    TagModule,
    UserModule,
    InfrastructureModule,
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule {}
