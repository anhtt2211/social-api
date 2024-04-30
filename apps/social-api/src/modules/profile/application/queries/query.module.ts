import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { QueryHandlers } from ".";
import { UserModule } from "@user/user.module";
import { ProfileService } from "../services";

@Module({
  imports: [UserModule, CqrsModule],
  providers: [ProfileService, ...QueryHandlers],
  controllers: [],
  exports: [],
})
export class QueryModule {}
