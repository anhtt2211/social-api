// import { Comment } from "../../core/entities/comment.entity";

import { IComment } from "../../core";

export class CommentCreatedEvent {
  constructor(public readonly comment: IComment) {}
}
