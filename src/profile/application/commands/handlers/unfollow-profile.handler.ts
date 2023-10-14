import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WRITE_CONNECTION } from "../../../../configs";
import { PublisherService } from "../../../../rabbitmq/publisher.service";
import { PROFILE_QUEUE } from "../../../../rabbitmq/rabbitmq.constants";
import { UserEntity } from "../../../../user/core/entities/user.entity";
import { FollowsEntity } from "../../../core/entities/follows.entity";
import { MessageType } from "../../../core/enums/profile.enum";
import {
  ProfileData,
  ProfileRO,
} from "../../../core/interfaces/profile.interface";
import { UnFollowProfileCommand } from "../impl";

@CommandHandler(UnFollowProfileCommand)
export class UnFollowProfileCommandHandler
  implements ICommandHandler<UnFollowProfileCommand>
{
  constructor(
    @InjectRepository(UserEntity, WRITE_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity, WRITE_CONNECTION)
    private readonly followsRepository: Repository<FollowsEntity>,

    private readonly publisher: PublisherService
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
    const follow = {
      followerId,
      followingId: followingUser.id,
    };
    const _deleted = await this.followsRepository.delete(follow);

    if (_deleted) {
      this.publisher.publish(PROFILE_QUEUE, {
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
      following: false,
    };

    return { profile };
  }
}
