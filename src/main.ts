import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cluster from "cluster";
import { json, urlencoded } from "express";
import * as os from "os";

import { ApplicationModule } from "./app.module";
import {
  ARTICLE_QUEUE,
  PROFILE_QUEUE,
  USER_QUEUE,
} from "./rabbitmq/rabbitmq.constants";

async function bootstrap() {
  if (cluster.isMaster) {
    const numWorkers = os.cpus().length;
    console.log(`Master cluster setting up ${numWorkers} workers...`);

    for (let i = 0; i < 1; i++) {
      cluster.fork();
    }

    cluster.on("online", (worker) => {
      console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on("exit", (worker, code, signal) => {
      console.log(
        `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
      );
      console.log("Starting a new worker");
      cluster.fork();
    });
  } else {
    const appOptions = { cors: true };
    const app = await NestFactory.create(ApplicationModule, appOptions);
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
    app.setGlobalPrefix("api");

    app.connectMicroservice(
      {
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost", "amqp://guest:guest@rabbitmq:5672"],
          queue: ARTICLE_QUEUE,
          queueOptions: {
            durable: true,
          },
          connectionOptions: {
            timeout: 10000,
          },
        },
      },
      { inheritAppConfig: true }
    );
    app.connectMicroservice(
      {
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost", "amqp://guest:guest@rabbitmq:5672"],
          queue: USER_QUEUE,
          queueOptions: {
            durable: true,
          },
          connectionOptions: {
            timeout: 10000,
          },
        },
      },
      { inheritAppConfig: true }
    );
    app.connectMicroservice(
      {
        transport: Transport.RMQ,
        options: {
          urls: ["amqp://localhost", "amqp://guest:guest@rabbitmq:5672"],
          queue: PROFILE_QUEUE,
          queueOptions: {
            durable: true,
          },
          connectionOptions: {
            timeout: 10000,
          },
        },
      },
      { inheritAppConfig: true }
    );

    app.startAllMicroservices();

    const options = new DocumentBuilder()
      .setTitle("Social API")
      .setDescription("The Boilerplate API description")
      .setVersion("1.0")
      .setBasePath("api")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("/docs", app, document);

    await app.listen(8000, () => {
      Logger.log(`Application running on port ${8000} bootstrap`);
    });
  }
}
bootstrap();
