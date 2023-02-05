import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QueryHandlers } from ".";
import { READ_CONNECTION } from "../../config";
import { UserController } from "../user.controller";
import { UserEntity } from "../user.entity";
import { UserService } from "../services/user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], READ_CONNECTION),
    CqrsModule,
  ],
  providers: [UserService, ...QueryHandlers],
  controllers: [UserController],
  exports: [UserService],
})
export class QueryModule {}
