import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { User } from "../user/user.decorator";
import { FollowProfileCommand, UnFollowProfileCommand } from "./commands";
import { FindProfileQuery } from "./queries";
import { ProfileRO } from "./profile.interface";

@ApiBearerAuth()
@ApiTags("profiles")
@Controller("profiles")
export class ProfileController {
  constructor(
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
