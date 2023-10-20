import { Injectable } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, getRepository } from "typeorm";

import { READ_CONNECTION } from "../../../configs";
import { FollowsEntity } from "../../../profile/core";
import { UserEntity } from "../../../user/core";
import { ArticleEntity, ArticlesRO } from "../../core";
import { ArticleFilters } from "../../core/dto";
import { FindAllArticleQuery } from "../queries";
import { ArticleService } from "../services";

@Injectable()
export class FindAllArticleUseCase {
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,

    private readonly articleService: ArticleService,
    private readonly queryBus: QueryBus
  ) {}

  async execute(userId: number, query: ArticleFilters): Promise<any> {
    // const { articles, articlesCount } = await this.queryBus.execute(
    //   new FindAllArticleQuery(query)
    // );
    // let user = null;
    // let follows = [];
    // if (userId) {
    //   const authorIds = articles
    //     .map((art: ArticleEntity) => art.author.id)
    //     .filter((id: number, index: number, ids) => ids.indexOf(id) === index);
    //   user = await this.userRepository.findOne(userId, {
    //     relations: ["favorites"],
    //   });
    //   const followsBuilder = getRepository(FollowsEntity, READ_CONNECTION)
    //     .createQueryBuilder("follows")
    //     .where("follows.followerId = :followerId", { followerId: userId });
    //   if (authorIds.length > 0) {
    //     followsBuilder.andWhere("follows.followingId IN (:...followingIds)", {
    //       followingIds: authorIds,
    //     });
    //   }
    //   follows = await followsBuilder.getMany();
    // }
    // const articlesRO = articles?.map((article) => {
    //   const following =
    //     follows?.filter((follow) => follow.followingId === article.author.id)
    //       .length > 0;
    //   return this.articleService.buildArticleRO(article, user, following);
    // });
    // return {
    //   //   articles: articlesRO,
    //   articles,
    //   articlesCount,
    //   user,
    //   follows,
    // };
  }
}
