import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthMiddleware } from "../user/auth.middleware";
import { UserModule } from "../user/user.module";
import { DropboxService } from "./dropbox.service";
import { MediaController } from "./media.controller";

@Module({
  imports: [TypeOrmModule.forFeature([]), UserModule],
  providers: [DropboxService],
  controllers: [MediaController],
  exports: [DropboxService],
})
export class MediaModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "/img/upload", method: RequestMethod.POST });
  }
}
