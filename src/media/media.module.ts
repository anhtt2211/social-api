import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthMiddleware } from "../shared/middleware";
import { UserModule } from "../user/user.module";
import { EventModule } from "./application/events/event.module";
import { S3Service } from "./application/services";
import { MediaController } from "./presentation/rest";
import { MediaRmq } from "./presentation/rmq";

@Module({
  imports: [UserModule, CqrsModule, EventModule],
  providers: [S3Service],
  controllers: [MediaController, MediaRmq],
  exports: [S3Service],
})
export class MediaModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "media/img/upload", method: RequestMethod.POST });
  }
}
