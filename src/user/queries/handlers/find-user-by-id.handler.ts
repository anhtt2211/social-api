import { HttpException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../config";
import { UserEntity } from "../../user.entity";
import { UserRO } from "../../user.interface";
import { UserService } from "../../services/user.service";
import { FindUserById } from "../impl";

@QueryHandler(FindUserById)
export class FindUserByIdHandler implements IQueryHandler<FindUserById> {
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userService: UserService
  ) {}

  async execute({ id }: FindUserById): Promise<UserRO> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = { User: " not found" };
      throw new HttpException({ errors }, 401);
    }

    return this.userService.buildUserRO(user);
  }
}
