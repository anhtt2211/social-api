import { ArticleEntity } from "../../../core/entities/article.entity";

export class ArticleUpdatedEvent {
  constructor(public readonly article: ArticleEntity) {}
}
