import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UseCases } from "./index";
import { READ_CONNECTION } from "../../../configs";
import { FollowsEntity } from "../../../profile/core";
import { UserEntity } from "../../../user/core";
import { UserModule } from "../../../user/user.module";
import { ArticleEntity, CommentEntity } from "../../core";
import { QueryModule } from "../queries/query.module";
import { ArticleService } from "../services";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, CommentEntity, UserEntity, FollowsEntity],
      READ_CONNECTION
    ),
    UserModule,
    QueryModule,
    CqrsModule,
  ],
  providers: [ArticleService, ...UseCases],
  exports: [...UseCases],
})
export class UseCaseModule {}
