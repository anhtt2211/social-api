import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleEntity } from "../../article.entity";
import { CommentsRO } from "../../article.interface";
import { ArticleService } from "../../article.service";

export class FindCommentQuery {
  constructor(public readonly slug: string) {}
}

@QueryHandler(FindCommentQuery)
export class FindCommentQueryHandler
  implements IQueryHandler<FindCommentQuery>
{
  constructor(
    @InjectRepository(ArticleEntity)
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
