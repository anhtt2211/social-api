import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { QueryHandlers } from ".";
import { RedisModule } from "../../../redis/redis.module";
import { UserService } from "../services/user.service";

@Module({
  imports: [CqrsModule, RedisModule],
  providers: [UserService, ...QueryHandlers],
  controllers: [],
  exports: [UserService],
})
export class QueryModule {}
