import { CreateArticleDto } from "../../dto";

export class CreateArticleCommand {
  constructor(
    public readonly userId: number,
    public readonly articleData: CreateArticleDto
  ) {}
}
