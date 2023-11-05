import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import { CommentReadPort } from "../../../core/ports";
import { COMMENT_READ_REPOSITORY } from "../../../core/token";
import { CommentCreatedEvent } from "../impl";

@EventsHandler(CommentCreatedEvent)
export class CommentCreatedEventHandler
  implements IEventHandler<CommentCreatedEvent>
{
  constructor(
    @Inject(COMMENT_READ_REPOSITORY)
    private readonly commentRepository: CommentReadPort
  ) {}
  async handle({ comment }: CommentCreatedEvent) {
    try {
      await this.commentRepository.save(comment);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
