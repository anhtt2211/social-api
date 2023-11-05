import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CommandHandlers } from ".";
import { RabbitMqModule } from "../../../rabbitmq/rabbitmq.module";
import { UserService } from "../services";

@Module({
  imports: [CqrsModule, RabbitMqModule],
  providers: [UserService, ...CommandHandlers],
  controllers: [],
  exports: [],
})
export class CommandModule {}
