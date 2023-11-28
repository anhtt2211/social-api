import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { FOLLOW_READ_REPOSITORY, FollowReadPort } from "../../../core";
import { ProfileUnFollowedEvent } from "../impl";

@EventsHandler(ProfileUnFollowedEvent)
export class ProfileUnFollowedEventHandler
  implements IEventHandler<ProfileUnFollowedEvent>
{
  constructor(
    @Inject(FOLLOW_READ_REPOSITORY)
    private readonly followsRepository: FollowReadPort
  ) {}
  async handle({ follow }: ProfileUnFollowedEvent) {
    try {
      await this.followsRepository.delete(follow);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
