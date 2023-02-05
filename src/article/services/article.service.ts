import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../user/core/entities/user.entity";
import {
  ArticleData,
  IComment,
  ArticleEntity,
  BlockEntity,
  Comment as CommentEntity,
} from "../core";
const slug = require("slug");

@Injectable()
export class ArticleService {
  constructor() {}

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  buildArticleRO(
    article: ArticleEntity,
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

  buildCommentRO({ author, ...Comment }: CommentEntity): IComment {
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
