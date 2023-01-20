import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { CreateArticleDto } from "../../dto";

export class CreateArticleCommand {
  constructor(
    public readonly userId: number,
    public readonly articleData: CreateArticleDto
  ) {}
}

@CommandHandler(CreateArticleCommand)
export class CreateArticleCommandHandler
  implements ICommandHandler<CreateArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly articleService: ArticleService
  ) {}

  async execute({
    userId,
    articleData,
  }: CreateArticleCommand): Promise<ArticleRO> {
    let article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.articleService.slugify(articleData.title);
    article.tagList = articleData.tagList || [];
    article.comments = [];
    article.blocks = articleData.blocks;

    const newArticle = await this.articleRepository.save(article);

    const author = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["articles"],
    });
    author.articles.push(article);

    await this.userRepository.save(author);

    return {
      article: this.articleService.buildArticleRO(newArticle),
    };
  }
}
