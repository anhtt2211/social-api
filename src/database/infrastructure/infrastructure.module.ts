import { Module } from "@nestjs/common";
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
} from "./repositories";

@Module({
  imports: [
    {
      forwardRef: () =>
        TypeOrmModule.forFeature(
          [ArticleEntity, CommentEntity, BlockEntity],
          WRITE_CONNECTION
        ),
    },
    {
      forwardRef: () =>
        TypeOrmModule.forFeature(
          [ArticleEntity, CommentEntity, BlockEntity],
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
  ],
  exports: [
    ARTICLE_READ_REPOSITORY,
    ARTICLE_WRITE_REPOSITORY,
    BLOCK_READ_REPOSITORY,
    BLOCK_WRITE_REPOSITORY,
    COMMENT_READ_REPOSITORY,
    COMMENT_WRITE_REPOSITORY,
  ],
})
export class InfrastructureModule {}
