import { LoginUserDto } from "../../../core/dto";

export class LoginQuery {
  constructor(public readonly loginUserDto: LoginUserDto) {}
}
