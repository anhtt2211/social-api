import {
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IComment } from "../interfaces/article.interface";
import { ArticleEntity } from "./article.entity";

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

  @Column({ name: "authorId" })
  authorId: number;
}
