import { Inject, Injectable, Logger } from "@nestjs/common";
import { Connection, Channel } from "amqplib";
import {
  ARTICLE_DLQ,
  ARTICLE_DL_ROUTE_KEY,
  ARTICLE_QUEUE,
  ARTICLE_ROUTE_KEY,
  PROFILE_DL_ROUTE_KEY,
  PROFILE_QUEUE,
  PROFILE_ROUTE_KEY,
  RABBIT_DL_EXCHANGE,
  RABBIT_EXCHANGE,
  USER_DL_ROUTE_KEY,
  USER_QUEUE,
  USER_ROUTE_KEY,
} from "./rabbitmq.constants";

@Injectable()
export class PublisherService {
  private channel: Channel;

  constructor(
    @Inject("RABBIT_MQ_CONNECTION")
    private connection: Connection
  ) {
    this.connection
      .createChannel()
      .then((channelCreated) => (this.channel = channelCreated));
  }

  async publish(queueName: string, message: any) {
    await this.channel.assertExchange(RABBIT_EXCHANGE, "direct", {
      durable: true,
    });

    await this.channel.assertQueue(queueName, {
      durable: true,
    });

    switch (queueName) {
      case ARTICLE_QUEUE:
        await this.channel.bindQueue(
          ARTICLE_QUEUE,
          RABBIT_EXCHANGE,
          ARTICLE_ROUTE_KEY
        );
        this.channel.publish(
          RABBIT_EXCHANGE,
          ARTICLE_ROUTE_KEY,
          Buffer.from(JSON.stringify(message)),
          {
            persistent: true,
          }
        );

        Logger.log(
          `Message type: ${message.type} sent to exchange ${RABBIT_EXCHANGE} with route key ${ARTICLE_ROUTE_KEY}`
        );
        break;
      case USER_QUEUE:
        await this.channel.bindQueue(
          USER_QUEUE,
          RABBIT_EXCHANGE,
          USER_ROUTE_KEY
        );
        this.channel.publish(
          RABBIT_EXCHANGE,
          USER_ROUTE_KEY,
          Buffer.from(JSON.stringify(message)),
          {
            persistent: true,
          }
        );

        Logger.log(
          `Message type: ${message.type} sent to exchange ${RABBIT_EXCHANGE} with route key ${USER_ROUTE_KEY}`
        );
        break;
      case PROFILE_QUEUE:
        await this.channel.bindQueue(
          PROFILE_QUEUE,
          RABBIT_EXCHANGE,
          PROFILE_ROUTE_KEY
        );
        this.channel.publish(
          RABBIT_EXCHANGE,
          PROFILE_ROUTE_KEY,
          Buffer.from(JSON.stringify(message)),
          {
            persistent: true,
          }
        );

        Logger.log(
          `Message type: ${message.type} sent to exchange ${RABBIT_EXCHANGE} with route key ${PROFILE_ROUTE_KEY}`
        );
        break;
      default:
        break;
    }
  }
}
