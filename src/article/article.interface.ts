import { BlockDto } from "../block/block.dto";
import { UserData } from "../user/user.interface";
import { ArticleEntity } from "./article.entity";
interface Comment {
  body: string;
}

export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  blocks?: BlockDto[];
  tagList?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  favorited?: boolean;
  favoritesCount?: number;
  author?: UserData;
}

export interface CommentsRO {
  comments: Comment[];
}

export interface ArticleRO {
  article: ArticleData;
}

export interface ArticlesRO {
  articles: ArticleData[];
  articlesCount: number;
}
