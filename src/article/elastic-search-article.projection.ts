import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { ConsumerService } from "../rabbitmq/consumer.service";
import { ES_ARTICLE_QUEUE } from "../rabbitmq/rabbitmq.constants";
import { IMessage, IProjection } from "./core";
import { MessageType } from "./core/enums/article.enum";
import { IndexingArticleEvent } from "./events";

@Injectable()
export class ElasticSearchArticleProjection implements IProjection {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly eventBus: EventBus
  ) {}

  async handle() {
    await this.consumer.consume(ES_ARTICLE_QUEUE, (msg: IMessage) => {
      this.handleMessage(msg);
    });
  }

  private async handleMessage({ type, payload }: IMessage) {
    switch (type) {
      case MessageType.INDEXING_ARTICLE:
        this.eventBus.publish(new IndexingArticleEvent(payload.articles));
        break;
      default:
        break;
    }
  }
}
