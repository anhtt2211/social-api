import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ArticleEntity, ArticleRO } from "../../core";
import { ArticleService } from "../../application/services";
import { UserEntity } from "../../../user/core";
import { FollowsEntity } from "../../../profile/core";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly articleService: ArticleService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ArticleRO> {
    return next.handle().pipe(
      map(
        ({
          article,
          user = undefined,
          following = undefined,
        }: {
          article: ArticleEntity;
          user?: UserEntity;
          following?: boolean;
        }) => {
          console.log("=================After=================");
          Logger.warn({
            article,
            user,
            following,
          });
          return {
            article: this.articleService.buildArticleRO(
              article,
              user,
              following
            ),
          };
        }
      )
    );
  }
}
