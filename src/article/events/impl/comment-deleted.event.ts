// import { Comment } from "../../core/entities/comment.entity";

import { IComment } from "../../core";

export class CommentDeletedEvent {
  constructor(public readonly comment: IComment) {}
}
