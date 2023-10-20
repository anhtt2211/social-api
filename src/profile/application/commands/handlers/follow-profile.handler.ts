import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PROFILE_RMQ_CLIENT, WRITE_CONNECTION } from "../../../../configs";
import { UserEntity } from "../../../../user/core/entities";
import { FollowsEntity } from "../../../core/entities";
import { MessageCmd } from "../../../core/enums";
import {
  IPayloadProfileFollowed,
  ProfileData,
  ProfileRO,
} from "../../../core/interfaces";
import { FollowProfileCommand } from "../impl";

@CommandHandler(FollowProfileCommand)
export class FollowProfileCommandHandler
  implements ICommandHandler<FollowProfileCommand>
{
  constructor(
    @InjectRepository(UserEntity, WRITE_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity, WRITE_CONNECTION)
    private readonly followsRepository: Repository<FollowsEntity>,
    @Inject(PROFILE_RMQ_CLIENT)
    private readonly profileRmqClient: ClientProxy
  ) {
    this.profileRmqClient.connect();
  }

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

      if (follow) {
        this.profileRmqClient.emit<any, IPayloadProfileFollowed>(
          { cmd: MessageCmd.PROFILE_FOLLOWED },
          { follow }
        );
      }
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
