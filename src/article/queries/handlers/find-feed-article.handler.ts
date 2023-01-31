import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { READ_CONNECTION } from "../../../config";
import { FollowsEntity } from "../../../profile/follows.entity";
import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";
import { ArticlesRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { FindFeedArticleQuery } from "../impl";

@QueryHandler(FindFeedArticleQuery)
export class FindFeedArticleQueryHandler
  implements IQueryHandler<FindFeedArticleQuery>
{
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity, READ_CONNECTION)
    private readonly followsRepository: Repository<FollowsEntity>,

    private readonly articleService: ArticleService
  ) {}

  async execute({ userId, query }: FindFeedArticleQuery): Promise<ArticlesRO> {
    const _follows = await this.followsRepository.find({ followerId: userId });

    const user = await this.userRepository.findOne(userId, {
      relations: ["favorites"],
    });

    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return { articles: [], articlesCount: 0 };
    }

    const ids = _follows.map((el) => el.followingId);

    const qb = getRepository(ArticleEntity, READ_CONNECTION)
      .createQueryBuilder("article")
      .where("article.authorId IN (:...ids)", { ids })
      .leftJoinAndSelect("article.author", "author");

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

    const articlesRO = articles?.map((article) =>
      this.articleService.buildArticleRO(article, user, !!_follows)
    );

    return { articles: articlesRO, articlesCount };
  }
}
