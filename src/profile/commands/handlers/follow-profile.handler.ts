import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { FollowsEntity } from "../../follows.entity";
import { ProfileData, ProfileRO } from "../../profile.interface";
import { FollowProfileCommand } from "../impl";

@CommandHandler(FollowProfileCommand)
export class FollowProfileCommandHandler
  implements ICommandHandler<FollowProfileCommand>
{
  constructor(
    @InjectRepository(UserEntity, WriteConnection)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity, WriteConnection)
    private readonly followsRepository: Repository<FollowsEntity>
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
      const follows = new FollowsEntity();
      follows.followerId = followerUser.id;
      follows.followingId = followingUser.id;
      await this.followsRepository.save(follows);
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
