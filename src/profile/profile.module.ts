import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthMiddleware } from "../user/auth.middleware";
import { UserModule } from "../user/user.module";
import { CommandHandlers } from "./commands";
import { CommandModule } from "./commands/command.module";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { QueryHandlers } from "./queries";
import { QueryModule } from "./queries/query.module";

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
