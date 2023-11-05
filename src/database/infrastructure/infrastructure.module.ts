import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { READ_CONNECTION, WRITE_CONNECTION } from "../../configs";
import {
  ArticleEntity,
  BlockEntity,
  CommentEntity,
} from "../../article/core/entities";
import {
  ARTICLE_READ_REPOSITORY,
  ARTICLE_WRITE_REPOSITORY,
  BLOCK_READ_REPOSITORY,
  BLOCK_WRITE_REPOSITORY,
  COMMENT_READ_REPOSITORY,
  COMMENT_WRITE_REPOSITORY,
} from "../../article/core/token";
import {
  ArticleReadRepository,
  ArticleWriteRepository,
  BlockReadRepository,
  BlockWriteRepository,
  CommentReadRepository,
  CommentWriteRepository,
  UserReadRepository,
  UserWriteRepository,
} from "./repositories";
import {
  USER_READ_REPOSITORY,
  USER_WRITE_REPOSITORY,
  UserEntity,
} from "../../user/core";

@Global()
@Module({
  imports: [
    {
      forwardRef: () =>
        TypeOrmModule.forFeature(
          [ArticleEntity, CommentEntity, BlockEntity, UserEntity],
          WRITE_CONNECTION
        ),
    },
    {
      forwardRef: () =>
        TypeOrmModule.forFeature(
          [ArticleEntity, CommentEntity, BlockEntity, UserEntity],
          READ_CONNECTION
        ),
    },
  ],
  providers: [
    {
      provide: ARTICLE_WRITE_REPOSITORY,
      useClass: ArticleWriteRepository,
    },
    {
      provide: ARTICLE_READ_REPOSITORY,
      useClass: ArticleReadRepository,
    },

    {
      provide: BLOCK_READ_REPOSITORY,
      useClass: BlockReadRepository,
    },
    {
      provide: BLOCK_WRITE_REPOSITORY,
      useClass: BlockWriteRepository,
    },

    {
      provide: COMMENT_READ_REPOSITORY,
      useClass: CommentReadRepository,
    },
    {
      provide: COMMENT_WRITE_REPOSITORY,
      useClass: CommentWriteRepository,
    },

    {
      provide: USER_READ_REPOSITORY,
      useClass: UserReadRepository,
    },
    {
      provide: USER_WRITE_REPOSITORY,
      useClass: UserWriteRepository,
    },
  ],
  exports: [
    ARTICLE_READ_REPOSITORY,
    ARTICLE_WRITE_REPOSITORY,
    BLOCK_READ_REPOSITORY,
    BLOCK_WRITE_REPOSITORY,
    COMMENT_READ_REPOSITORY,
    COMMENT_WRITE_REPOSITORY,
    USER_READ_REPOSITORY,
    USER_WRITE_REPOSITORY,
  ],
})
export class InfrastructureModule {}
