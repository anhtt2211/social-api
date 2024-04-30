import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CommandHandlers } from ".";
import { UserService } from "../services";

@Module({
  imports: [CqrsModule],
  providers: [UserService, ...CommandHandlers],
  controllers: [],
  exports: [],
})
export class CommandModule {}
