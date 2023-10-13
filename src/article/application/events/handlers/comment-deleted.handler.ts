import { HttpException, HttpStatus } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../../config";
import { CommentEntity } from "../../../core/entities/comment.entity";
import { CommentDeletedEvent } from "../impl";

@EventsHandler(CommentDeletedEvent)
export class CommentDeletedEventHandler
  implements IEventHandler<CommentDeletedEvent>
{
  constructor(
    @InjectRepository(CommentEntity, READ_CONNECTION)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}
  async handle({ comment }: CommentDeletedEvent) {
    try {
      await this.commentRepository.delete(comment.id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}