import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { validate } from "class-validator";

import { USER_REPOSITORY, UserEntity, UserPort, UserRO } from "@user/core";
import { UserService } from "../../services";
import { CreateUserCommand } from "../impl";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,

    private readonly userService: UserService
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<UserRO> {
    try {
      // check uniqueness of username/email
      const { username, email, password } = dto;
      const qb = this.userRepository
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

        return this.userService.buildUserRO(savedUser);
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
