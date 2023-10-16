import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { ArticleEntity } from "../../../core";
import { SearchService } from "../../../../elastic-search/elastic-search.service";

export class IndexingArticleEvent {
  constructor(public readonly articles: ArticleEntity[]) {}
}

@EventsHandler(IndexingArticleEvent)
export class IndexingArticleEventHandler
  implements IEventHandler<IndexingArticleEvent>
{
  constructor(private readonly elasticSearch: SearchService) {}

  async handle({ articles }: IndexingArticleEvent) {
    await this.elasticSearch.bulkIndexArticles(articles);
  }
}
