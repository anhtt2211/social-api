import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { EventHandlers } from ".";

@Module({
  imports: [CqrsModule],
  providers: [...EventHandlers],
  controllers: [],
})
export class EventModule {}
