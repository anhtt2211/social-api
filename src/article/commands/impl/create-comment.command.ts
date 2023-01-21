import { CreateCommentDto } from "../../dto";

export class CreateCommentCommand {
  constructor(
    public readonly userId: number,
    public readonly slug: string,
    public readonly commentData: CreateCommentDto
  ) {}
}
