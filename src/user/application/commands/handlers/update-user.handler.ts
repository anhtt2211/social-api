import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";

import { USER_RMQ_CLIENT } from "../../../../configs";
import { USER_WRITE_REPOSITORY, UserWritePort } from "../../../core";
import { MessageCmd } from "../../../core/enums";
import { IPayloadUserUpdated, UserRO } from "../../../core/interfaces";
import { UserService } from "../../services";
import { UpdateUserCommand } from "../impl";

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @Inject(USER_WRITE_REPOSITORY)
    private readonly userRepository: UserWritePort,
    @Inject(USER_RMQ_CLIENT)
    private readonly userRmqClient: ClientProxy,

    private readonly userService: UserService
  ) {
    this.userRmqClient.connect();
  }

  async execute({ id, dto }: UpdateUserCommand): Promise<UserRO> {
    try {
      let toUpdate = await this.userRepository.findOne(id);
      delete toUpdate.password;
      delete toUpdate.favorites;

      let updated = Object.assign(toUpdate, dto);
      const userUpdated = await this.userRepository.save(updated);

      if (userUpdated) {
        this.userRmqClient.emit<any, IPayloadUserUpdated>(
          { cmd: MessageCmd.USER_UPDATED },
          { user: userUpdated }
        );
      }

      return this.userService.buildUserRO(userUpdated);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
