import { Inject, Injectable } from "@nestjs/common";
import { Connection, Channel } from "amqplib";

@Injectable()
export class ConsumerService {
  private channel: Channel;

  constructor(
    @Inject("RABBIT_MQ_CONNECTION")
    private connection: Connection
  ) {
    this.init();
  }

  async init() {
    this.channel = await this.connection.createChannel();
  }

  async consume(queueName: string, callback: (msg: any) => void) {
    if (this.channel) {
      await this.channel.assertQueue(queueName);
      this.channel.consume(queueName, (msg) => {
        if (msg !== null) {
          callback(JSON.parse(msg.content.toString()));
          this.channel.ack(msg);
        }
      });
    }
  }
}
