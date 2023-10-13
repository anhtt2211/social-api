import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { QueryHandlers } from ".";
import { READ_CONNECTION } from "../../../config";
import { UserEntity } from "../../../user/core/entities/user.entity";
import { UserModule } from "../../../user/user.module";
import { FollowsEntity } from "../../core/entities/follows.entity";
import { ProfileService } from "../services/profile.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowsEntity], READ_CONNECTION),
    UserModule,
    CqrsModule,
  ],
  providers: [ProfileService, ...QueryHandlers],
  controllers: [],
  exports: [],
})
export class QueryModule {}
