import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { QueryHandlers } from ".";
import { READ_CONNECTION } from "../../../config";
import { UserEntity } from "../../core";
import { UserService } from "../services/user.service";
import { RedisModule } from "../../../redis/redis.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], READ_CONNECTION),
    CqrsModule,
    RedisModule,
  ],
  providers: [UserService, ...QueryHandlers],
  controllers: [],
  exports: [UserService],
})
export class QueryModule {}
