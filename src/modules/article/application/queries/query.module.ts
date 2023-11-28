import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { QueryHandlers } from ".";
import { UserModule } from "@user/user.module";
import { ArticleService } from "../services";

@Module({
  imports: [UserModule, CqrsModule],
  providers: [ArticleService, ...QueryHandlers],
  controllers: [],
})
export class QueryModule {}
