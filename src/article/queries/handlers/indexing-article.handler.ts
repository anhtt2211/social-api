import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { READ_CONNECTION } from "../../../config";
import { PublisherService } from "../../../rabbitmq/publisher.service";
import { ArticleEntity } from "../../core/entities/article.entity";
import { ES_ARTICLE_QUEUE } from "../../../rabbitmq/rabbitmq.constants";
import { MessageType } from "../../core";

export class IndexingArticleQuery {
  constructor() {}
}

@QueryHandler(IndexingArticleQuery)
export class IndexingArticleQueryHandler
  implements IQueryHandler<IndexingArticleQuery>
{
  constructor(
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,

    private readonly publisher: PublisherService
  ) {}

  async execute(_: IndexingArticleQuery): Promise<any> {
    const articles = await this.articleRepository.find({
      relations: ["author", "blocks"],
    });

    const chunkArticles = this.chunkArray(articles, 100);

    chunkArticles.forEach((articles: ArticleEntity[]) => {
      this.publisher.publish(ES_ARTICLE_QUEUE, {
        type: MessageType.INDEXING_ARTICLE,
        payload: { articles },
      });
    });
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      chunks.push(chunk);
    }

    return chunks;
  }
}
