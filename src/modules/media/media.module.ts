import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthMiddleware } from "../../shared/middleware";
import { UserModule } from "../user/user.module";
import { ApplicationModule } from "./application/application.module";
import { PresentationModule } from "./presentation/presentation.module";

@Module({
  imports: [UserModule, CqrsModule, ApplicationModule, PresentationModule],
})
export class MediaModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: "media/img/upload", method: RequestMethod.POST });
  }
}
