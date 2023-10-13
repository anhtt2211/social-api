import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommandHandlers } from ".";
import { WRITE_CONNECTION } from "../../../config";
import { FollowsEntity } from "../../../profile/core/entities/follows.entity";
import { RabbitMqModule } from "../../../rabbitmq/rabbitmq.module";
import { UserEntity } from "../../../user/core";
import { UserModule } from "../../../user/user.module";
import { ArticleEntity, BlockEntity } from "../../core";
import { CommentEntity } from "../../core/entities/comment.entity";
import { ArticleService } from "../services/article.service";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, UserEntity, CommentEntity, FollowsEntity, BlockEntity],
      WRITE_CONNECTION
    ),
    UserModule,
    CqrsModule,
    RabbitMqModule,
  ],
  providers: [ArticleService, ...CommandHandlers],
  controllers: [],
})
export class CommandModule {}
