import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { ConsumerService } from "../rabbitmq/consumer.service";
import { QUEUE_NAME } from "../rabbitmq/rabbitmq.constants";
import { UserCreatedEvent, UserUpdatedEvent } from "./events";
import { UserEntity } from "./user.entity";
import { MessageType } from "./user.enum";

interface IProjection {
  handle(): Promise<void>;
}

interface IMessage {
  type: string;
  payload: {
    user?: UserEntity;
  };
}

@Injectable()
export class UserProjection implements IProjection {
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
      case MessageType.USER_CREATED:
        this.eventBus.publish(new UserCreatedEvent(payload.user));
        break;
      case MessageType.USER_UPDATED:
        this.eventBus.publish(new UserUpdatedEvent(payload.user));
        break;
      default:
        break;
    }
  }
}
