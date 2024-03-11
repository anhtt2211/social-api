import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { ARTICLE_REPOSITORY, ArticlePort, CommentsRO } from "../../../core";
import { ArticleService } from "../../services";
import { FindCommentQuery } from "../impl";

@QueryHandler(FindCommentQuery)
export class FindCommentQueryHandler
  implements IQueryHandler<FindCommentQuery>
{
  constructor(
    @Inject(ARTICLE_REPOSITORY)
    private readonly articleRepository: ArticlePort,

    private readonly articleService: ArticleService
  ) {}

  async execute({ slug }: FindCommentQuery): Promise<CommentsRO> {
    const article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["comments", "comments.author"],
      }
    );

    if (!article) {
      throw new Error("Cannot find article");
    }

    const commentsRO = article.comments.map((comment) =>
      this.articleService.buildCommentRO(comment)
    );

    return { comments: commentsRO };
  }
}
