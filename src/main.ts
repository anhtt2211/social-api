import { NestFactory } from "@nestjs/core";
import { ApplicationModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json, urlencoded } from "express";
import { ArticleProjection } from "./article/article.projection";
import { INestApplication } from "@nestjs/common";
import { UserProjection } from "./user/user.projection";
import { ProfileProjection } from "./profile/profile.projection";

async function executeProjection(app: INestApplication) {
  const articleProjection = app.get(ArticleProjection);
  const userProjection = app.get(UserProjection);
  const profileProjection = app.get(ProfileProjection);

  await articleProjection.handle();
  await userProjection.handle();
  await profileProjection.handle();
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
