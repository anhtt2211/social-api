import { IFollow } from "../../../core/interfaces/profile.interface";

export class ProfileUnFollowedEvent {
  constructor(public readonly follow: IFollow) {}
}
