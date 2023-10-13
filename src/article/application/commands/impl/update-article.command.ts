import { CreateArticleDto } from "../../../core/dto";

export class UpdateArticleCommand {
  constructor(
    public readonly slug: string,
    public readonly articleData: CreateArticleDto
  ) {}
}
