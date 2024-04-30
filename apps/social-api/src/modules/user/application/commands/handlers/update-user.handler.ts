import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { USER_REPOSITORY, UserPort, UserRO } from "@user/core";
import { UserService } from "../../services";
import { UpdateUserCommand } from "../impl";

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,

    private readonly userService: UserService
  ) {}

  async execute({ id, dto }: UpdateUserCommand): Promise<UserRO> {
    try {
      let toUpdate = await this.userRepository.findOne(id);
      delete toUpdate.password;
      delete toUpdate.favorites;

      let updated = Object.assign(toUpdate, dto);
      const userUpdated = await this.userRepository.save(updated);

      return this.userService.buildUserRO(userUpdated);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
