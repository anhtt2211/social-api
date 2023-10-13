import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../../config";
import { CommentEntity } from "../../../core/entities/comment.entity";
import { CommentCreatedEvent } from "../impl";

@EventsHandler(CommentCreatedEvent)
export class CommentCreatedEventHandler
  implements IEventHandler<CommentCreatedEvent>
{
  constructor(
    @InjectRepository(CommentEntity, READ_CONNECTION)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}
  async handle({ comment }: CommentCreatedEvent) {
    try {
      await this.commentRepository.save(comment);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
