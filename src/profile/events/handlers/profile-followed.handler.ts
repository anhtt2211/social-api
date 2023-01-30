import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { FollowsEntity } from "../../follows.entity";
import { ProfileFollowedEvent } from "../impl";

@EventsHandler(ProfileFollowedEvent)
export class ProfileFollowedEventHandler
  implements IEventHandler<ProfileFollowedEvent>
{
  constructor(
    @InjectRepository(FollowsEntity, ReadConnection)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}
  async handle({ follow }: ProfileFollowedEvent) {
    try {
      await this.followsRepository.save(follow);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
