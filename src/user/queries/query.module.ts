import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueryHandlers } from ".";
import { ReadConnection } from "../../config";
import { UserController } from "../user.controller";
import { UserEntity } from "../user.entity";
import { UserService } from "../user.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity], ReadConnection), CqrsModule],
  providers: [UserService, ...QueryHandlers],
  controllers: [UserController],
  exports: [UserService],
})
export class QueryModule {}
