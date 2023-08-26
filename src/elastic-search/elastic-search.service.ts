import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ArticleEntity, IArticleSearchResult } from "../article/core";

@Injectable()
export class SearchService {
  private readonly articleIndexes = "articles";

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexArticle(article: ArticleEntity) {
    return this.elasticsearchService.index({
      index: this.articleIndexes,
      body: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.description,
        author: article.author.username,
        blockText: article.blocks.map((block) => block.data.text),
      },
    });
  }

  async searchArticles(search: string) {
    const response =
      await this.elasticsearchService.search<IArticleSearchResult>({
        index: this.articleIndexes,
        body: {
          query: {
            multi_match: {
              query: search,
              fields: ["title", "description"],
            },
          },
        },
      });
    const hits = response.hits.hits;
    return hits.map((item) => item._source);
  }
}
