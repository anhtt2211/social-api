import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { User } from "../user/user.decorator";
import { ProfileRO } from "./profile.interface";
import { ProfileService } from "./profile.service";

import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("profiles")
@Controller("profiles")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: "get profile" })
  @Get(":username")
  async getProfile(
    @User("id") userId: number,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return await this.profileService.findProfile(userId, username);
  }

  @ApiOperation({ summary: "follow user" })
  @Post(":username/follow")
  async follow(
    @User("email") email: string,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return await this.profileService.follow(email, username);
  }

  @ApiOperation({ summary: "unfollow user" })
  @Delete(":username/follow")
  async unFollow(
    @User("id") userId: number,
    @Param("username") username: string
  ): Promise<ProfileRO> {
    return await this.profileService.unFollow(userId, username);
  }
}
