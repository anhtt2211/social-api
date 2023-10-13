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
import { ArticleProjection } from "./application/article.projection";
import { CommandModule } from "./application/commands/command.module";
import { EventModule } from "./application/events/event.module";
import { QueryModule } from "./application/queries/query.module";
import { ArticleService } from "./application/services/article.service";
import { ArticleController } from "./presentation/article.controller";

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
  providers: [ArticleService, ArticleProjection],
  controllers: [ArticleController],
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: "articles/feed", method: RequestMethod.GET },
        { path: "articles", method: RequestMethod.POST },
        { path: "articles/:slug", method: RequestMethod.DELETE },
        { path: "articles/:slug", method: RequestMethod.PUT },
        { path: "articles/:slug/comments", method: RequestMethod.POST },
        { path: "articles/:slug/comments/:id", method: RequestMethod.DELETE },
        { path: "articles/:slug/favorite", method: RequestMethod.POST },
        { path: "articles/:slug/favorite", method: RequestMethod.DELETE }
      );
  }
}
