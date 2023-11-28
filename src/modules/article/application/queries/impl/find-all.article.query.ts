import { ArticleFilters } from "../../../core/dto/article-query";

export class FindAllArticleQuery {
  constructor(
    public readonly userId: number,
    public readonly query: ArticleFilters
  ) {}
}
