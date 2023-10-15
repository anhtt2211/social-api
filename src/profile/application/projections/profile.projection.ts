import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";

import { ConsumerService } from "../../../rabbitmq/consumer.service";
import { PROFILE_QUEUE } from "../../../rabbitmq/rabbitmq.constants";
import { IMessage, IProjection } from "../../core";
import { FollowsEntity } from "../../core/entities/follows.entity";
import { MessageType } from "../../core/enums/profile.enum";
import { ProfileFollowedEvent, ProfileUnFollowedEvent } from "../events";

@Injectable()
export class ProfileProjection implements IProjection {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly eventBus: EventBus
  ) {}

  async handle() {
    await this.consumer.consume(PROFILE_QUEUE, (msg: IMessage) => {
      this.handleMessage(msg);
    });
  }

  private async handleMessage({ type, payload }: IMessage) {
    switch (type) {
      case MessageType.PROFILE_FOLLOWED:
        this.eventBus.publish(
          new ProfileFollowedEvent(payload.follow as FollowsEntity)
        );
        break;
      case MessageType.PROFILE_UNFOLLOWED:
        this.eventBus.publish(new ProfileUnFollowedEvent(payload.follow));
        break;
      default:
        break;
    }
  }
}
