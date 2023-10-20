import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { RabbitMqModule } from "../rabbitmq/rabbitmq.module";
import { RedisModule } from "../redis/redis.module";
import { AuthMiddleware } from "../shared/middleware/auth.middleware";
import { CommandModule } from "./application/commands/command.module";
import { EventModule } from "./application/events/event.module";
import { QueryModule } from "./application/queries/query.module";
import { UserService } from "./application/services";
import { UserController } from "./presentation/rest";
import { UserRmq } from "./presentation/rmq";

@Module({
  imports: [
    CqrsModule,
    CommandModule,
    QueryModule,
    EventModule,
    RabbitMqModule,
    RedisModule,
  ],
  providers: [UserService],
  controllers: [UserController, UserRmq],
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
