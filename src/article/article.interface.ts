import { BlockDto } from "../block/block.dto";
import { ProfileData } from "../profile/profile.interface";
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
  author?: ProfileData;
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
