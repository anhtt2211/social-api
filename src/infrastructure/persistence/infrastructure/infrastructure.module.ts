import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import {
  ARTICLE_READ_REPOSITORY,
  ARTICLE_WRITE_REPOSITORY,
  ArticleEntity,
  BLOCK_READ_REPOSITORY,
  BLOCK_WRITE_REPOSITORY,
  BlockEntity,
  COMMENT_READ_REPOSITORY,
  COMMENT_WRITE_REPOSITORY,
  CommentEntity,
} from "@article/core";
import { READ_CONNECTION, WRITE_CONNECTION } from "@configs";
import { FileEntity, MediaRepositoryToken } from "@media/core";
import {
  FOLLOW_READ_REPOSITORY,
  FOLLOW_WRITE_REPOSITORY,
  FollowsEntity,
} from "@profile/core";
import {
  USER_READ_REPOSITORY,
  USER_WRITE_REPOSITORY,
  UserEntity,
} from "@user/core";
import {
  ArticleReadRepository,
  ArticleWriteRepository,
  BlockReadRepository,
  BlockWriteRepository,
  CommentReadRepository,
  CommentWriteRepository,
  FileReadRepository,
  FileWriteRepository,
  FollowReadRepository,
  FollowWriteRepository,
  UserReadRepository,
  UserWriteRepository,
} from "./repositories";

@Global()
@Module({
  imports: [
    {
      forwardRef: () =>
        TypeOrmModule.forFeature(
          [
            ArticleEntity,
            CommentEntity,
            BlockEntity,
            UserEntity,
            FollowsEntity,
            FileEntity,
          ],
          WRITE_CONNECTION
        ),
    },
    {
      forwardRef: () =>
        TypeOrmModule.forFeature(
          [
            ArticleEntity,
            CommentEntity,
            BlockEntity,
            UserEntity,
            FollowsEntity,
            FileEntity,
          ],
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

    {
      provide: FOLLOW_READ_REPOSITORY,
      useClass: FollowReadRepository,
    },
    {
      provide: FOLLOW_WRITE_REPOSITORY,
      useClass: FollowWriteRepository,
    },

    {
      provide: MediaRepositoryToken.Read,
      useClass: FileReadRepository,
    },
    {
      provide: MediaRepositoryToken.Write,
      useClass: FileWriteRepository,
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
    FOLLOW_READ_REPOSITORY,
    FOLLOW_WRITE_REPOSITORY,
    MediaRepositoryToken.Read,
    MediaRepositoryToken.Write,
  ],
})
export class RepositoryModule {}
