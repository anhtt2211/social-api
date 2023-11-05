import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { RabbitMqModule } from "../../../rabbitmq/rabbitmq.module";
import { UserModule } from "../../../user/user.module";
import { ArticleService } from "../services";
import { CommandHandlers } from "./index";

@Module({
  imports: [UserModule, CqrsModule, RabbitMqModule],
  providers: [ArticleService, ...CommandHandlers],
  controllers: [],
})
export class CommandModule {}
