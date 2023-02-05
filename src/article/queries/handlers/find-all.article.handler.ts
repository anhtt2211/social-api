import { HttpException, HttpStatus } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { READ_CONNECTION } from "../../../config";
import { FollowsEntity } from "../../../profile/core/entities/follows.entity";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../core/entities/article.entity";
import { ArticlesRO } from "../../core/interfaces/article.interface";
import { ArticleService } from "../../services/article.service";
import { FindAllArticleQuery } from "../impl";

@QueryHandler(FindAllArticleQuery)
export class FindAllArticleQueryHandler
  implements IQueryHandler<FindAllArticleQuery>
{
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,

    private readonly articleService: ArticleService
  ) {}

  async execute({ userId, query }: FindAllArticleQuery): Promise<ArticlesRO> {
    try {
      const qb = this.articleRepository
        .createQueryBuilder("article")
        .leftJoinAndSelect("article.author", "author");
      if ("tag" in query) {
        qb.andWhere("article.tagList LIKE :tag", { tag: `%${query.tag}%` });
      }
      if ("author" in query) {
        const author = await this.userRepository.findOne({
          username: query.author,
        });
        qb.andWhere("article.authorId = :id", { id: author.id });
      }
      if ("favorited" in query) {
        const author = await this.userRepository.findOne(
          {
            username: query.favorited,
          },
          {
            relations: ["favorites"],
          }
        );
        const ids = author.favorites.map((el) => el.id);
        qb.andWhere("article.id IN (:...ids)", { ids });
      }
      if ("search" in query) {
        qb.andWhere("document_with_weights @@ plainto_tsquery(:search)", {
          search: query.search,
        }).orderBy(
          "ts_rank(document_with_weights, plainto_tsquery(:query))",
          "DESC"
        );
      }
      qb.orderBy("article.created", "DESC");
      const articlesCount = await qb.getCount();

      if ("limit" in query) {
        qb.limit(query.limit);
      }
      if ("offset" in query) {
        qb.offset(query.offset);
      }

      const articles = await qb.getMany();

      let user = null;
      let follows = [];
      if (userId) {
        const authorIds = articles
          .map((art) => art.author.id)
          .filter((id, index, ids) => ids.indexOf(id) === index);
        user = await this.userRepository.findOne(userId, {
          relations: ["favorites"],
        });
        const followsBuilder = getRepository(FollowsEntity, READ_CONNECTION)
          .createQueryBuilder("follows")
          .where("follows.followerId = :followerId", { followerId: userId });
        if (authorIds.length > 0) {
          followsBuilder.andWhere("follows.followingId IN (:...followingIds)", {
            followingIds: authorIds,
          });
        }
        follows = await followsBuilder.getMany();
      }

      const articlesRO = articles?.map((article) => {
        const following =
          follows?.filter((follow) => follow.followingId === article.author.id)
            .length > 0;
        return this.articleService.buildArticleRO(article, user, following);
      });

      return { articles: articlesRO, articlesCount };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
