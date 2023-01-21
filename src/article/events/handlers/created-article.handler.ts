import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";
import { CreatedArticleEvent } from "../impl";

@EventsHandler(CreatedArticleEvent)
export class CreatedArticleEventHandler
  implements IEventHandler<CreatedArticleEvent>
{
  constructor() {}
  async handle({ article }: CreatedArticleEvent) {
    // save article created into Read DB
    console.log({ article });
  }
}
