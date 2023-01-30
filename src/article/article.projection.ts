import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { ConsumerService } from "../rabbitmq/consumer.service";
import { QUEUE_NAME } from "../rabbitmq/rabbitmq.constants";
import { UserEntity } from "../user/user.entity";
import { ArticleEntity } from "./article.entity";
import { MessageType } from "./article.enum";
import { Comment } from "./comment.entity";
import {
  ArticleCreatedEvent,
  ArticleDeletedEvent,
  ArticleFavoritedEvent,
  ArticleUnFavoritedEvent,
  ArticleUpdatedEvent,
  CommentCreatedEvent,
  CommentDeletedEvent,
} from "./events";

interface IProjection {
  handle(): Promise<void>;
}

interface IMessage {
  type: string;
  payload: {
    article?: ArticleEntity;
    user?: UserEntity;
    slug?: string;
    userId?: number;
    comment?: Comment;
  };
}

@Injectable()
export class ArticleProjection implements IProjection {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly eventBus: EventBus
  ) {}

  async handle() {
    await this.consumer.consume(QUEUE_NAME, (msg: IMessage) => {
      this.handleMessage(msg);
    });
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