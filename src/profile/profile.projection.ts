import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { ConsumerService } from "../rabbitmq/consumer.service";
import { QUEUE_NAME } from "../rabbitmq/rabbitmq.constants";
import { ProfileFollowedEvent, ProfileUnFollowedEvent } from "./events";
import { FollowsEntity } from "./follows.entity";
import { MessageType } from "./profile.enum";
import { IFollow } from "./profile.interface";

interface IProjection {
  handle(): Promise<void>;
}

interface IMessage {
  type: string;
  payload: {
    follow: FollowsEntity | IFollow;
  };
}

@Injectable()
export class ProfileProjection implements IProjection {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly eventBus: EventBus
  ) {}

  async handle() {
    await this.consumer.consume(QUEUE_NAME, (msg: IMessage) => {
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
