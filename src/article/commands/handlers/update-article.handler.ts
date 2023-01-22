import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { ArticleWrite_DBEntity } from "../../article.writedb.entity";
import { UpdateArticleCommand } from "../impl";

@CommandHandler(UpdateArticleCommand)
export class UpdateArticleCommandHandler
  implements ICommandHandler<UpdateArticleCommand>
{
  constructor(
    @InjectRepository(ArticleWrite_DBEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleWrite_DBEntity>,

    private readonly articleService: ArticleService
  ) {}

  async execute({
    slug,
    articleData,
  }: UpdateArticleCommand): Promise<ArticleRO> {
    let toUpdate = await this.articleRepository.findOne({ slug: slug });
    let updated = Object.assign(toUpdate, articleData);
    const article = await this.articleRepository.save(updated);

    return { article: this.articleService.buildArticleRO(article) };
  }
}
