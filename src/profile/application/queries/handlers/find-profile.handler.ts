import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../../configs";
import { UserEntity } from "../../../../user/core/entities/user.entity";
import { FollowsEntity } from "../../../core/entities/follows.entity";
import {
  ProfileData,
  ProfileRO,
} from "../../../core/interfaces/profile.interface";
import { FindProfileQuery } from "../impl";

@QueryHandler(FindProfileQuery)
export class FindProfileQueryHandler
  implements IQueryHandler<FindProfileQuery>
{
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity, READ_CONNECTION)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}

  async execute({
    userId,
    followingUsername,
  }: FindProfileQuery): Promise<ProfileRO> {
    const _profile = await this.userRepository.findOne({
      username: followingUsername,
    });

    if (!_profile) return;

    let profile: ProfileData = {
      username: _profile.username,
      bio: _profile.bio,
      image: _profile.image,
    };

    const follows = await this.followsRepository.findOne({
      followerId: userId,
      followingId: _profile.id,
    });

    if (userId) {
      profile.following = !!follows;
    }

    return { profile };
  }
}
