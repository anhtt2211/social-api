import { ArticleEntity } from "../../article.entity";

export class CreatedArticleEvent {
  constructor(
    public readonly userId: number,
    public readonly article: ArticleEntity
  ) {}
}
