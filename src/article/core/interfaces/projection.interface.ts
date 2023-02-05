import { UserEntity } from "../../../user/core/entities/user.entity";
import { ArticleEntity } from "../entities/article.entity";
import { IComment } from "./article.interface";

export interface IMessage {
  type: string;
  payload: {
    article?: ArticleEntity;
    user?: UserEntity;
    slug?: string;
    userId?: number;
    comment?: IComment;
  };
}

export interface IProjection {
  handle(): Promise<void>;
}
