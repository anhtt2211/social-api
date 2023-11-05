import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import { FOLLOW_READ_REPOSITORY, FollowReadPort } from "../../../core";
import { ProfileFollowedEvent } from "../impl";

@EventsHandler(ProfileFollowedEvent)
export class ProfileFollowedEventHandler
  implements IEventHandler<ProfileFollowedEvent>
{
  constructor(
    @Inject(FOLLOW_READ_REPOSITORY)
    private readonly followsRepository: FollowReadPort
  ) {}
  async handle({ follow }: ProfileFollowedEvent) {
    try {
      await this.followsRepository.save(follow);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
