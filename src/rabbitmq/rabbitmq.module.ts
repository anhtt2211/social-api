import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { connect, Connection } from "amqplib";

import {
  ARTICLE_QUEUE,
  ARTICLE_RMQ_CLIENT,
  PROFILE_RMQ_CLIENT,
  USER_QUEUE,
  USER_RMQ_CLIENT,
} from "../configs";
import { ConsumerService } from "./consumer.service";
import { PublisherService } from "./publisher.service";
import { PROFILE_QUEUE } from "./rabbitmq.constants";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ARTICLE_RMQ_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_URL],
          queue: ARTICLE_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: USER_RMQ_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_URL],
          queue: USER_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: PROFILE_RMQ_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_URL],
          queue: PROFILE_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
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
  exports: [
    "RABBIT_MQ_CONNECTION",
    PublisherService,
    ConsumerService,
    ClientsModule,
  ],
})
export class RabbitMqModule {}
