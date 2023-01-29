import { BlockEntity } from "../block/block.entity";
import { IBlock } from "../block/block.interface";
import { ProfileData } from "../profile/profile.interface";
import { IUser } from "../user/user.interface";
export interface Comment {
  id: number;
  body: string;
  created: Date;
  updated?: Date;
  author: ProfileData;
}

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
  comments: Comment[];
}

export interface CommentRO {
  comment: Comment;
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
  comments?: Comment[];
  favoriteCount?: number;
  blocks?: BlockEntity[];
}
