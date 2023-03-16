import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { RabbitMqModule } from "../rabbitmq/rabbitmq.module";
import { AuthMiddleware } from "./auth.middleware";
import { CommandModule } from "./commands/command.module";
import { EventModule } from "./events/event.module";
import { QueryModule } from "./queries/query.module";
import { UserController } from "./user.controller";
import { UserProjection } from "./user.projection";
import { UserService } from "./services/user.service";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [
    CqrsModule,
    CommandModule,
    QueryModule,
    EventModule,
    RabbitMqModule,
    RedisModule,
  ],
  providers: [UserService, UserProjection],
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
