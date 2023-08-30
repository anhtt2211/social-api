import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { READ_CONNECTION } from "../../config";
import { UserEntity } from "../../user/core/entities/user.entity";
import { ArticleEntity, BlockEntity } from "../core";
import { CommentEntity } from "../core/entities/comment.entity";
import { EventHandlers } from "../events";
import { ElasticSearchModule } from "../../elastic-search/elastic-search.module";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, UserEntity, BlockEntity, CommentEntity],
      READ_CONNECTION
    ),
    CqrsModule,
    ElasticSearchModule,
  ],
  providers: [...EventHandlers],
  controllers: [],
})
export class EventModule {}
