import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ElasticsearchService } from "@nestjs/elasticsearch";

import { SearchArticleQuery } from "../impl";
import { IArticleSearchResult } from "../../../core";

@QueryHandler(SearchArticleQuery)
export class SearchArticleQueryHandler
  implements IQueryHandler<SearchArticleQuery>
{
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async execute({ query }: SearchArticleQuery): Promise<any> {
    const response =
      await this.elasticsearchService.search<IArticleSearchResult>({
        index: "articles", // TODO: replace by constant
        body: {
          from: query.limit || 0,
          size: query.offset || 10,
          query: {
            multi_match: {
              query: query.search,
              fields: ["title", "description", "author", "blocks"],
            },
          },
        },
      });
    const hits = response.body.hits.hits;
    const articleEs = hits.map((item) => item._source);
    return articleEs;
  }
}
