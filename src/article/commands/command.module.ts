import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandHandlers } from ".";
import { BlockEntity } from "../../block/block.entity";
import { WRITE_CONNECTION } from "../../config";
import { FollowsEntity } from "../../profile/follows.entity";
import { RabbitMqModule } from "../../rabbitmq/rabbitMQ.module";
import { UserEntity } from "../../user/user.entity";
import { UserModule } from "../../user/user.module";
import { ArticleEntity } from "../article.entity";
import { ArticleService } from "../article.service";
import { Comment } from "../comment.entity";

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
