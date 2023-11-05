import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { validate } from "class-validator";
import { getRepository } from "typeorm";

import { USER_RMQ_CLIENT, WRITE_CONNECTION } from "../../../../configs";
import { USER_WRITE_REPOSITORY, UserWritePort } from "../../../core";
import { UserEntity } from "../../../core/entities";
import { MessageCmd } from "../../../core/enums";
import { IPayloadUserCreated, UserRO } from "../../../core/interfaces";
import { UserService } from "../../services";
import { CreateUserCommand } from "../impl";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
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

  async execute({ dto }: CreateUserCommand): Promise<UserRO> {
    try {
      // check uniqueness of username/email
      const { username, email, password } = dto;
      const qb = getRepository(UserEntity, WRITE_CONNECTION)
        .createQueryBuilder("user")
        .where("user.username = :username", { username })
        .orWhere("user.email = :email", { email });

      const user = await qb.getOne();

      if (user) {
        const errors = { username: "Username and email must be unique." };
        throw new HttpException(
          { message: "Input data validation failed", errors },
          HttpStatus.BAD_REQUEST
        );
      }

      // create new user
      let newUser = new UserEntity({
        username,
        email,
        password,
        articles: [],
      });

      const errors = await validate(newUser);
      if (errors.length > 0) {
        const _errors = { username: "Userinput is not valid." };
        throw new HttpException(
          { message: "Input data validation failed", _errors },
          HttpStatus.BAD_REQUEST
        );
      } else {
        const savedUser = await this.userRepository.save(newUser);

        if (savedUser) {
          this.userRmqClient.emit<any, IPayloadUserCreated>(
            { cmd: MessageCmd.USER_CREATED },
            { user: savedUser }
          );
        }

        return this.userService.buildUserRO(savedUser);
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
