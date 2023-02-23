import { UserEntity } from "../entities";
import { MessageType } from "../enums";

export interface IProjection {
  handle(): Promise<void>;
}

export interface IMessage {
  type: MessageType;
  payload: {
    user?: UserEntity;
  };
}
