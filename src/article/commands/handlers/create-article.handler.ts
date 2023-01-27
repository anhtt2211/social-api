import { HttpException, HttpStatus } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { ArticleCreatedEvent } from "../../events";
import { CreateArticleCommand } from "../impl";

@CommandHandler(CreateArticleCommand)
export class CreateArticleCommandHandler
  implements ICommandHandler<CreateArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, WriteConnection)
    private readonly userRepository: Repository<UserEntity>,

    private readonly eventBus: EventBus,
    private readonly articleService: ArticleService
  ) {}

  async execute({
    userId,
    articleData,
  }: CreateArticleCommand): Promise<ArticleRO> {
    try {
      let article = new ArticleEntity({
        ...articleData,
        slug: this.articleService.slugify(articleData.title),
      });
      const newArticle = await this.articleRepository.save(article);

      const author = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["articles"],
      });
      author.articles.push(article);

      await this.userRepository.save(author);

      this.eventBus.publish(new ArticleCreatedEvent(userId, newArticle));

      return {
        article: this.articleService.buildArticleRO(newArticle),
      };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
