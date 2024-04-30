import { NestFactory } from '@nestjs/core';
import { ArticleModule } from './article.module';

async function bootstrap() {
  const app = await NestFactory.create(ArticleModule);
  await app.listen(3000);
}
bootstrap();
