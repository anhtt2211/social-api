import { ArticleEntity } from "../../core/entities/article.entity";

export class ArticleCreatedEvent {
  constructor(public readonly article: ArticleEntity) {}
}
