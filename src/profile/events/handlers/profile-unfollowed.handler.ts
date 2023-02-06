import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../config";
import { FollowsEntity } from "../../core/entities/follows.entity";
import { ProfileUnFollowedEvent } from "../impl";

@EventsHandler(ProfileUnFollowedEvent)
export class ProfileUnFollowedEventHandler
  implements IEventHandler<ProfileUnFollowedEvent>
{
  constructor(
    @InjectRepository(FollowsEntity, READ_CONNECTION)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}
  async handle({ follow }: ProfileUnFollowedEvent) {
    try {
      await this.followsRepository.delete(follow);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
