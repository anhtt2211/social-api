import { FollowsEntity } from "../../follows.entity";

export class ProfileFollowedEvent {
  constructor(public readonly follow: FollowsEntity) {}
}
