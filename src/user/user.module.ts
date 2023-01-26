import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthMiddleware } from "./auth.middleware";
import { CommandModule } from "./commands/command.module";
import { QueryModule } from "./queries/query.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [CqrsModule, CommandModule, QueryModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
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
