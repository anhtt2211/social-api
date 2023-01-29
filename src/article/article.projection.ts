import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { ConsumeMessage } from "amqplib";
import { ConsumerService } from "../rabbitmq/consumer.service";
import { QUEUE_NAME } from "../rabbitmq/rabbitmq.constants";
import { ArticleCreatedEvent } from "./events";

interface IProjection {
  handle(): Promise<void>;
}

@Injectable()
export class ArticleProjection implements IProjection {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly eventBus: EventBus
  ) {}

  async handle() {
    await this.consumer.consume(QUEUE_NAME, (msg: ConsumeMessage) => {
      this.handleMessage(msg);
    });
  }

  private async handleMessage({ type, payload }: any) {
    console.log(`Received event: ${type}`);
    switch (type) {
      case "article_created":
        this.eventBus.publish(new ArticleCreatedEvent(payload.article));
        break;

      default:
        break;
    }

    console.log("Projection executed successfully");
  }
}
