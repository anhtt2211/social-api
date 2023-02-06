import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { READ_CONNECTION } from "../../../config";
import { ArticleEntity } from "../../core/entities/article.entity";
import { CommentsRO } from "../../core/interfaces/article.interface";
import { ArticleService } from "../../services/article.service";
import { FindCommentQuery } from "../impl";

@QueryHandler(FindCommentQuery)
export class FindCommentQueryHandler
  implements IQueryHandler<FindCommentQuery>
{
  constructor(
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,

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
