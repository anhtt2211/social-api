import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../../user/user.entity";
import { FollowsEntity } from "../../follows.entity";
import { ProfileData, ProfileRO } from "../../profile.interface";

export class FindProfileQuery {
  constructor(
    public readonly userId: number,
    public readonly followingUsername: string
  ) {}
}

@QueryHandler(FindProfileQuery)
export class FindProfileQueryHandler
  implements IQueryHandler<FindProfileQuery>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>
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
