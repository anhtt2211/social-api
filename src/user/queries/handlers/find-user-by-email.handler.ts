import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../config";
import { RedisService } from "../../../redis/redis.service";
import { UserEntity } from "../../core/entities/user.entity";
import { UserRO } from "../../core/interfaces/user.interface";
import { FindUserByEmailQuery } from "../impl";

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailQueryHandler
  implements IQueryHandler<FindUserByEmailQuery>
{
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,

    private readonly redisCacheService: RedisService
  ) {}

  async execute({ email }: FindUserByEmailQuery): Promise<UserRO> {
    const result = await this.redisCacheService.get(email);

    if (result) {
      return result;
    } else {
      const user = await this.userRepository.findOne({ email });

      return { user };
    }
  }
}
