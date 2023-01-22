import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandHandlers } from ".";
import { BlockEntity } from "../../block/block.entity";
import { WriteConnection } from "../../config";
import { FollowsEntity } from "../../profile/follows.entity";
import { UserModule } from "../../user/user.module";
import { UserWrite_DBEntity } from "../../user/user.writedb.entity";
import { ArticleController } from "../article.controller";
import { ArticleService } from "../article.service";
import { ArticleWrite_DBEntity } from "../article.writedb.entity";
import { Comment } from "../comment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        ArticleWrite_DBEntity,
        UserWrite_DBEntity,
        Comment,
        FollowsEntity,
        BlockEntity,
      ],
      WriteConnection
    ),
    UserModule,
    CqrsModule,
  ],
  providers: [ArticleService, ...CommandHandlers],
  controllers: [ArticleController],
})
export class CommandModule {}
