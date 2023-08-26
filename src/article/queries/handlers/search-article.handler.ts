import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { READ_CONNECTION } from "../../../config";
import { UserEntity } from "../../../user/core/entities/user.entity";
import { ArticleEntity } from "../../core/entities/article.entity";
import { ArticlesRO } from "../../core/interfaces/article.interface";
import { ArticleService } from "../../services/article.service";
import { SearchArticleQuery } from "../impl";
import { SearchService } from "../../../elastic-search/elastic-search.service";

@QueryHandler(SearchArticleQuery)
export class SearchArticleQueryHandler
  implements IQueryHandler<SearchArticleQuery>
{
  constructor(
    @InjectRepository(UserEntity, READ_CONNECTION)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ArticleEntity, READ_CONNECTION)
    private readonly articleRepository: Repository<ArticleEntity>,

    private readonly articleService: ArticleService,

    private readonly elasticSearch: SearchService
  ) {}

  async execute({ query }: SearchArticleQuery): Promise<any> {
    return this.elasticSearch.searchArticles(query.search);
  }
}
