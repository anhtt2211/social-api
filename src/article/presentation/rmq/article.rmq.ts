import { Controller } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { EventPattern, Payload, Transport } from "@nestjs/microservices";

import {
  ArticleCreatedEvent,
  ArticleDeletedEvent,
  ArticleFavoritedEvent,
  ArticleUnFavoritedEvent,
  ArticleUpdatedEvent,
  CommentCreatedEvent,
  CommentDeletedEvent,
} from "../../application/events";
import {
  IPayloadArticleCreated,
  IPayloadArticleDeleted,
  IPayloadArticleFavorited,
  IPayloadArticleUnFavorited,
  IPayloadArticleUpdated,
  IPayloadCommentCreated,
  IPayloadCommentDeleted,
} from "../../core";
import { MessageCmd } from "../../core/enums";

@Controller()
export class ArticleRmq {
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern({ cmd: MessageCmd.ARTICLE_CREATED }, Transport.RMQ)
  async articleCreated(@Payload() payload: IPayloadArticleCreated) {
    return this.eventBus.publish(new ArticleCreatedEvent(payload.article));
  }

  @EventPattern({ cmd: MessageCmd.ARTICLE_UPDATED }, Transport.RMQ)
  async articleUpdated(@Payload() payload: IPayloadArticleUpdated) {
    return this.eventBus.publish(new ArticleUpdatedEvent(payload.article));
  }

  @EventPattern({ cmd: MessageCmd.ARTICLE_DELETED }, Transport.RMQ)
  async articleDeleted(@Payload() { userId, slug }: IPayloadArticleDeleted) {
    return this.eventBus.publish(new ArticleDeletedEvent(userId, slug));
  }

  @EventPattern({ cmd: MessageCmd.ARTICLE_FAVORITED }, Transport.RMQ)
  async articleFavorited(@Payload() payload: IPayloadArticleFavorited) {
    return this.eventBus.publish(
      new ArticleFavoritedEvent(payload.user, payload.article)
    );
  }

  @EventPattern({ cmd: MessageCmd.ARTICLE_UNFAVORITED }, Transport.RMQ)
  async articleUnFavorited(@Payload() payload: IPayloadArticleUnFavorited) {
    return this.eventBus.publish(
      new ArticleUnFavoritedEvent(payload.user, payload.article)
    );
  }

  @EventPattern({ cmd: MessageCmd.COMMENT_CREATED }, Transport.RMQ)
  async commentCreated(@Payload() payload: IPayloadCommentCreated) {
    return this.eventBus.publish(new CommentCreatedEvent(payload.comment));
  }

  @EventPattern({ cmd: MessageCmd.COMMENT_DELETED }, Transport.RMQ)
  async commentDeleted(@Payload() payload: IPayloadCommentDeleted) {
    return this.eventBus.publish(new CommentDeletedEvent(payload.comment));
  }
}
