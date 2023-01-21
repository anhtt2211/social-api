import { LoginUserDto } from "../../dto";

export class LoginCommand {
  constructor(public readonly loginUserDto: LoginUserDto) {}
}
