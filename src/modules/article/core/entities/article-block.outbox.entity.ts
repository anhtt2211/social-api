import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IArticleBlockOutbox } from "../interfaces";

interface IBlock {
  id: number;
  text: string;
}
interface IPayload {
  id: number;
  title: string;
  slug: string;
  description: string;
  commentCount: number;
  favoriteCount: number;
  readingTime: number;
  tagList: string[];
  created: Date;
  blocks: IBlock[];
  author: string;
}

@Entity("article_block_outbox_entity")
export class ArticleBlockOutboxEntity {
  constructor(props: IArticleBlockOutbox) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  aggregatetype: string;

  @Column({ type: "varchar", length: 255 })
  aggregateid: string;

  @Column({ type: "varchar", length: 255 })
  type: string;

  @Column({ type: "jsonb" })
  payload: IPayload;
}
