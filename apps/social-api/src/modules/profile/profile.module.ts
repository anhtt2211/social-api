import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthMiddleware } from "@shared/middleware";
import { UserModule } from "@user/user.module";
import { CommandModule } from "./application/commands/command.module";
import { QueryModule } from "./application/queries/query.module";
import { ProfileService } from "./application/services";
import { ProfileController } from "./presentation";

@Module({
  imports: [CqrsModule, UserModule, CommandModule, QueryModule],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports: [],
})
export class ProfileModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: "profiles/:username/follow",
      method: RequestMethod.ALL,
    });
  }
}
