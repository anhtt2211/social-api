import { CreateArticleDto } from "../../../core/dto";

export class CreateArticleCommand {
  constructor(
    public readonly userId: number,
    public readonly articleData: CreateArticleDto
  ) {}
}
