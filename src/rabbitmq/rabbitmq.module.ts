import { Module } from "@nestjs/common";
import { Connection, connect } from "amqplib";
import { ConsumerService } from "./consumer.service";
import { PublisherService } from "./publisher.service";

@Module({
  imports: [],
  providers: [
    {
      provide: "RABBIT_MQ_CONNECTION",
      useFactory: async (): Promise<Connection> => {
        return connect("amqp://localhost");
      },
    },
    PublisherService,
    ConsumerService,
  ],
  exports: ["RABBIT_MQ_CONNECTION", PublisherService, ConsumerService],
})
export class RabbitMqModule {}
