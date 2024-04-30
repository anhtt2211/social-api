import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeUpdate,
} from "typeorm";
import { UserEntity } from "@user/core/entities/user.entity";
import { ArticleEntity } from "./article.entity";
import { IComment } from "../interfaces/article.interface";

@Entity("comment")
export class CommentEntity {
  constructor(props: IComment) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  body: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @ManyToOne((type) => ArticleEntity, (article) => article.comments)
  article: ArticleEntity;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  author: UserEntity;
}
