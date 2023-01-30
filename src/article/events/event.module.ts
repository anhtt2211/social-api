import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlockEntity } from "../../block/block.entity";
import { ReadConnection } from "../../config";
import { UserEntity } from "../../user/user.entity";
import { ArticleEntity } from "../article.entity";
import { Comment } from "../comment.entity";
import { EventHandlers } from "../events";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, UserEntity, BlockEntity, Comment],
      ReadConnection
    ),
    CqrsModule,
  ],
  providers: [...EventHandlers],
  controllers: [],
})
export class EventModule {}
