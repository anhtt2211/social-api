import { HttpException } from "@nestjs/common";
import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as argon2 from "argon2";
import { READ_CONNECTION } from "../../../../configs";
import { LoginUserDto } from "../../../core/dto";
import { UserEntity } from "../../../core/entities/user.entity";
import { UserRO } from "../../../core/interfaces/user.interface";
import { UserService } from "../../services/user.service";
import { LoginQuery } from "../impl";
import { RedisService } from "../../../../redis/redis.service";
import { TIME_TO_LIVE } from "../../../../redis/redis.constant";

@QueryHandler(LoginQuery)
export class LoginQueryHandler implements IQueryHandler<LoginQuery> {
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,
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
