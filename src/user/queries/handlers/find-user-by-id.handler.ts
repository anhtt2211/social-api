import { HttpException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../config";
import { RedisService } from "../../../redis/redis.service";
import { UserEntity } from "../../core/entities/user.entity";
import { UserRO } from "../../core/interfaces/user.interface";
import { UserService } from "../../services/user.service";
import { FindUserById } from "../impl";

@QueryHandler(FindUserById)
export class FindUserByIdHandler implements IQueryHandler<FindUserById> {
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userService: UserService,
    private readonly redisCacheService: RedisService
  ) {}

  async execute({ id }: FindUserById): Promise<UserRO> {
    const _user = await this.redisCacheService.get(id.toString());

    if (_user) {
      return this.userService.buildUserRO(_user);
    }

    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = { User: " not found" };
      throw new HttpException({ errors }, 401);
    }

    return this.userService.buildUserRO(user);
  }
}
