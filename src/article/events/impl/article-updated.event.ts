import { ArticleEntity } from "../../article.entity";

export class ArticleUpdatedEvent {
  constructor(public readonly article: ArticleEntity) {}
}
