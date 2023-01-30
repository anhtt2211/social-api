import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { Comment } from "../../comment.entity";
import { CommentDeletedEvent } from "../impl";

@EventsHandler(CommentDeletedEvent)
export class CommentDeletedEventHandler
  implements IEventHandler<CommentDeletedEvent>
{
  constructor(
    @InjectRepository(Comment, ReadConnection)
    private readonly commentRepository: Repository<Comment>
  ) {}
  async handle({ comment }: CommentDeletedEvent) {
    try {
      await this.commentRepository.delete(comment.id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
