import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandHandlers } from ".";
import { WRITE_CONNECTION } from "../../config";
import { RabbitMqModule } from "../../rabbitmq/rabbitMQ.module";
import { UserEntity } from "../../user/core/entities/user.entity";
import { UserModule } from "../../user/user.module";
import { FollowsEntity } from "../core/entities/follows.entity";
import { ProfileController } from "../profile.controller";
import { ProfileService } from "../services/profile.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowsEntity], WRITE_CONNECTION),
    UserModule,
    CqrsModule,
    RabbitMqModule,
  ],
  providers: [ProfileService, ...CommandHandlers],
  controllers: [ProfileController],
  exports: [],
})
export class CommandModule {}
