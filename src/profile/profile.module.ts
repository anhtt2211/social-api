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
import { UserModule } from "../user/user.module";
import { CommandModule } from "./application/commands/command.module";
import { EventModule } from "./application/events/event.module";
import { QueryModule } from "./application/queries/query.module";
import { ProfileService } from "./application/services";
import { ProfileController } from "./presentation/rest";
import { ProfileRmq } from "./presentation/rmq";

@Module({
  imports: [
    CqrsModule,
    UserModule,
    CommandModule,
    QueryModule,
    EventModule,
    RabbitMqModule,
    RedisModule,
  ],
  providers: [ProfileService],
  controllers: [ProfileController, ProfileRmq],
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
