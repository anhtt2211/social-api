import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import {
  FOLLOW_REPOSITORY,
  FollowPort,
  FollowsEntity,
  ProfileData,
  ProfileRO,
} from "@profile/core";
import { USER_REPOSITORY, UserPort } from "@user/core";
import { UnFollowProfileCommand } from "../impl";

@CommandHandler(UnFollowProfileCommand)
export class UnFollowProfileCommandHandler
  implements ICommandHandler<UnFollowProfileCommand>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,
    @Inject(FOLLOW_REPOSITORY)
    private readonly followsRepository: FollowPort
  ) {}

  async execute({
    followerId,
    username,
  }: UnFollowProfileCommand): Promise<ProfileRO> {
    if (!followerId || !username) {
      throw new HttpException(
        "FollowerId and username not provided.",
        HttpStatus.BAD_REQUEST
      );
    }

    const followingUser = await this.userRepository.findOne({ username });

    if (followingUser.id === followerId) {
      throw new HttpException(
        "FollowerId and FollowingId cannot be equal.",
        HttpStatus.BAD_REQUEST
      );
    }
    const follow = new FollowsEntity({
      followerId,
      followingId: followingUser.id,
    });

    await this.followsRepository.delete(follow);

    let profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: false,
    };

    return { profile };
  }
}
