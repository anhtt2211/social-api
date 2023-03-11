import { Inject, Injectable, Logger } from "@nestjs/common";
import { Connection, Channel } from "amqplib";
import {
  ARTICLE_DLQ,
  ARTICLE_DL_ROUTE_KEY,
  ARTICLE_QUEUE,
  PROFILE_DLQ,
  PROFILE_DL_ROUTE_KEY,
  PROFILE_QUEUE,
  RABBIT_DL_EXCHANGE,
  RABBIT_EXCHANGE,
  USER_DLQ,
  USER_DL_ROUTE_KEY,
  USER_QUEUE,
} from "./rabbitmq.constants";

@Injectable()
export class ConsumerService {
  private channel: Channel;
  private dlChannel: Channel;

  constructor(
    @Inject("RABBIT_MQ_CONNECTION")
    private connection: Connection
  ) {
    this.init();
  }

  async init() {
    this.channel = await this.connection.createChannel();
    this.dlChannel = await this.connection.createChannel();
  }

  async consume(queueName: string, callback: (msg: any) => void) {
    if (this.channel) {
      await this.channel.assertExchange(RABBIT_EXCHANGE, "direct", {
        durable: true,
      });
      await this.channel.assertQueue(queueName, { durable: true });
      this.channel.consume(queueName, async (msg) => {
        if (msg !== null) {
          try {
            callback(JSON.parse(msg.content.toString()));
            this.channel.ack(msg);
          } catch (error) {
            Logger.error(`Error processing message: ${error.message}`);
            // Move message to its respective DLQ based on the queueName
            switch (queueName) {
              case ARTICLE_QUEUE:
                await this.publishToDLQ(ARTICLE_DLQ, msg.content.toString());
                break;
              case USER_QUEUE:
                await this.publishToDLQ(USER_DLQ, msg.content.toString());
                break;
              case PROFILE_QUEUE:
                await this.publishToDLQ(PROFILE_DLQ, msg.content.toString());
                break;
              default:
                Logger.warn(`Unknown queue name: ${queueName}`);
                break;
            }
            // Reject the message so that it is removed from the queue
            this.channel.nack(msg, false, false);
          }
        }
      });

      Logger.log(`Started consuming messages from queue '${queueName}'`);
    }
  }

  private async publishToDLQ(queueName: string, message: any) {
    await this.dlChannel.assertExchange(RABBIT_DL_EXCHANGE, "direct", {
      durable: true,
    });
    await this.channel.assertQueue(queueName, { durable: true });

    switch (queueName) {
      case ARTICLE_DLQ:
        await this.channel.bindQueue(
          ARTICLE_DLQ,
          RABBIT_DL_EXCHANGE,
          ARTICLE_DL_ROUTE_KEY
        );
        this.channel.publish(
          RABBIT_DL_EXCHANGE,
          ARTICLE_DL_ROUTE_KEY,
          Buffer.from(JSON.stringify(message)),
          {
            persistent: true,
          }
        );

        Logger.log(
          `Message type: ${message} sent to exchange ${RABBIT_DL_EXCHANGE} with route key ${ARTICLE_DL_ROUTE_KEY}`
        );
        break;
      case USER_DLQ:
        await this.channel.bindQueue(
          USER_DLQ,
          RABBIT_DL_EXCHANGE,
          USER_DL_ROUTE_KEY
        );
        this.channel.publish(
          RABBIT_DL_EXCHANGE,
          USER_DL_ROUTE_KEY,
          Buffer.from(JSON.stringify(message)),
          {
            persistent: true,
          }
        );

        Logger.log(
          `Message type: ${message} sent to exchange ${RABBIT_DL_EXCHANGE} with route key ${USER_DL_ROUTE_KEY}`
        );
        break;
      case PROFILE_DLQ:
        await this.channel.bindQueue(
          PROFILE_DLQ,
          RABBIT_DL_EXCHANGE,
          PROFILE_DL_ROUTE_KEY
        );
        this.channel.publish(
          RABBIT_DL_EXCHANGE,
          PROFILE_DL_ROUTE_KEY,
          Buffer.from(JSON.stringify(message)),
          {
            persistent: true,
          }
        );

        Logger.log(
          `Message type: ${message} sent to exchange ${RABBIT_DL_EXCHANGE} with route key ${PROFILE_DL_ROUTE_KEY}`
        );
        break;
      default:
        Logger.warn(`Unknown queue name: ${queueName}`);
        break;
    }
  }
}
