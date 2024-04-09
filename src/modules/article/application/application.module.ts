import { Module } from "@nestjs/common";

import { CommandModule } from "./commands/command.module";
import { QueryModule } from "./queries/query.module";
import { ArticleService } from "./services";

@Module({
  imports: [CommandModule, QueryModule],
  providers: [ArticleService],
})
export class ApplicationModule {}
