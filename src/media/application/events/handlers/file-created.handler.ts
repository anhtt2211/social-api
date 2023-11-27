import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { IEventHandler } from "@nestjs/cqrs";
import { EventsHandler } from "@nestjs/cqrs/dist/decorators/events-handler.decorator";

import { FileReadPort } from "../../../core/ports";
import { MediaRepositoryToken } from "../../../core/token";
import { FileCreatedEvent } from "../impl";

@EventsHandler(FileCreatedEvent)
export class FileCreatedEventHandler
  implements IEventHandler<FileCreatedEvent>
{
  constructor(
    @Inject(MediaRepositoryToken.Read)
    private readonly fileRepository: FileReadPort
  ) {}
  async handle({ file }: FileCreatedEvent) {
    try {
      await this.fileRepository.save(file);
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
