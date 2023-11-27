import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IFile } from "../interfaces";

@Entity("file")
export class FileEntity {
  constructor(props: IFile) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column()
  mimeType: string;

  @Column()
  key: string;

  @Column()
  url: string;

  @Column()
  createdAt: Date;
}
