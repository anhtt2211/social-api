import { ArticleFilters } from "../../../core/dto/article-query";

export class FindFeedArticleQuery {
  constructor(
    public readonly userId: number,
    public readonly query: ArticleFilters
  ) {}
}
