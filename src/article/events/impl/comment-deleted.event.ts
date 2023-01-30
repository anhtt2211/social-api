import { Comment } from "../../comment.entity";

export class CommentDeletedEvent {
  constructor(public readonly comment: Comment) {}
}
