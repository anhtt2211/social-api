import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueryHandlers } from ".";
import { ReadConnection } from "../../config";
import { UserEntity } from "../../user/user.entity";
import { UserModule } from "../../user/user.module";
import { FollowsEntity } from "../follows.entity";
import { ProfileController } from "../profile.controller";
import { ProfileService } from "../profile.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowsEntity], ReadConnection),
    UserModule,
    CqrsModule,
  ],
  providers: [ProfileService, ...QueryHandlers],
  controllers: [ProfileController],
  exports: [],
})
export class QueryModule {}
