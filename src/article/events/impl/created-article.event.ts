import { ArticleWrite_DBEntity } from "../../article.writedb.entity";

export class CreatedArticleEvent {
  constructor(
    public readonly userId: number,
    public readonly article: ArticleWrite_DBEntity
  ) {}
}
