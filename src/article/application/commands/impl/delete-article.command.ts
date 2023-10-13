export class DeleteArticleCommand {
  constructor(public readonly userId: number, public readonly slug: string) {}
}
