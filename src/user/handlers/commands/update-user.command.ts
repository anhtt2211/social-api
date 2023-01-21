import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateUserDto } from "../../dto";
import { UserEntity } from "../../user.entity";
import { UserRO } from "../../user.interface";
import { UserService } from "../../user.service";

export class UpdateUserCommand {
  constructor(public readonly id: number, public readonly dto: UpdateUserDto) {}
}

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    @InjectRepository(UserEntity)
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
