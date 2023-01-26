import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandHandlers } from ".";
import { BlockEntity } from "../../block/block.entity";
import { WriteConnection } from "../../config";
import { FollowsEntity } from "../../profile/follows.entity";
import { UserModule } from "../../user/user.module";
import { UserEntity } from "../../user/user.entity";
import { ArticleController } from "../article.controller";
import { ArticleService } from "../article.service";
import { ArticleEntity } from "../article.entity";
import { Comment } from "../comment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, UserEntity, Comment, FollowsEntity, BlockEntity],
      WriteConnection
    ),
    UserModule,
    CqrsModule,
  ],
  providers: [ArticleService, ...CommandHandlers],
  controllers: [ArticleController],
})
export class CommandModule {}
