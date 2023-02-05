import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../core/entities/article.entity";

export class ArticleFavoritedEvent {
  constructor(
    public readonly user: UserEntity,
    public readonly article: ArticleEntity
  ) {}
}
