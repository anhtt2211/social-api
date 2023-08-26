import { BlockEntity } from "../entities/block.entity";
import { IBlock } from "./block.interface";
import { ProfileData } from "../../../profile/core/interfaces/profile.interface";
import { IUser } from "../../../user/core/interfaces/user.interface";
import { ArticleFilters } from "../../dto";

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

export interface IArticleSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: ArticleFilters;
    }>;
  };
}
