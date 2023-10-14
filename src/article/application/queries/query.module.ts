import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { QueryHandlers } from ".";
import { READ_CONNECTION } from "../../../configs";
import { FollowsEntity } from "../../../profile/core/entities/follows.entity";
import { UserEntity } from "../../../user/core/entities/user.entity";
import { UserModule } from "../../../user/user.module";
import { ArticleEntity } from "../../core";
import { CommentEntity } from "../../core/entities/comment.entity";
import { ArticleService } from "../services/article.service";
import { ElasticSearchModule } from "../../elastic-search/elastic-search.module";
import { RabbitMqModule } from "../../rabbitmq/rabbitmq.module";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, CommentEntity, UserEntity, FollowsEntity],
      READ_CONNECTION
    ),
    UserModule,
    CqrsModule,
    ElasticSearchModule,
    RabbitMqModule,
  ],
  providers: [ArticleService, ...QueryHandlers],
  controllers: [],
})
export class QueryModule {}
