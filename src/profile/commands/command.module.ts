import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommandHandlers } from ".";
import { WriteConnection } from "../../config";
import { RabbitMqModule } from "../../rabbitmq/rabbitMQ.module";
import { UserEntity } from "../../user/user.entity";
import { UserModule } from "../../user/user.module";
import { FollowsEntity } from "../follows.entity";
import { ProfileController } from "../profile.controller";
import { ProfileService } from "../profile.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowsEntity], WriteConnection),
    UserModule,
    CqrsModule,
    RabbitMqModule,
  ],
  providers: [ProfileService, ...CommandHandlers],
  controllers: [ProfileController],
  exports: [],
})
export class CommandModule {}
