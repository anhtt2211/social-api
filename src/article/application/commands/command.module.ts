import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { UserModule } from "../../../user/user.module";
import { ArticleService } from "../services";
import { CommandHandlers } from "./index";

@Module({
  imports: [UserModule, CqrsModule],
  providers: [ArticleService, ...CommandHandlers],
  controllers: [],
})
export class CommandModule {}
