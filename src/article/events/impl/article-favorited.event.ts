import { UserEntity } from "../../../user/user.entity";
import { ArticleEntity } from "../../article.entity";

export class ArticleFavoritedEvent {
  constructor(
    public readonly user: UserEntity,
    public readonly article: ArticleEntity
  ) {}
}
