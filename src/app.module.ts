import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ArticleModule } from "./article/article.module";
import { DatabaseModule } from "./database/database.module";
import { MediaModule } from "./media/media.module";
import { ProfileModule } from "./profile/profile.module";
import { TagModule } from "./tag/tag.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ArticleModule,
    UserModule,
    ProfileModule,
    TagModule,
    MediaModule,
  ],
  controllers: [],
  providers: [],
})
export class ApplicationModule {}
