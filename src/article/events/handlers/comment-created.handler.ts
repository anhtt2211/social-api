import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { Comment } from "../../comment.entity";
import { CommentCreatedEvent } from "../impl";

@EventsHandler(CommentCreatedEvent)
export class CommentCreatedEventHandler
  implements IEventHandler<CommentCreatedEvent>
{
  constructor(
    @InjectRepository(Comment, ReadConnection)
    private readonly commentRepository: Repository<Comment>
  ) {}
  async handle({ comment }: CommentCreatedEvent) {
    try {
      await this.commentRepository.save(comment);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
