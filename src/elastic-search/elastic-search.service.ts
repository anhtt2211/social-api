import { Injectable, Logger } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ArticleEntity, IArticleSearchResult } from "../article/core";

@Injectable()
export class SearchService {
  private readonly articleIndexes = "articles";
  private readonly articleType = "article";

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async bulkIndexArticles(articles: ArticleEntity[]) {
    const body = articles
      .map((article) => [
        { index: { _index: this.articleIndexes, _id: article.id } },
        {
          id: article.id,
          title: article.title,
          description: article.description,
          author: article.author.username,
          blockText: article.blocks.map((block) => block.data.text).join(" "),
        },
      ])
      .reduce((acc, val) => acc.concat(val), []);

    try {
      const { body: bulkResponse } = await this.elasticsearchService.bulk({
        refresh: true, // Refresh the index after the bulk operation (for testing purposes)
        body,
      });

      if (bulkResponse.errors) {
        // Handle errors in bulk indexing, if any
        const erroredDocuments = [];
        // Iterate through the items and collect errors, if any
        bulkResponse.items.forEach((action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            erroredDocuments.push({
              index: i,
              id: action[operation]._id,
              error: action[operation].error,
            });
          }
        });
        Logger.error("Bulk indexing errors:", erroredDocuments.toString());
      } else {
        Logger.log("Bulk indexing successful");
      }
    } catch (error) {
      Logger.error("Error during bulk indexing:", error);
      throw error;
    }
  }

  async indexArticle(article: ArticleEntity) {
    return this.elasticsearchService.index({
      index: this.articleIndexes,
      body: {
        id: article.id,
        title: article.title,
        description: article.description,
        author: article.author.username,
        blockText: article.blocks.map((block) => block.data.text),
      },
      type: this.articleType,
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
              fields: ["title", "description", "author", "blockText"],
            },
          },
        },
      });
    const hits = response.body.hits.hits;
    return hits.map((item) => item._source);
  }
}
