import { UserEntity } from "../../user.entity";

export class UserUpdatedEvent {
  constructor(public readonly user: UserEntity) {}
}
