import { ArticleEntity } from "../../article.entity";

export class CreatedArticleEvent {
  constructor(public readonly article: ArticleEntity) {}
}
