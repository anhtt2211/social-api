import { HttpException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleEntity } from "../../article.entity";
import { ArticleRO } from "../../article.interface";
import { ArticleService } from "../../article.service";
import { Comment } from "../../comment.entity";
import { DeleteCommentCommand } from "../impl";

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentCommandHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    private readonly articleService: ArticleService
  ) {}

  async execute({
    userId,
    slug,
    commentId,
  }: DeleteCommentCommand): Promise<ArticleRO> {
    let article = await this.articleRepository.findOne({ slug });

    const comment = await this.commentRepository.findOne(commentId, {
      relations: ["author"],
    });

    if (comment.author.id !== userId) {
      throw new HttpException({ message: "You is not author of comment" }, 400);
    }

    const deleteIndex = article.comments.findIndex(
      (_comment) => _comment.id === comment.id
    );

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentRepository.delete(deleteComments[0].id);
      article = await this.articleRepository.save(article);

      return { article: this.articleService.buildArticleRO(article) };
    } else {
      return { article: this.articleService.buildArticleRO(article) };
    }
  }
}
