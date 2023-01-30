import { Comment } from "../../comment.entity";

export class CommentCreatedEvent {
  constructor(public readonly comment: Comment) {}
}
