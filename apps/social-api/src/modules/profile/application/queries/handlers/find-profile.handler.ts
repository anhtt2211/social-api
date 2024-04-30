import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import {
  FOLLOW_REPOSITORY,
  FollowPort,
  ProfileData,
  ProfileRO,
} from "@profile/core";
import { USER_REPOSITORY, UserPort } from "@user/core";
import { FindProfileQuery } from "../impl";

@QueryHandler(FindProfileQuery)
export class FindProfileQueryHandler
  implements IQueryHandler<FindProfileQuery>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,
    @Inject(FOLLOW_REPOSITORY)
    private readonly followsRepository: FollowPort
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
