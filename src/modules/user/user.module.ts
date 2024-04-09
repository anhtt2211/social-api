import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthMiddleware } from "@shared/middleware";
import { ApplicationModule } from "./application/application.module";
import { PresentationModule } from "./presentation/presentation.module";

@Module({
  imports: [CqrsModule, ApplicationModule, PresentationModule],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "user", method: RequestMethod.GET },
        { path: "user", method: RequestMethod.PUT }
      );
  }
}
