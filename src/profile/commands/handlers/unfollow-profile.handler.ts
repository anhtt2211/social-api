import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { FollowsEntity } from "../../follows.entity";
import { ProfileData, ProfileRO } from "../../profile.interface";
import { UnFollowProfileCommand } from "../impl";

@CommandHandler(UnFollowProfileCommand)
export class UnFollowProfileCommandHandler
  implements ICommandHandler<UnFollowProfileCommand>
{
  constructor(
    @InjectRepository(UserEntity, WriteConnection)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity, WriteConnection)
    private readonly followsRepository: Repository<FollowsEntity>
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
    const followingId = followingUser.id;
    await this.followsRepository.delete({ followerId, followingId });

    let profile: ProfileData = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: false,
    };

    return { profile };
  }
}
