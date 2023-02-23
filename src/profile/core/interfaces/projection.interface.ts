import { FollowsEntity } from "../entities/follows.entity";
import { MessageType } from "../enums";
import { IFollow } from "./profile.interface";

export interface IProjection {
  handle(): Promise<void>;
}

export interface IMessage {
  type: MessageType;
  payload: {
    follow: FollowsEntity | IFollow;
  };
}
