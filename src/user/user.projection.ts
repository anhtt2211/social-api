import { Injectable } from "@nestjs/common";
import { EventBus } from "@nestjs/cqrs";
import { ConsumerService } from "../rabbitmq/consumer.service";
import { USER_QUEUE } from "../rabbitmq/rabbitmq.constants";
import { IMessage, IProjection } from "./core";
import { MessageType } from "./core/enums/user.enum";
import { UserCreatedEvent, UserUpdatedEvent } from "./events";

@Injectable()
export class UserProjection implements IProjection {
  constructor(
    private readonly consumer: ConsumerService,
    private readonly eventBus: EventBus
  ) {}

  async handle() {
    await this.consumer.consume(USER_QUEUE, (msg: IMessage) => {
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
