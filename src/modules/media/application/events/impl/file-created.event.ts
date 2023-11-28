import { FileEntity } from "../../../core";

export class FileCreatedEvent {
  constructor(public readonly file: FileEntity) {}
}
