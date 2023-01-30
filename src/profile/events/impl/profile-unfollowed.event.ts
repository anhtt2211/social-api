import { IFollow } from "../../profile.interface";

export class ProfileUnFollowedEvent {
  constructor(public readonly follow: IFollow) {}
}
