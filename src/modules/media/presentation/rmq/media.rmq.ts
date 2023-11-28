import { Controller } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { EventPattern, Payload, Transport } from "@nestjs/microservices";

import { FileCreatedEvent } from "../../application/events/impl";
import { IPayloadFileCreated } from "../../core";
import { MessageCmd } from "../../core/enums";

@Controller()
export class MediaRmq {
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern({ cmd: MessageCmd.FILE_CREATED }, Transport.RMQ)
  async userCreated(@Payload() payload: IPayloadFileCreated) {
    this.eventBus.publish(new FileCreatedEvent(payload.file));
  }
}
