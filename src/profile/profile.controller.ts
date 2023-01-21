import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { User } from "../user/user.decorator";
import { ProfileRO } from "./profile.interface";
import { ProfileService } from "./profile.service";
import { FindProfileQuery } from "./handlers/queries";
import {
  FollowProfileCommand,
  UnFollowProfileCommand,
} from "./handlers/commands";

@ApiBearerAuth()
@ApiTags("profiles")
@Controller("profiles")
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @ApiOperation({ summary: "get profile" })
  @Get(":username")
  async getProfile(
    @User("id") userId: number,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return this.queryBus.execute(new FindProfileQuery(userId, username));
  }

  @ApiOperation({ summary: "follow user" })
  @Post(":username/follow")
  async follow(
    @User("email") email: string,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return this.commandBus.execute(new FollowProfileCommand(email, username));
  }

  @ApiOperation({ summary: "unfollow user" })
  @Delete(":username/follow")
  async unFollow(
    @User("id") userId: number,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return this.commandBus.execute(
      new UnFollowProfileCommand(userId, username)
    );
  }
}
