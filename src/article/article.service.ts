import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, getRepository, Repository } from "typeorm";
import { FollowsEntity } from "../profile/follows.entity";
import { UserEntity } from "../user/user.entity";
import { ArticleEntity } from "./article.entity";
import { Comment } from "./comment.entity";
import { CreateArticleDto } from "./dto";

import {
  ArticleData,
  ArticleRO,
  ArticlesRO,
  CommentsRO,
} from "./article.interface";
import { ArticleFilters } from "./dto/article-query";
import { BlockDto } from "../block/block.dto";
const slug = require("slug");

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}

  async findAll(userId: number, query: ArticleFilters): Promise<ArticlesRO> {
    const qb = getRepository(ArticleEntity)
      .createQueryBuilder("article")
      .leftJoinAndSelect("article.author", "author");

    qb.where("1 = 1");

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

      follows = await getRepository(FollowsEntity)
        .createQueryBuilder("follows")
        .where("follows.followerId = :followerId", { followerId: userId })
        .andWhere("follows.followingId IN (:...followingIds)", {
          followingIds: authorIds,
        })
        .getMany();
    }

    const articlesRO = articles?.map((article) => {
      const following =
        follows?.filter((follow) => follow.followingId === article.author.id)
          .length > 0;
      return this.buildArticleRO(article, user, following);
    });

    return { articles: articlesRO, articlesCount };
  }

  async findFeed(userId: number, query: ArticleFilters): Promise<ArticlesRO> {
    const _follows = await this.followsRepository.find({ followerId: userId });

    const user = await this.userRepository.findOne(userId, {
      relations: ["favorites"],
    });

    if (!(Array.isArray(_follows) && _follows.length > 0)) {
      return { articles: [], articlesCount: 0 };
    }

    const ids = _follows.map((el) => el.followingId);

    const qb = getRepository(ArticleEntity)
      .createQueryBuilder("article")
      .where("article.authorId IN (:...ids)", { ids })
      .leftJoinAndSelect("article.author", "author");

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
      this.buildArticleRO(article, user, !!_follows)
    );

    return { articles: articlesRO, articlesCount };
  }

  async findOne(userId: number, slug: string): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["blocks", "author"],
      }
    );
    const user = await this.userRepository.findOne(
      { id: userId },
      { relations: ["favorites"] }
    );

    const follows = await this.followsRepository.findOne({
      followerId: userId,
      followingId: article.author.id,
    });

    const articleData = this.buildArticleRO(article, user, !!follows);
    return { article: articleData };
  }

  async addComment(slug: string, commentData): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });

    const comment = new Comment();
    comment.body = commentData.body;

    article.comments.push(comment);

    await this.commentRepository.save(comment);
    article = await this.articleRepository.save(article);
    return { article };
  }

  async deleteComment(slug: string, id: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });

    const comment = await this.commentRepository.findOne(id);
    const deleteIndex = article.comments.findIndex(
      (_comment) => _comment.id === comment.id
    );

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentRepository.delete(deleteComments[0].id);
      article = await this.articleRepository.save(article);
      return { article };
    } else {
      return { article };
    }
  }

  async favorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["author"],
      }
    );
    const user = await this.userRepository.findOne(id, {
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

    return { article: this.buildArticleRO(article, user) };
  }

  async unFavorite(id: number, slug: string): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["author"],
      }
    );
    const user = await this.userRepository.findOne(id, {
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

    return { article: this.buildArticleRO(article, user) };
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const article = await this.articleRepository.findOne({ slug });
    return { comments: article.comments };
  }

  async create(
    userId: number,
    articleData: CreateArticleDto
  ): Promise<ArticleEntity> {
    let article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.tagList = articleData.tagList || [];
    article.comments = [];
    article.blocks = articleData.blocks;

    const newArticle = await this.articleRepository.save(article);

    const author = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["articles"],
    });
    author.articles.push(article);

    await this.userRepository.save(author);

    return newArticle;
  }

  async update(slug: string, articleData: any): Promise<ArticleRO> {
    let toUpdate = await this.articleRepository.findOne({ slug: slug });
    let updated = Object.assign(toUpdate, articleData);
    const article = await this.articleRepository.save(updated);
    return { article };
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.articleRepository.delete({ slug: slug });
  }

  slugify(title: string) {
    return (
      slug(title, { lower: true }) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }

  private buildArticleRO(
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
      blocks: article?.blocks?.map((block: BlockDto) => ({
        type: block.type,
        data: block.data,
      })),
      tagList: article.tagList,
      createdAt: article.created,
      updatedAt: article.updated,
      favorited: favorite,
      favoritesCount: article.favoriteCount,
      author: {
        username: article.author.username,
        following: following || false,
        bio: article.author.bio,
        image: article.author.image,
      },
    };

    return articleData;
  }

  async seed(userId: number, articleList: CreateArticleDto[]) {
    const articles: ArticleEntity[] = articleList.map((article) => {
      let articleEntity = new ArticleEntity();
      articleEntity.title = article.title;
      articleEntity.description = article.description;
      articleEntity.slug = this.slugify(article.title);
      articleEntity.tagList = article.tagList || [];
      articleEntity.comments = [];
      articleEntity.blocks = article.blocks;

      return articleEntity;
    });

    await this.articleRepository.save(articles);

    const author = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["articles"],
    });
    author.articles = [...author.articles, ...articles];

    await this.userRepository.save(author);

    return true;
  }
}
