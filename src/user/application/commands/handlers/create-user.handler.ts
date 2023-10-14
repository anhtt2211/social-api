import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { validate } from "class-validator";
import { getRepository, Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../../configs";
import { PublisherService } from "../../../../rabbitmq/publisher.service";
import { USER_QUEUE } from "../../../../rabbitmq/rabbitmq.constants";
import { UserEntity } from "../../../core/entities/user.entity";
import { MessageType } from "../../../core/enums/user.enum";
import { UserRO } from "../../../core/interfaces/user.interface";
import { UserService } from "../../services/user.service";
import { CreateUserCommand } from "../impl";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @InjectRepository(UserEntity, WRITE_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userService: UserService,
    private readonly publisher: PublisherService
  ) {}

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
          this.publisher.publish(USER_QUEUE, {
            type: MessageType.USER_CREATED,
            payload: {
              user: savedUser,
            },
          });
        }

        return this.userService.buildUserRO(savedUser);
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
