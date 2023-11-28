export class FindOneArticleQuery {
  constructor(public readonly userId: number, public readonly slug: string) {}
}
