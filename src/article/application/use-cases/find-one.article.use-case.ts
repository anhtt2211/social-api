import { Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";

import { ArticleRO } from "../../core";
import { FindOneArticleQuery } from "../queries";
import { ArticleService } from "../services";

@Injectable()
export class FindOneArticleUseCase {
  constructor(
    private readonly articleService: ArticleService,
    private readonly queryBus: QueryBus
  ) {}

  async execute(userId: number, slug: string): Promise<ArticleRO> {
    const { article, user, follows } = await this.queryBus.execute(
      new FindOneArticleQuery(userId, slug)
    );

    const articleData = this.articleService.buildArticleRO(
      article,
      user,
      !!follows
    );

    return {
      article: articleData,
    };
  }
}
