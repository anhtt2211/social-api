import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../config";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { QUEUE_NAME } from "../../../rabbitmq/rabbitmq.constants";
import { UserEntity } from "../../../user/user.entity";
import { FollowsEntity } from "../../core/entities/follows.entity";
import { MessageType } from "../../core/enums/profile.enum";
import {
  ProfileData,
  ProfileRO,
} from "../../core/interfaces/profile.interface";
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

    private readonly publisher: PublisherService
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

      this.publisher.publish(QUEUE_NAME, {
        type: MessageType.PROFILE_FOLLOWED,
        payload: {
          follow,
        },
      });
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
