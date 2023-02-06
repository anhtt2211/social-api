import { FollowsEntity } from "../entities/follows.entity";
import { IFollow } from "./profile.interface";

export interface IProjection {
  handle(): Promise<void>;
}

export interface IMessage {
  type: string;
  payload: {
    follow: FollowsEntity | IFollow;
  };
}
