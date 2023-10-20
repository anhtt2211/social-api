import { Controller } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { EventPattern, Payload, Transport } from "@nestjs/microservices";

import {
  ProfileFollowedEvent,
  ProfileUnFollowedEvent,
} from "../application/events";
import {
  IPayloadProfileFollowed,
  IPayloadProfileUnFollowed,
  MessageCmd,
} from "../core";

@Controller()
export class ProfileRmq {
  constructor(private readonly eventBus: EventBus) {}

  @EventPattern({ cmd: MessageCmd.PROFILE_FOLLOWED }, Transport.RMQ)
  async handleProfileFollowed(@Payload() payload: IPayloadProfileFollowed) {
    return this.eventBus.publish(new ProfileFollowedEvent(payload.follow));
  }

  @EventPattern({ cmd: MessageCmd.PROFILE_UNFOLLOWED }, Transport.RMQ)
  async handleProfileUnFollowed(@Payload() payload: IPayloadProfileUnFollowed) {
    return this.eventBus.publish(new ProfileUnFollowedEvent(payload.follow));
  }
}
