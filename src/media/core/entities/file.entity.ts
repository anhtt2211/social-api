import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IFile } from "../interfaces";
import { UserEntity } from "../../../user/core";

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

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.photos)
  author: UserEntity;
}
