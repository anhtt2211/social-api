import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";
import { UserModule } from "../user/user.module";
import { DropboxService } from "./services/dropbox.service";
import { MediaController } from "./media.controller";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [UserModule, CqrsModule, RedisModule],
  providers: [DropboxService],
  controllers: [MediaController],
  exports: [DropboxService],
})
export class MediaModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "media/img/upload", method: RequestMethod.POST });
  }
}
