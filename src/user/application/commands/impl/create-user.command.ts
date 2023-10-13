import { CreateUserDto } from "../../../core/dto";

export class CreateUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}
