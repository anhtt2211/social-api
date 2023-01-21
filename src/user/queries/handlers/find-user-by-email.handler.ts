import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../user.entity";
import { UserRO } from "../../user.interface";
import { FindUserByEmailQuery } from "../impl";

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailQueryHandler
  implements IQueryHandler<FindUserByEmailQuery>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async execute({ email }: FindUserByEmailQuery): Promise<UserRO> {
    const user = await this.userRepository.findOne({ email });
    return { user };
  }
}
