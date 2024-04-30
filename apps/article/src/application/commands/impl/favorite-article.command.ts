export class FavoriteArticleCommand {
  constructor(public readonly userId: number, public readonly slug: string) {}
}
