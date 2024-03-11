import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { USER_REPOSITORY, UserPort } from "@user/core";
import {
  ARTICLE_REPOSITORY,
  ArticleEntity,
  ArticlePort,
  CreateArticleDto,
} from "../../../core";
import { ArticleService } from "../../services";

export class SeedArticleCommand {
  constructor(
    public readonly userId: number,
    public readonly articleList: CreateArticleDto[]
  ) {}
}

@CommandHandler(SeedArticleCommand)
export class SeedArticleCommandHandler
  implements ICommandHandler<SeedArticleCommand>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,

    private readonly articleService: ArticleService
  ) {}

  async execute({ userId, articleList }: SeedArticleCommand): Promise<boolean> {
    const articles: ArticleEntity[] = articleList.map((article) => {
      return new ArticleEntity({
        title: article.title,
        description: article.description,
        slug: this.articleService.slugify(article.title),
        tagList: article.tagList || [],
        blocks: article.blocks,
        created: article.created,
        commentCount: article.commentCount,
        readingTime: article.readingTime,
        favoriteCount: article.favoriteCount,
        author: {
          id: userId,
        },
        comments: [
          {
            author: {
              id: userId,
            },
            body: "This is a comment",
          },
        ],
      });
    });

    await this.articleRepository.save(articles);

    return true;
  }
}
