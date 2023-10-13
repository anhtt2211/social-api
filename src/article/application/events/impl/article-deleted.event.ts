export class ArticleDeletedEvent {
  constructor(public readonly userId: number, public readonly slug: string) {}
}
