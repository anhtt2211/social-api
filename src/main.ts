import { INestApplication, NestApplicationOptions } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cluster from "cluster";
import { json, urlencoded } from "express";
import * as os from "os";

import { ApplicationModule } from "./app.module";
import { ArticleProjection } from "./article/application/projections";
import { ProfileProjection } from "./profile/application/projections";
import { UserProjection } from "./user/application/projections";

async function executeProjection(app: INestApplication) {
  const articleProjection = app.get(ArticleProjection);
  const elasticSearchArticleProjection = app.get(
    ElasticSearchArticleProjection
  );
  const userProjection = app.get(UserProjection);
  const profileProjection = app.get(ProfileProjection);

  await articleProjection.handle();
  await elasticSearchArticleProjection.handle();
  await userProjection.handle();
  await profileProjection.handle();
}

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

    await executeProjection(app);

    const options = new DocumentBuilder()
      .setTitle("Social API")
      .setDescription("The Boilerplate API description")
      .setVersion("1.0")
      .setBasePath("api")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("/docs", app, document);

    await app.listen(8000);
  }
}
bootstrap();
