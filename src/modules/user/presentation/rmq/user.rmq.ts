import { Controller } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { EventPattern, Payload, Transport } from "@nestjs/microservices";

import { UserCreatedEvent, UserUpdatedEvent } from "../../application/events";
import {
  IPayloadUserCreated,
  IPayloadUserUpdated,
  MessageCmd,
} from "../../core";

@Controller()
export class UserRmq {
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern({ cmd: MessageCmd.USER_CREATED }, Transport.RMQ)
  async userCreated(@Payload() payload: IPayloadUserCreated) {
    this.eventBus.publish(new UserCreatedEvent(payload.user));
  }

  @EventPattern({ cmd: MessageCmd.USER_UPDATED }, Transport.RMQ)
  async userUpdated(@Payload() payload: IPayloadUserUpdated) {
    this.eventBus.publish(new UserUpdatedEvent(payload.user));
  }
}
