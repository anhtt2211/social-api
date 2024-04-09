import { Module } from "@nestjs/common";

import { CommandModule } from "./commands/command.module";
import { QueryModule } from "./queries/query.module";
import { CognitoService, UserService } from "./services";

@Module({
  imports: [CommandModule, QueryModule],
  providers: [CognitoService, UserService],
})
export class ApplicationModule {}
