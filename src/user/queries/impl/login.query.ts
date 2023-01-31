import { LoginUserDto } from "../../dto";

export class LoginQuery {
  constructor(public readonly loginUserDto: LoginUserDto) {}
}
