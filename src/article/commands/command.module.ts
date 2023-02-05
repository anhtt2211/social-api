import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandHandlers } from ".";
import { WRITE_CONNECTION } from "../../config";
import { FollowsEntity } from "../../profile/core/entities/follows.entity";
import { RabbitMqModule } from "../../rabbitmq/rabbitMQ.module";
import { UserEntity } from "../../user/user.entity";
import { UserModule } from "../../user/user.module";
import { ArticleEntity, Comment, BlockEntity } from "../core";
import { ArticleService } from "../services/article.service";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, UserEntity, Comment, FollowsEntity, BlockEntity],
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
