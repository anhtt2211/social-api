import { HttpException, HttpStatus } from "@nestjs/common";
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
  ) { }

  async execute({ id }: FindUserById): Promise<UserRO> {
    let user: UserEntity;

    user = await this.redisCacheService.get(id.toString()) as UserEntity;

    if (!user) {
      user = await this.userRepository.findOne(id);

      if (!user) {
        const errors = { User: "User not found" };
        throw new HttpException({ errors }, HttpStatus.NOT_FOUND);
      }
    }

    return this.userService.buildUserRO(user);
  }
}
