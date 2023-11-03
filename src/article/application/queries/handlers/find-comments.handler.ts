import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { CommentsRO } from "../../../core/interfaces/article.interface";
import { ArticleReadPort } from "../../../core/ports";
import { ARTICLE_READ_REPOSITORY } from "../../../core/token";
import { ArticleService } from "../../services/article.service";
import { FindCommentQuery } from "../impl";

@QueryHandler(FindCommentQuery)
export class FindCommentQueryHandler
  implements IQueryHandler<FindCommentQuery>
{
  constructor(
    @Inject(ARTICLE_READ_REPOSITORY)
    private readonly articleRepository: ArticleReadPort,

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
