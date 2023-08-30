import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { RabbitMqModule } from "../rabbitmq/rabbitmq.module";
import { RedisModule } from "../redis/redis.module";
import { AuthMiddleware } from "../user/auth.middleware";
import { UserModule } from "../user/user.module";
import { ArticleController } from "./article.controller";
import { ArticleProjection } from "./article.projection";
import { CommandModule } from "./commands/command.module";
import { ElasticSearchArticleProjection } from "./elastic-search-article.projection";
import { EventModule } from "./events/event.module";
import { QueryModule } from "./queries/query.module";
import { ArticleService } from "./services/article.service";

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
  providers: [
    ArticleService,
    ArticleProjection,
    ElasticSearchArticleProjection,
  ],
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
