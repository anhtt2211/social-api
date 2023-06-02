import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { EventPattern, Payload, Transport } from "@nestjs/microservices";

import { IPayload } from "./core";
import { MessageType } from "./core/enums/article.enum";
import {
  ArticleCreatedEvent,
  ArticleDeletedEvent,
  ArticleFavoritedEvent,
  ArticleUnFavoritedEvent,
  ArticleUpdatedEvent,
  CommentCreatedEvent,
  CommentDeletedEvent,
} from "./events";

@Injectable()
export class ArticleProjection {
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern({ type: MessageType.ARTICLE_CREATED }, Transport.RMQ)
  handleArticleCreated(@Payload() payload: IPayload) {
    this.eventBus.publish(new ArticleCreatedEvent(payload.article));
  }

  @EventPattern({ type: MessageType.ARTICLE_UPDATED }, Transport.RMQ)
  handleArticleUpdated(@Payload() payload: IPayload) {
    this.eventBus.publish(new ArticleUpdatedEvent(payload.article));
  }

  @EventPattern({ type: MessageType.ARTICLE_DELETED }, Transport.RMQ)
  handleArticleDeleted(@Payload() payload: IPayload) {
    this.eventBus.publish(
      new ArticleDeletedEvent(payload.userId, payload.slug)
    );
  }

  @EventPattern({ type: MessageType.ARTICLE_FAVORITED }, Transport.RMQ)
  handleArticleFavorited(@Payload() payload: IPayload) {
    this.eventBus.publish(
      new ArticleFavoritedEvent(payload.user, payload.article)
    );
  }

  @EventPattern({ type: MessageType.ARTICLE_UNFAVORITED }, Transport.RMQ)
  handleArticleUnFavorited(@Payload() payload: IPayload) {
    this.eventBus.publish(
      new ArticleUnFavoritedEvent(payload.user, payload.article)
    );
  }

  @EventPattern({ type: MessageType.COMMENT_CREATED }, Transport.RMQ)
  handleCommentCreated(@Payload() payload: IPayload) {
    this.eventBus.publish(new CommentCreatedEvent(payload.comment));
  }

  @EventPattern({ type: MessageType.COMMENT_DELETED }, Transport.RMQ)
  handleCommentDeleted(@Payload() payload: IPayload) {
    this.eventBus.publish(new CommentDeletedEvent(payload.comment));
  }
}
