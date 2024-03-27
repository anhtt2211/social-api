import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  ARTICLE_BLOCK_OUTBOX_REPOSITORY,
  ARTICLE_REPOSITORY,
  ArticleBlockOutboxEntity,
  ArticleEntity,
  BLOCK_REPOSITORY,
  BlockEntity,
  COMMENT_REPOSITORY,
  CommentEntity,
} from "@article/core";
import { FileEntity, MEDIA_REPOSITORY } from "@media/core";
import { FOLLOW_REPOSITORY, FollowsEntity } from "@profile/core";
import { TAG_REPOSITORY, TagEntity } from "@tag/core";
import { USER_REPOSITORY, UserEntity } from "@user/core";
import { ArticleRepository } from "./article.repository";
import { BlockRepository } from "./block.repository";
import { CommentRepository } from "./comment.repository";
import { FileRepository } from "./file.repository";
import { FollowRepository } from "./follow.repository";
import { UserRepository } from "./user.repository";
import { TagRepository } from "./tag.repository";
import { ArticleBlockOutboxRepository } from "./article-block.outbox.repository";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      ArticleEntity,
      ArticleBlockOutboxEntity,
      CommentEntity,
      BlockEntity,
      UserEntity,
      FollowsEntity,
      FileEntity,
      TagEntity,
    ]),
  ],
  providers: [
    {
      provide: ARTICLE_BLOCK_OUTBOX_REPOSITORY,
      useClass: ArticleBlockOutboxRepository,
    },

    {
      provide: ARTICLE_REPOSITORY,
      useClass: ArticleRepository,
    },

    {
      provide: BLOCK_REPOSITORY,
      useClass: BlockRepository,
    },

    {
      provide: COMMENT_REPOSITORY,
      useClass: CommentRepository,
    },

    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },

    {
      provide: FOLLOW_REPOSITORY,
      useClass: FollowRepository,
    },

    {
      provide: MEDIA_REPOSITORY,
      useClass: FileRepository,
    },

    {
      provide: TAG_REPOSITORY,
      useClass: TagRepository,
    },
  ],
  exports: [
    ARTICLE_BLOCK_OUTBOX_REPOSITORY,
    ARTICLE_REPOSITORY,
    BLOCK_REPOSITORY,
    COMMENT_REPOSITORY,
    USER_REPOSITORY,
    FOLLOW_REPOSITORY,
    MEDIA_REPOSITORY,
    TAG_REPOSITORY,
  ],
})
export class RepositoryModule {}
