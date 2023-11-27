import { NestApplicationOptions } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { RmqOptions, Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cluster from "cluster";
import { json, urlencoded } from "express";
import * as os from "os";

import { ApplicationModule } from "./app.module";
import {
  ARTICLE_QUEUE,
  FILE_QUEUE,
  PROFILE_QUEUE,
  USER_QUEUE,
} from "./configs";

async function bootstrap() {
  if (cluster.isMaster) {
    const numWorkers = os.cpus().length;
    console.log(`Master cluster setting up ${numWorkers} workers...`);

    for (let i = 0; i < numWorkers; i++) {
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
    const appOptions: NestApplicationOptions = {
      cors: {
        origin: [process.env.CORS_ORIGIN],
      },
    };
    const app = await NestFactory.create(ApplicationModule, appOptions);
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
    app.setGlobalPrefix("api");

    app.connectMicroservice<RmqOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_URL],
        queue: ARTICLE_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    });
    app.connectMicroservice<RmqOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_URL],
        queue: USER_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    });
    app.connectMicroservice<RmqOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_URL],
        queue: PROFILE_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    });

    app.connectMicroservice<RmqOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_URL],
        queue: FILE_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    });

    const options = new DocumentBuilder()
      .setTitle("Social API")
      .setDescription("The Boilerplate API description")
      .setVersion("1.0")
      .setBasePath("api")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("/docs", app, document);

    app.startAllMicroservices();
    await app.listen(8000);
  }
}
bootstrap();
