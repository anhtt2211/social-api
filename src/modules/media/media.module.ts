import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthMiddleware } from "../../shared/middleware";
import { UserModule } from "../user/user.module";
import { S3Service } from "./application/services";
import { MediaController } from "./presentation/rest";

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
