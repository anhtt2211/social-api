import { ArticleEntity } from "@article/core/entities/article.entity";
import { CommentEntity } from "@article/core/entities/comment.entity";
import { UserEntity } from "../entities";

export interface UserData {
  username: string;
  email: string;
  token?: string;
  bio: string;
  image?: string;
}

export interface UserRO {
  user: UserData;
}

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  exp: number;
  iat: number;
}

export interface IUser {
  id?: number;
  username?: string;
  email?: string;
  bio?: string;
  image?: string;
  password?: string;
  favorites?: ArticleEntity[];
  articles?: ArticleEntity[];
  comments?: CommentEntity[];
}

export interface IPayloadUserRmq {
  user: UserEntity;
}
export interface IPayloadUserCreated extends IPayloadUserRmq {}
export interface IPayloadUserUpdated extends IPayloadUserRmq {}
