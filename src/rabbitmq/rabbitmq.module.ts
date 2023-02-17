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
        if (process.env.NODE_ENV === "development") {
          return connect("amqp://localhost") || connect(process.env.RABBIT_URL_DEV);
        }
        if (process.env.NODE_ENV === "staging") {
          return connect(process.env.RABBIT_URL);
        }
      },
    },
    PublisherService,
    ConsumerService,
  ],
  exports: ["RABBIT_MQ_CONNECTION", PublisherService, ConsumerService],
})
export class RabbitMqModule {}
