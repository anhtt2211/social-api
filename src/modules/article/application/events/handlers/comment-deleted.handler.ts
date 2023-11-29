import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import { CommentReadPort } from "../../../core/ports";
import { COMMENT_READ_REPOSITORY } from "../../../core/token";
import { CommentDeletedEvent } from "../impl";

@EventsHandler(CommentDeletedEvent)
export class CommentDeletedEventHandler
  implements IEventHandler<CommentDeletedEvent>
{
  constructor(
    @Inject(COMMENT_READ_REPOSITORY)
    private readonly commentRepository: CommentReadPort
  ) {}
  async handle({ comment }: CommentDeletedEvent) {
    try {
      await this.commentRepository.delete(comment.id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}