export class UnFavoriteArticleCommand {
  constructor(public readonly userId: number, public readonly slug: string) {}
}
