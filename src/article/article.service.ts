import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../user/user.entity";
import { ArticleEntity } from "./article.entity";
import { Comment } from "./comment.entity";
import { CreateArticleDto } from "./dto";
import { BlockEntity } from "../block/block.entity";
import { ArticleData, Comment as IComment } from "./article.interface";
import { WriteConnection } from "../config";
import { ArticleWrite_DBEntity } from "./article.writedb.entity";
const slug = require("slug");

@Injectable()
export class ArticleService {
  constructor() // private readonly articleRepository: Repository<ArticleEntity>, // @InjectRepository(ArticleEntity, WriteConnection)
  // @InjectRepository(UserEntity, WriteConnection)
  // private readonly userRepository: Repository<UserEntity>
  {}

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  buildArticleRO(
    article: ArticleEntity | ArticleWrite_DBEntity,
    user?: UserEntity,
    following?: boolean
  ): ArticleData {
    let favorite =
      user?.favorites?.filter((art) => art.slug === article.slug).length > 0;

    const articleData: ArticleData = {
      slug: article.slug,
      title: article.title,
      description: article.description,
      blocks: article?.blocks?.map((block: BlockEntity) => ({
        id: block.id,
        type: block.type,
        data: block.data,
      })),
      tagList: article.tagList,
      createdAt: article.created,
      updatedAt: article.updated,
      favorited: favorite,
      favoritesCount: article.favoriteCount,
      author: {
        username: article?.author?.username,
        following: following || false,
        bio: article?.author?.bio,
        image: article?.author?.image,
      },
    };

    return articleData;
  }

  buildCommentRO({ author, ...Comment }: Comment): IComment {
    const comment: IComment = {
      ...Comment,
      author: {
        username: author.username,
        bio: author.bio,
        image: author.image,
      },
    };

    return comment;
  }

  // async seed(userId: number, articleList: CreateArticleDto[]) {
  //   const articles: ArticleEntity[] = articleList.map((article) => {
  //     let articleEntity = new ArticleEntity();
  //     articleEntity.title = article.title;
  //     articleEntity.description = article.description;
  //     articleEntity.slug = this.slugify(article.title);
  //     articleEntity.tagList = article.tagList || [];
  //     articleEntity.comments = [];
  //     articleEntity.blocks = article.blocks;

  //     return articleEntity;
  //   });

  //   await this.articleRepository.save(articles);

  //   const author = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ["articles"],
  //   });
  //   author.articles = [...author.articles, ...articles];

  //   await this.userRepository.save(author);

  //   return true;
  // }
}
