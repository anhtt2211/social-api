import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { User } from "../user/user.decorator";
import { ArticleRO, ArticlesRO, CommentsRO } from "./article.interface";
import { ArticleService } from "./article.service";
import { CreateArticleDto, CreateCommentDto } from "./dto";

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ArticleFilters } from "./dto/article-query";

@ApiBearerAuth()
@ApiTags("articles")
@Controller("articles")
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: "Get all articles" })
  @ApiResponse({ status: 200, description: "Return all articles." })
  @Get()
  async findAll(
    @User("id") userId: number,
    @Query() query: ArticleFilters
  ): Promise<ArticlesRO> {
    return await this.articleService.findAll(userId, query);
  }

  @ApiOperation({ summary: "Get article feed" })
  @ApiResponse({ status: 200, description: "Return article feed." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Get("feed")
  async getFeed(
    @User("id") userId: number,
    @Query() query: ArticleFilters
  ): Promise<ArticlesRO> {
    return await this.articleService.findFeed(userId, query);
  }

  @ApiOperation({ summary: "Get article by slug" })
  @ApiParam({
    name: "slug",
    required: true,
    schema: { oneOf: [{ type: "string" }] },
  })
  @Get(":slug")
  async findOne(
    @User("id") userId: number,
    @Param("slug") slug
  ): Promise<ArticleRO> {
    return await this.articleService.findOne(userId, slug);
  }

  @ApiOperation({ summary: "Get comments of article" })
  @ApiParam({
    name: "slug",
    required: true,
    schema: { oneOf: [{ type: "string" }] },
  })
  @Get(":slug/comments")
  async findComments(@Param("slug") slug): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @ApiOperation({ summary: "Create article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully created.",
  })
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Post()
  async create(
    @User("id") userId: number,
    @Body("article") articleData: CreateArticleDto
  ) {
    return this.articleService.create(userId, articleData);
  }

  @ApiOperation({ summary: "Update article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully updated.",
  })
  @ApiBody({ type: CreateArticleDto })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Put(":slug")
  async update(
    @Param() params,
    @Body("article") articleData: CreateArticleDto
  ) {
    return this.articleService.update(params.slug, articleData);
  }

  @ApiOperation({ summary: "Delete article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully deleted.",
  })
  @ApiParam({
    name: "slug",
    required: true,
    schema: { oneOf: [{ type: "string" }] },
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug")
  async delete(@Param() params) {
    return this.articleService.delete(params.slug);
  }

  @ApiOperation({ summary: "Create comment" })
  @ApiResponse({
    status: 201,
    description: "The comment has been successfully created.",
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Post(":slug/comments")
  async createComment(
    @Param("slug") slug,
    @Body("comment") commentData: CreateCommentDto
  ) {
    return await this.articleService.addComment(slug, commentData);
  }

  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug/comments/:id")
  async deleteComment(@Param() params) {
    const { slug, id } = params;
    return await this.articleService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: "Favorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully favorited.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Post(":slug/favorite")
  async favorite(@User("id") userId: number, @Param("slug") slug) {
    return await this.articleService.favorite(userId, slug);
  }

  @ApiOperation({ summary: "Unfavorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully unfavorited.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug/favorite")
  async unFavorite(@User("id") userId: number, @Param("slug") slug) {
    return await this.articleService.unFavorite(userId, slug);
  }

  @Post("/seed")
  async seedData(
    @User("id") userId: number,
    @Body("articles") articleList: CreateArticleDto[]
  ) {
    return this.articleService.seed(userId, articleList);
  }
}
