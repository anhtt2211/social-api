import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { CommandHandlers } from ".";
import { RabbitMqModule } from "../../../rabbitmq/rabbitmq.module";
import { UserModule } from "../../../user/user.module";
import { ProfileService } from "../services";

@Module({
  imports: [UserModule, CqrsModule, RabbitMqModule],
  providers: [ProfileService, ...CommandHandlers],
  controllers: [],
  exports: [],
})
export class CommandModule {}
