import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WriteConnection } from "../../../config";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { FavoriteArticleCommand } from "../impl";

@CommandHandler(FavoriteArticleCommand)
export class FavoriteArticleCommandHandler
  implements ICommandHandler<FavoriteArticleCommand>
{
  constructor(
    @InjectRepository(ArticleEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, WriteConnection)
    private readonly userRepository: Repository<UserEntity>,

    private readonly articleService: ArticleService
  ) {}

  async execute({ userId, slug }: FavoriteArticleCommand): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["author"],
      }
    );
    const user = await this.userRepository.findOne(userId, {
      relations: ["favorites"],
    });

    const isNewFavorite =
      user.favorites.findIndex((_article) => _article.id === article.id) < 0;
    if (isNewFavorite) {
      user.favorites.push(article);
      article.favoriteCount++;

      await this.userRepository.save(user);
      article = await this.articleRepository.save(article);
    }

    return { article: this.articleService.buildArticleRO(article, user) };
  }
}
