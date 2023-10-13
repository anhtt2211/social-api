export class DeleteCommentCommand {
  constructor(
    public readonly userId: number,
    public readonly slug: string,
    public readonly commentId: number
  ) {}
}
