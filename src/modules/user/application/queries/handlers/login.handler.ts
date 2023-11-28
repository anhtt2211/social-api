import { HttpException, Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import * as argon2 from "argon2";

import { TIME_TO_LIVE } from "@redis/redis.constant";
import { RedisService } from "@redis/redis.service";
import {
  LoginUserDto,
  USER_READ_REPOSITORY,
  UserReadPort,
  UserRO,
  UserEntity,
} from "../../../core";
import { UserService } from "../../services";
import { LoginQuery } from "../impl";

@QueryHandler(LoginQuery)
export class LoginQueryHandler implements IQueryHandler<LoginQuery> {
  constructor(
    @Inject(USER_READ_REPOSITORY)
    private readonly userRepository: UserReadPort,

    private readonly userService: UserService,
    private readonly redisCacheService: RedisService
  ) {}

  async execute({ loginUserDto }: LoginQuery): Promise<UserRO> {
    const _user = await this.findOne(loginUserDto);

    const errors = { User: " not found" };
    if (!_user) throw new HttpException({ errors }, 401);

    const token = await this.userService.generateJWT(_user);
    const { id, email, username, bio, image } = _user;
    const user = { email, token, username, bio, image };

    await this.redisCacheService.set(
      id.toString(),
      { ...user, id },
      TIME_TO_LIVE
    );

    return { user };
  }

  async findOne({ email, password }: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      return null;
    }

    if (await argon2.verify(user.password, password)) {
      return user;
    }

    return null;
  }
}
