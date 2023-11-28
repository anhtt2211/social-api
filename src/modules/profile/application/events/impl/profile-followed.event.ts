import { FollowsEntity } from "../../../core/entities/follows.entity";

export class ProfileFollowedEvent {
  constructor(public readonly follow: FollowsEntity) {}
}
