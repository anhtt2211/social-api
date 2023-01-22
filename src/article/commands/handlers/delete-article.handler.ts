import { HttpException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, In, Repository } from "typeorm";
import { BlockEntity } from "../../../block/block.entity";
import { WriteConnection } from "../../../config";
import { ArticleWrite_DBEntity } from "../../article.writedb.entity";
import { DeleteArticleCommand } from "../impl";

@CommandHandler(DeleteArticleCommand)
export class DeleteArticleCommandHandler
  implements ICommandHandler<DeleteArticleCommand>
{
  constructor(
    @InjectRepository(ArticleWrite_DBEntity, WriteConnection)
    private readonly articleRepository: Repository<ArticleWrite_DBEntity>,
    @InjectRepository(BlockEntity, WriteConnection)
    private readonly blockRepository: Repository<BlockEntity>
  ) {}

  async execute({ userId, slug }: DeleteArticleCommand): Promise<DeleteResult> {
    const article = await this.articleRepository.findOne(
      { slug },
      {
        relations: ["author", "blocks"],
      }
    );

    if (article.author.id !== userId) {
      throw new HttpException(
        { message: "Cannot delete this article because you is not author" },
        400
      );
    }

    const blockIds = article.blocks.map((block) => block.id);
    await this.blockRepository.delete({
      id: In(blockIds),
    });
    return await this.articleRepository.delete({ slug: slug });
  }
}
