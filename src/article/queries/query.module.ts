import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueryHandlers } from ".";
import { ReadConnection } from "../../config";
import { FollowsEntity } from "../../profile/follows.entity";
import { UserEntity } from "../../user/user.entity";
import { UserModule } from "../../user/user.module";
import { ArticleController } from "../article.controller";
import { ArticleEntity } from "../article.entity";
import { ArticleService } from "../article.service";
import { Comment } from "../comment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, Comment, UserEntity, FollowsEntity],
      ReadConnection
    ),
    UserModule,
    CqrsModule,
  ],
  providers: [ArticleService, ...QueryHandlers],
  controllers: [ArticleController],
})
export class QueryModule {}
