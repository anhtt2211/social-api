import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { ArticleEntity } from "../../article.entity";
import { CommentsRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { FindCommentQuery } from "../impl";

@QueryHandler(FindCommentQuery)
export class FindCommentQueryHandler
  implements IQueryHandler<FindCommentQuery>
{
  constructor(
    @InjectRepository(ArticleEntity, ReadConnection)
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
