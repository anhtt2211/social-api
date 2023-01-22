import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserEntity } from "../../user.entity";
import { UserRO } from "../../user.interface";
import { UserService } from "../../user.service";
import { UpdateUserCommand } from "../impl";

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @InjectRepository(UserEntity, WriteConnection)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userService: UserService
  ) {}

  async execute({ id, dto }: UpdateUserCommand): Promise<UserRO> {
    let toUpdate = await this.userRepository.findOne(id);
    delete toUpdate.password;
    delete toUpdate.favorites;

    let updated = Object.assign(toUpdate, dto);
    const userUpdated = await this.userRepository.save(updated);
    return this.userService.buildUserRO(userUpdated);
  }
}
