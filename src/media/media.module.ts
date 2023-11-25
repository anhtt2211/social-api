import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";
import { UserModule } from "../user/user.module";
import { MediaController } from "./media.controller";
import { S3Service } from "./services/s3.service";

@Module({
  imports: [UserModule, CqrsModule],
  providers: [S3Service],
  controllers: [MediaController],
  exports: [S3Service],
})
export class MediaModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "media/img/upload", method: RequestMethod.POST });
  }
}
