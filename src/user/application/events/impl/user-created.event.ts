import { UserEntity } from "../../../core/entities/user.entity";

export class UserCreatedEvent {
  constructor(public readonly user: UserEntity) {}
}
