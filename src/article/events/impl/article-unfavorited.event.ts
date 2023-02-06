import { UserEntity } from "../../../user/core/entities/user.entity";
import { ArticleEntity } from "../../core/entities/article.entity";

export class ArticleUnFavoritedEvent {
  constructor(
    public readonly user: UserEntity,
    public readonly article: ArticleEntity
  ) {}
}
