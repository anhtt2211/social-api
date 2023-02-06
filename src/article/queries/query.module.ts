import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueryHandlers } from ".";
import { READ_CONNECTION } from "../../config";
import { FollowsEntity } from "../../profile/core/entities/follows.entity";
import { UserEntity } from "../../user/core/entities/user.entity";
import { UserModule } from "../../user/user.module";
import { ArticleEntity } from "../core";
import { CommentEntity } from "../core/entities/comment.entity";
import { ArticleService } from "../services/article.service";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, CommentEntity, UserEntity, FollowsEntity],
      READ_CONNECTION
    ),
    UserModule,
    CqrsModule,
  ],
  providers: [ArticleService, ...QueryHandlers],
  controllers: [],
})
export class QueryModule {}
