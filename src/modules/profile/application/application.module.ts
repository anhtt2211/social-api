import { Module } from "@nestjs/common";

import { CommandModule } from "./commands/command.module";
import { QueryModule } from "./queries/query.module";
import { ProfileService } from "./services";

@Module({
  imports: [CommandModule, QueryModule],
  providers: [ProfileService],
})
export class ApplicationModule {}
