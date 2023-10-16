import { Injectable, Logger } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";

import { ConsumerService } from "../../../rabbitmq/consumer.service";
import { ARTICLE_QUEUE } from "../../../rabbitmq/rabbitmq.constants";
import { ArticleEntity, IMessage, IProjection } from "../../core";
import { MessageCmd, MessageType } from "../../core/enums/article.enum";
import {
  ArticleCreatedEvent,
  ArticleDeletedEvent,
  ArticleFavoritedEvent,
  ArticleUnFavoritedEvent,
  ArticleUpdatedEvent,
  CommentCreatedEvent,
  CommentDeletedEvent,
} from "../../application/events";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Injectable()
export class ArticleRmq {
  constructor(private readonly eventBus: EventBus) {}

  //   async handle() {
  //     await this.consumer.consume(ARTICLE_QUEUE, (msg: IMessage) => {
  //       this.handleMessage(msg);
  //     });
  //   }

  @MessagePattern(MessageCmd.ARTICLE_CREATED)
  async articleCreated(@Payload() data: ArticleEntity) {
    Logger.log({ data });

    return;

    this.eventBus.publish(new ArticleCreatedEvent(data));
  }

  private async handleMessage({ type, payload }: IMessage) {
    switch (type) {
      case MessageType.ARTICLE_CREATED:
        this.eventBus.publish(new ArticleCreatedEvent(payload.article));
        break;
      case MessageType.ARTICLE_UPDATED:
        this.eventBus.publish(new ArticleUpdatedEvent(payload.article));
        break;
      case MessageType.ARTICLE_DELETED:
        this.eventBus.publish(
          new ArticleDeletedEvent(payload.userId, payload.slug)
        );
        break;
      case MessageType.ARTICLE_FAVORITED:
        this.eventBus.publish(
          new ArticleFavoritedEvent(payload.user, payload.article)
        );
        break;
      case MessageType.ARTICLE_UNFAVORITED:
        this.eventBus.publish(
          new ArticleUnFavoritedEvent(payload.user, payload.article)
        );
        break;
      case MessageType.COMMENT_CREATED:
        this.eventBus.publish(new CommentCreatedEvent(payload.comment));
        break;
      case MessageType.COMMENT_DELETED:
        this.eventBus.publish(new CommentDeletedEvent(payload.comment));
        break;
      default:
        break;
    }
  }
}
