import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { getRepository, Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserEntity } from "../../user.entity";
import { UserRO } from "../../user.interface";
import { UserService } from "../../user.service";
import { CreateUserCommand } from "../impl";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @InjectRepository(UserEntity, WriteConnection)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userService: UserService
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<UserRO> {
    // check uniqueness of username/email
    const { username, email, password } = dto;
    const qb = await getRepository(UserEntity, WriteConnection)
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
    let newUser = new UserEntity();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password;
    newUser.articles = [];

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
  }
}