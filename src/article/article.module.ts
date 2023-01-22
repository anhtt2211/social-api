import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AuthMiddleware } from "../user/auth.middleware";
import { UserModule } from "../user/user.module";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { CqrsModule } from "@nestjs/cqrs";
import { CommandHandlers } from "./commands";
import { CommandModule } from "./commands/command.module";
import { EventHandlers } from "./events";
import { QueryHandlers } from "./queries";
import { QueryModule } from "./queries/query.module";

@Module({
  imports: [CqrsModule, UserModule, CommandModule, QueryModule],
  providers: [
    ArticleService,
    // ...QueryHandlers,
    // ...CommandHandlers,
    // ...EventHandlers,
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
