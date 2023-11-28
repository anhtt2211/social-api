import { IUser } from "@user/core";
import { FileEntity } from "../entities";

export interface IFile {
  id?: number;
  name?: string;
  size?: number;
  mimeType?: string;
  key?: string;
  url?: string;
  createdAt?: Date;
  author?: IUser;
}

interface IPayloadFileRmq {
  file: FileEntity;
}

export interface IPayloadFileCreated extends IPayloadFileRmq {}
