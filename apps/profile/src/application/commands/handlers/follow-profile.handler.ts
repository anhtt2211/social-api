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
import { FollowProfileCommand } from "../impl";

@CommandHandler(FollowProfileCommand)
export class FollowProfileCommandHandler
  implements ICommandHandler<FollowProfileCommand>
{
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserPort,
    @Inject(FOLLOW_REPOSITORY)
    private readonly followsRepository: FollowPort
  ) {}

  async execute({
    followerEmail,
    username,
  }: FollowProfileCommand): Promise<ProfileRO> {
    if (!followerEmail || !username) {
      throw new HttpException(
        "Follower email and username not provided.",
        HttpStatus.BAD_REQUEST
      );
    }

    const followingUser = await this.userRepository.findOne({ username });
    const followerUser = await this.userRepository.findOne({
      email: followerEmail,
    });

    if (followingUser.email === followerEmail) {
      throw new HttpException(
        "FollowerEmail and FollowingId cannot be equal.",
        HttpStatus.BAD_REQUEST
      );
    }

    const _follows = await this.followsRepository.findOne({
      followerId: followerUser.id,
      followingId: followingUser.id,
    });

    if (!_follows) {
      const follow = await this.followsRepository.save(
        new FollowsEntity({
          followerId: followerUser.id,
          followingId: followingUser.id,
        })
      );
    }

    let profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: true,
    };

    return { profile };
  }
}
