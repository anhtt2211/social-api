import { UserEntity } from "../../../user/core/entities/user.entity";
import { ArticleEntity } from "../entities/article.entity";
import { MessageType } from "../enums";
import { IComment } from "./article.interface";

export interface IMessage {
  type: MessageType;
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
