import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { RedisService } from "@redis/redis.service";
import { USER_READ_REPOSITORY, UserReadPort } from "../../../core";
import { UserEntity } from "../../../core/entities";
import { UserRO } from "../../../core/interfaces";
import { UserService } from "../../services";
import { FindUserById } from "../impl";

@QueryHandler(FindUserById)
export class FindUserByIdHandler implements IQueryHandler<FindUserById> {
  constructor(
    @Inject(USER_READ_REPOSITORY)
    private readonly userRepository: UserReadPort,

    private readonly userService: UserService,
    private readonly redisCacheService: RedisService
  ) {}

  async execute({ id }: FindUserById): Promise<UserRO> {
    let user: UserEntity;

    user = (await this.redisCacheService.get(id.toString())) as UserEntity;

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