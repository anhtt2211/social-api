import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json, urlencoded } from "express";
import { ArticleProjection } from "./article/article.projection";
import { INestApplication } from "@nestjs/common";

async function executeProjection(app: INestApplication) {
  const articleProjection = app.get(ArticleProjection);
  await articleProjection.handle();
}

async function bootstrap() {
  const appOptions = { cors: true };
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
bootstrap();
