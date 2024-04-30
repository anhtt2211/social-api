import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { UserModule } from "@user/user.module";
import { QueryHandlers } from ".";
import { ArticleJobsService } from "../jobs";
import { ArticleService } from "../services";

@Module({
  imports: [UserModule, CqrsModule],
  providers: [ArticleService, ArticleJobsService, ...QueryHandlers],
  controllers: [],
})
export class QueryModule {}
