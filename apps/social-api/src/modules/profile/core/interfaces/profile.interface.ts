import { FollowsEntity } from "../entities";

export interface ProfileData {
  username: string;
  bio: string;
  image?: string;
  following?: boolean;
}

export interface ProfileRO {
  profile: ProfileData;
}

export interface IFollow {
  id?: number;
  followerId?: number;
  followingId?: number;
}

export interface IPayloadProfileRmq {
  follow: FollowsEntity;
}
export interface IPayloadProfileFollowed extends IPayloadProfileRmq {}
export interface IPayloadProfileUnFollowed extends IPayloadProfileRmq {}
