import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { READ_CONNECTION } from "../../../configs";
import { UserEntity } from "../../../user/core/entities/user.entity";
import { ArticleEntity, BlockEntity } from "../../core/entities";
import { CommentEntity } from "../../core/entities/comment.entity";
import { EventHandlers } from ".";
import { InfrastructureModule } from "../../../database/infrastructure/infrastructure.module";

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ArticleEntity, UserEntity, BlockEntity, CommentEntity],
      READ_CONNECTION
    ),
    { forwardRef: () => InfrastructureModule },
    CqrsModule,
  ],
  providers: [...EventHandlers],
  controllers: [],
})
export class EventModule {}
