import { HttpException, HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ReadConnection } from "../../../config";
import { FollowsEntity } from "../../../profile/follows.entity";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { FindOneArticleQuery } from "../impl";

@QueryHandler(FindOneArticleQuery)
export class FindOneArticleQueryHandler
  implements IQueryHandler<FindOneArticleQuery>
{
  constructor(
    @InjectRepository(ArticleEntity, ReadConnection)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity, ReadConnection)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity, ReadConnection)
    private readonly followsRepository: Repository<FollowsEntity>,

    private readonly articleService: ArticleService
  ) {}

  async execute({ userId, slug }: FindOneArticleQuery): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["blocks", "author"],
      }
    );

    if (!article) {
      throw new HttpException("Article not found", HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findOne(
      { id: userId },
      { relations: ["favorites"] }
    );

    const follows = await this.followsRepository.findOne({
      followerId: userId,
      followingId: article.author.id,
    });

    const articleData = this.articleService.buildArticleRO(
      article,
      user,
      !!follows
    );
    return { article: articleData };
  }
}
