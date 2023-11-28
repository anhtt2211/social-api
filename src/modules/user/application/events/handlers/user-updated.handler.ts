import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import { USER_READ_REPOSITORY, UserReadPort } from "../../../core";
import { UserUpdatedEvent } from "../impl";

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedEventHandler
  implements IEventHandler<UserUpdatedEvent>
{
  constructor(
    @Inject(USER_READ_REPOSITORY)
    private readonly userRepository: UserReadPort
  ) {}
  async handle({ user }: UserUpdatedEvent) {
    try {
      await this.userRepository.save(user);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
