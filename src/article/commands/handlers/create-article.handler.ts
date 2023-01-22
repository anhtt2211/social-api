import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserWrite_DBEntity } from "../../../user/user.writedb.entity";
import { ArticleWrite_DBEntity } from "../../article.writedb.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { CreatedArticleEvent } from "../../events";
import { CreateArticleCommand } from "../impl";

@CommandHandler(CreateArticleCommand)
export class CreateArticleCommandHandler
  implements ICommandHandler<CreateArticleCommand>
{
  constructor(
    @InjectRepository(ArticleWrite_DBEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleWrite_DBEntity>,
    @InjectRepository(UserWrite_DBEntity, WriteConnection)
    private readonly userRepository: Repository<UserWrite_DBEntity>,

    private readonly eventBus: EventBus,
    private readonly articleService: ArticleService
  ) {}

  async execute({
    userId,
    articleData,
  }: CreateArticleCommand): Promise<ArticleRO> {
    try {
      let article = new ArticleWrite_DBEntity();
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

      this.eventBus.publish(new CreatedArticleEvent(userId, newArticle));

      return {
        article: this.articleService.buildArticleRO(newArticle),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
