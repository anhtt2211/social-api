import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

import {
  ARTICLE_QUEUE,
  ARTICLE_RMQ_CLIENT,
  FILE_QUEUE,
  FILE_RMQ_CLIENT,
  PROFILE_QUEUE,
  PROFILE_RMQ_CLIENT,
  USER_QUEUE,
  USER_RMQ_CLIENT,
} from "@configs";

@Global()
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
      {
        name: FILE_RMQ_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_URL],
          queue: FILE_QUEUE,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMqModule {}
