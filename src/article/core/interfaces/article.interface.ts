import { ProfileData } from "../../../profile/core/interfaces/profile.interface";
import { UserEntity } from "../../../user/core";
import { IUser } from "../../../user/core/interfaces/user.interface";
import { ArticleEntity } from "../entities";
import { BlockEntity } from "../entities/block.entity";
import { IBlock } from "./block.interface";

// export interface Comment {
//   id: number;
//   body: string;
//   created: Date;
//   updated?: Date;
//   author: ProfileData;
// }

export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  blocks?: IBlock[];
  tagList?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  favorited?: boolean;
  favoritesCount?: number;
  author?: ProfileData;
}

export interface CommentsRO {
  comments: IComment[];
}

export interface CommentRO {
  comment: IComment;
}

export interface ArticleRO {
  article: ArticleData;
}

export interface ArticlesRO {
  articles: ArticleData[];
  articlesCount: number;
}

export interface IArticle {
  id?: number;
  slug?: string;
  title?: string;
  description?: string;
  created?: Date;
  updated?: Date;
  tagList?: string[];
  author?: IUser;
  comments?: IComment[];
  favoriteCount?: number;
  blocks?: BlockEntity[];
}

export interface IComment {
  id?: number;
  body?: string;
  created?: Date;
  updated?: Date;
  article?: IArticle;
  author?: IUser | ProfileData;
}

interface IPayloadArticleRmq {
  article: ArticleEntity;
}
export interface IPayloadArticleCreated extends IPayloadArticleRmq {}
export interface IPayloadArticleUpdated extends IPayloadArticleRmq {}
export interface IPayloadArticleDeleted {
  userId: number;
  slug: string;
}
export interface IPayloadArticleFavorited extends IPayloadArticleRmq {
  user: UserEntity;
}
export interface IPayloadArticleUnFavorited extends IPayloadArticleRmq {
  user: UserEntity;
}
export interface IPayloadCommentCreated {
  comment: IComment;
}
export interface IPayloadCommentDeleted {
  comment: IComment;
}
