import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";

import { PROFILE_RMQ_CLIENT } from "../../../../configs";
import { USER_WRITE_REPOSITORY, UserWritePort } from "../../../../user/core";
import { FOLLOW_WRITE_REPOSITORY, FollowWritePort } from "../../../core";
import { FollowsEntity } from "../../../core/entities";
import { MessageCmd } from "../../../core/enums";
import {
  IPayloadProfileUnFollowed,
  ProfileData,
  ProfileRO,
} from "../../../core/interfaces";
import { UnFollowProfileCommand } from "../impl";

@CommandHandler(UnFollowProfileCommand)
export class UnFollowProfileCommandHandler
  implements ICommandHandler<UnFollowProfileCommand>
{
  constructor(
    @Inject(USER_WRITE_REPOSITORY)
    private readonly userRepository: UserWritePort,
    @Inject(FOLLOW_WRITE_REPOSITORY)
    private readonly followsRepository: FollowWritePort,
    @Inject(PROFILE_RMQ_CLIENT)
    private readonly profileRmqClient: ClientProxy
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

    const _deleted = await this.followsRepository.delete(follow);

    if (_deleted) {
      this.profileRmqClient.emit<any, IPayloadProfileUnFollowed>(
        { cmd: MessageCmd.PROFILE_UNFOLLOWED },
        { follow }
      );
    }

    let profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: false,
    };

    return { profile };
  }
}
