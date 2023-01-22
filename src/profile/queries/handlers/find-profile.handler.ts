import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { FollowsEntity } from "../../follows.entity";
import { ProfileData, ProfileRO } from "../../profile.interface";
import { FindProfileQuery } from "../impl";

@QueryHandler(FindProfileQuery)
export class FindProfileQueryHandler
  implements IQueryHandler<FindProfileQuery>
{
  constructor(
    @InjectRepository(UserEntity, ReadConnection)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity, ReadConnection)
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
