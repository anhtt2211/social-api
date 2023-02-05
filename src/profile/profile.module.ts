import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { RabbitMqModule } from "../rabbitmq/rabbitMQ.module";
import { AuthMiddleware } from "../user/auth.middleware";
import { UserModule } from "../user/user.module";
import { CommandModule } from "./commands/command.module";
import { EventModule } from "./events/event.module";
import { ProfileController } from "./profile.controller";
import { ProfileProjection } from "./profile.projection";
import { ProfileService } from "./services/profile.service";
import { QueryModule } from "./queries/query.module";

@Module({
  imports: [
    CqrsModule,
    UserModule,
    CommandModule,
    QueryModule,
    EventModule,
    RabbitMqModule,
  ],
  providers: [ProfileService, ProfileProjection],
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
