import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { AuthMiddleware } from "@shared/middleware";
import { UserModule } from "../user/user.module";
import { CommandModule } from "./application/commands/command.module";
import { EventModule } from "./application/events/event.module";
import { QueryModule } from "./application/queries/query.module";
import { ArticleService } from "./application/services";
import { ArticleController } from "./presentation/rest";
import { ArticleRmq } from "./presentation/rmq";

@Module({
  imports: [CqrsModule, UserModule, CommandModule, QueryModule, EventModule],
  providers: [ArticleService],
  controllers: [ArticleController, ArticleRmq],
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