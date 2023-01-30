import { ArticleEntity } from "../../article.entity";

export class ArticleCreatedEvent {
  constructor(public readonly article: ArticleEntity) {}
}
