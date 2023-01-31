import { UpdateUserDto } from "../../dto";

export class UpdateUserCommand {
  constructor(public readonly id: number, public readonly dto: UpdateUserDto) {}
}
