import { Inject, Injectable } from "@nestjs/common";
import { Connection, Channel } from "amqplib";

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
    await this.channel.assertQueue(queueName);
    this.channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
  }
}
