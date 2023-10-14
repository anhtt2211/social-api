import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../../configs";
import { PublisherService } from "../../../../rabbitmq/publisher.service";
import { USER_QUEUE } from "../../../../rabbitmq/rabbitmq.constants";
import { UserEntity } from "../../../core/entities/user.entity";
import { MessageType } from "../../../core/enums/user.enum";
import { UserRO } from "../../../core/interfaces/user.interface";
import { UserService } from "../../services/user.service";
import { UpdateUserCommand } from "../impl";

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @InjectRepository(UserEntity, WRITE_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userService: UserService,
    private readonly publisher: PublisherService
  ) {}

  async execute({ id, dto }: UpdateUserCommand): Promise<UserRO> {
    try {
      let toUpdate = await this.userRepository.findOne(id);
      delete toUpdate.password;
      delete toUpdate.favorites;

      let updated = Object.assign(toUpdate, dto);
      const userUpdated = await this.userRepository.save(updated);

      if (userUpdated) {
        this.publisher.publish(USER_QUEUE, {
          type: MessageType.USER_UPDATED,
          payload: {
            user: userUpdated,
          },
        });
      }

      return this.userService.buildUserRO(userUpdated);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
