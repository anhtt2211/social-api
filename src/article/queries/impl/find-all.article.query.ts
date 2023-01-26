import { ArticleFilters } from "../../dto/article-query";

export class FindAllArticleQuery {
  constructor(
    public readonly userId: number,
    public readonly query: ArticleFilters
  ) {}
}
