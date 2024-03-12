import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { TIME_TO_LIVE } from "@redis/redis.constant";
import { RedisService } from "@redis/redis.service";
import { UserService } from "@user/application/services";
import { USER_REPOSITORY, UserEntity, UserPort, UserRO } from "../../../core";
import { FindUserByEmailQuery } from "../impl";

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailQueryHandler
  implements IQueryHandler<FindUserByEmailQuery>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,

    private readonly userService: UserService,
    private readonly redisCacheService: RedisService
  ) {}

  async execute({ email }: FindUserByEmailQuery): Promise<UserRO> {
    let user: UserEntity = (await this.redisCacheService.get(
      email
    )) as UserEntity;

    if (!user) {
      user = await this.userRepository.findOne({ email });
      this.redisCacheService.set(email, user, TIME_TO_LIVE);
    }

    return this.userService.buildUserRO(user);
  }
}
