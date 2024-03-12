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
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "@shared/middleware/user.decorator";
import {
  CreateArticleCommand,
  CreateCommentCommand,
  DeleteArticleCommand,
  DeleteCommentCommand,
  FavoriteArticleCommand,
  SeedArticleCommand,
  UnFavoriteArticleCommand,
  UpdateArticleCommand,
} from "../../application/commands";
import {
  FindAllArticleQuery,
  FindCommentQuery,
  FindFeedArticleQuery,
  FindOneArticleQuery,
  GetHotArticleMonthlyQuery,
  GetHotArticleQuery,
} from "../../application/queries";
import {
  ArticleFilters,
  CreateArticleDto,
  CreateCommentDto,
} from "../../core/dto";
import {
  ArticleData,
  ArticleRO,
  ArticlesRO,
  CommentsRO,
} from "../../core/interfaces";

@ApiBearerAuth()
@ApiTags("articles")
@Controller("articles")
export class ArticleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiOperation({ summary: "Get all articles" })
  @ApiResponse({ status: 200, description: "Return all articles." })
  @Get()
  async findAll(
    @User("id") userId: number,
    @Query() query: ArticleFilters
  ): Promise<ArticlesRO> {
    return this.queryBus.execute(new FindAllArticleQuery(userId, query));
  }

  @ApiOperation({ summary: "Get article feed" })
  @ApiResponse({ status: 200, description: "Return article feed." })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Get("feed")
  async getFeed(
    @User("id") userId: number,
    @Query() query: ArticleFilters
  ): Promise<ArticlesRO> {
    return this.queryBus.execute(new FindFeedArticleQuery(userId, query));
  }

  @ApiOperation({ summary: "Get hot articles" })
  @ApiResponse({ status: 200, description: "Return hot articles." })
  @Get("hot")
  async getHotArticles(): Promise<ArticleData[]> {
    return this.queryBus.execute(new GetHotArticleQuery());
  }

  @ApiOperation({ summary: "Get hot articles monthly" })
  @ApiResponse({ status: 200, description: "Return hot articles monthly." })
  @Get("hot-monthly")
  async getHotArticlesMonthly(): Promise<ArticleData[]> {
    return this.queryBus.execute(new GetHotArticleMonthlyQuery());
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
    return this.queryBus.execute(new FindOneArticleQuery(userId, slug));
  }

  @ApiOperation({ summary: "Get comments of article" })
  @ApiParam({
    name: "slug",
    required: true,
    schema: { oneOf: [{ type: "string" }] },
  })
  @Get(":slug/comments")
  async findComments(@Param("slug") slug): Promise<CommentsRO> {
    return this.queryBus.execute(new FindCommentQuery(slug));
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
  ): Promise<ArticleRO> {
    return this.commandBus.execute(
      new CreateArticleCommand(userId, articleData)
    );
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
  ): Promise<ArticleRO> {
    return this.commandBus.execute(
      new UpdateArticleCommand(params.slug, articleData)
    );
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
  async delete(@User("id") userId: number, @Param() params) {
    return this.commandBus.execute(
      new DeleteArticleCommand(userId, params.slug)
    );
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
    @User("id") userId,
    @Param("slug") slug,
    @Body("comment") commentData: CreateCommentDto
  ) {
    return this.commandBus.execute(
      new CreateCommentCommand(userId, slug, commentData)
    );
  }

  @ApiOperation({ summary: "Delete comment" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully deleted.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug/comments/:id")
  async deleteComment(@User("id") userId, @Param() params): Promise<ArticleRO> {
    const { slug, id: commentId } = params;

    return this.commandBus.execute(
      new DeleteCommentCommand(userId, slug, commentId)
    );
  }

  @ApiOperation({ summary: "Favorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully favorited.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Post(":slug/favorite")
  async favorite(@User("id") userId: number, @Param("slug") slug) {
    return this.commandBus.execute(new FavoriteArticleCommand(userId, slug));
  }

  @ApiOperation({ summary: "Unfavorite article" })
  @ApiResponse({
    status: 201,
    description: "The article has been successfully unfavorited.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Delete(":slug/favorite")
  async unFavorite(@User("id") userId: number, @Param("slug") slug) {
    return this.commandBus.execute(new UnFavoriteArticleCommand(userId, slug));
  }

  @Post("/seed")
  async seedData(
    @User("id") userId: number,
    @Body("articles") articleList: CreateArticleDto[]
  ) {
    return this.commandBus.execute(new SeedArticleCommand(userId, articleList));
  }
}
