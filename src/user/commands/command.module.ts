import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandHandlers } from ".";
import { WRITE_CONNECTION } from "../../config";
import { RabbitMqModule } from "../../rabbitmq/rabbitmq.module";
import { UserController } from "../user.controller";
import { UserEntity } from "../core";
import { UserService } from "../services/user.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], WRITE_CONNECTION),
    CqrsModule,
    RabbitMqModule,
  ],
  providers: [UserService, ...CommandHandlers],
  controllers: [UserController],
  exports: [],
})
export class CommandModule {}
