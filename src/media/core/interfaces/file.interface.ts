import { IUser } from "../../../user/core";

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
