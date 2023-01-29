import { Inject, Injectable } from "@nestjs/common";
import { ConfirmChannel, Connection } from "amqplib";

@Injectable()
export class ConsumerService {
  private channel: ConfirmChannel;

  constructor(
    @Inject("RABBIT_MQ_CONNECTION")
    private connection: Connection
  ) {
    this.connection
      .createConfirmChannel()
      .then((confirmChannel) => (this.channel = confirmChannel));
  }

  async consume(queueName: string, callback: (msg: any) => void) {
    await this.channel.assertQueue(queueName);
    this.channel.consume(queueName, (msg) => {
      if (msg !== null) {
        callback(JSON.parse(msg.content.toString()));
        this.channel.ack(msg);
      }
    });
  }
}
