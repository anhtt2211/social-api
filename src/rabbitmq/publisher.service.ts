import { Inject, Injectable } from "@nestjs/common";
import { ConfirmChannel, Connection } from "amqplib";

@Injectable()
export class PublisherService {
  private channel: ConfirmChannel;

  constructor(
    @Inject("RABBIT_MQ_CONNECTION")
    private connection: Connection
  ) {
    this.connection
      .createConfirmChannel()
      .then((confirmChannel) => (this.channel = confirmChannel));
  }

  async publish(queueName: string, message: any) {
    await this.channel.assertQueue(queueName);
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }
}
