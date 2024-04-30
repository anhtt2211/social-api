import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

describe('ArticleController', () => {
  let articleController: ArticleController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [ArticleService],
    }).compile();

    articleController = app.get<ArticleController>(ArticleController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(articleController.getHello()).toBe('Hello World!');
    });
  });
});
