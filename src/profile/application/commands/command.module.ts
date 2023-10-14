import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommandHandlers } from ".";
import { WRITE_CONNECTION } from "../../../configs";
import { RabbitMqModule } from "../../../rabbitmq/rabbitmq.module";
import { UserEntity } from "../../../user/core/entities/user.entity";
import { UserModule } from "../../../user/user.module";
import { FollowsEntity } from "../../core/entities/follows.entity";
import { ProfileService } from "../services/profile.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowsEntity], WRITE_CONNECTION),
    UserModule,
    CqrsModule,
    RabbitMqModule,
  ],
  providers: [ProfileService, ...CommandHandlers],
  controllers: [],
  exports: [],
})
export class CommandModule {}
