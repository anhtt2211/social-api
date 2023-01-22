import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserWrite_DBEntity } from "../../../user/user.writedb.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { ArticleWrite_DBEntity } from "../../article.writedb.entity";
import { UnFavoriteArticleCommand } from "../impl";

@CommandHandler(UnFavoriteArticleCommand)
export class UnFavoriteArticleCommandHandler
  implements ICommandHandler<UnFavoriteArticleCommand>
{
  constructor(
    @InjectRepository(ArticleWrite_DBEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleWrite_DBEntity>,
    @InjectRepository(UserWrite_DBEntity, WriteConnection)
    private readonly userRepository: Repository<UserWrite_DBEntity>,

    private readonly articleService: ArticleService
  ) {}

  async execute({
    userId,
    slug,
  }: UnFavoriteArticleCommand): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["author"],
      }
    );
    const user = await this.userRepository.findOne(userId, {
      relations: ["favorites"],
    });

    const deleteIndex = user.favorites.findIndex(
      (_article) => _article.id === article.id
    );

    if (deleteIndex >= 0) {
      user.favorites.splice(deleteIndex, 1);
      article.favoriteCount--;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return { article: this.articleService.buildArticleRO(article, user) };
  }
}
