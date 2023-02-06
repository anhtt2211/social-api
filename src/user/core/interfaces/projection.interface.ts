import { UserEntity } from "../entities";

export interface IProjection {
  handle(): Promise<void>;
}

export interface IMessage {
  type: string;
  payload: {
    user?: UserEntity;
  };
}
