import { ArticleEntity } from "../../article.entity";

export class ArticleCreatedEvent {
  constructor(
    public readonly userId: number,
    public readonly article: ArticleEntity
  ) {}
}
