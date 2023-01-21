import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "./article.entity";
import { Comment } from "./comment.entity";
import { UserEntity } from "../user/user.entity";
import { FollowsEntity } from "../profile/follows.entity";
import { ArticleService } from "./article.service";
import { AuthMiddleware } from "../user/auth.middleware";
import { UserModule } from "../user/user.module";
// import { CommandHandlers, EventHandlers, QueryHandlers } from "./handlers";
import { CqrsModule } from "@nestjs/cqrs";
import { BlockEntity } from "../block/block.entity";
import { QueryHandlers } from "./queries";
import { CommandHandlers } from "./commands";
import { EventHandlers } from "./events";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      Comment,
      UserEntity,
      FollowsEntity,
      BlockEntity,
    ]),
    UserModule,
    CqrsModule,
  ],
  providers: [
    ArticleService,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
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
