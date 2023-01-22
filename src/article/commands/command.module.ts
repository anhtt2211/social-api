import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandHandlers } from ".";
import { BlockEntity } from "../../block/block.entity";
import { WriteConnection } from "../../config";
import { FollowsEntity } from "../../profile/follows.entity";
import { UserEntity } from "../../user/user.entity";
import { UserModule } from "../../user/user.module";
import { ArticleController } from "../article.controller";
import { ArticleEntity } from "../article.entity";
import { ArticleService } from "../article.service";
import { Comment } from "../comment.entity";
import { EventHandlers } from "../events";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, Comment, UserEntity, FollowsEntity, BlockEntity],
      WriteConnection
    ),
    UserModule,
    CqrsModule,
  ],
  providers: [ArticleService, ...CommandHandlers, ...EventHandlers],
  controllers: [ArticleController],
})
export class CommandModule {}
