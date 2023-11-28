import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { QueryHandlers } from ".";
import { UserService } from "../services";

@Module({
  imports: [CqrsModule],
  providers: [UserService, ...QueryHandlers],
  controllers: [],
  exports: [UserService],
})
export class QueryModule {}
