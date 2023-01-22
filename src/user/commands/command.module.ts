import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandHandlers } from ".";
import { WriteConnection } from "../../config";
import { UserController } from "../user.controller";
import { UserEntity } from "../user.entity";
import { UserService } from "../user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], WriteConnection),
    CqrsModule,
  ],
  providers: [UserService, ...CommandHandlers],
  controllers: [UserController],
  exports: [],
})
export class CommandModule {}
