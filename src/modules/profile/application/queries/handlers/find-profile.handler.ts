import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { USER_READ_REPOSITORY, UserReadPort } from "@user/core";
import {
  FOLLOW_READ_REPOSITORY,
  FollowReadPort,
  ProfileData,
  ProfileRO,
} from "../../../core";
import { FindProfileQuery } from "../impl";

@QueryHandler(FindProfileQuery)
export class FindProfileQueryHandler
  implements IQueryHandler<FindProfileQuery>
{
  constructor(
    @Inject(USER_READ_REPOSITORY)
    private readonly userRepository: UserReadPort,
    @Inject(FOLLOW_READ_REPOSITORY)
    private readonly followsRepository: FollowReadPort
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
