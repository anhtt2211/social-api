import { UserEntity } from "../../../core/entities/user.entity";

export class UserUpdatedEvent {
  constructor(public readonly user: UserEntity) {}
}
