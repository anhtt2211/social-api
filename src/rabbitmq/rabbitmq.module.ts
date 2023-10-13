import { Module } from "@nestjs/common";
import { connect, Connection } from "amqplib";

import { ConsumerService } from "./consumer.service";
import { PublisherService } from "./publisher.service";

@Module({
  imports: [],
  providers: [
    {
      provide: "RABBIT_MQ_CONNECTION",
      useFactory: async (): Promise<Connection> => {
        return connect(process.env.RABBIT_URL);
      },
    },
    PublisherService,
    ConsumerService,
  ],
  exports: ["RABBIT_MQ_CONNECTION", PublisherService, ConsumerService],
})
export class RabbitMqModule {}
