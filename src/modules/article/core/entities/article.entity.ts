import {
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BlockEntity } from "./block.entity";
import { UserEntity } from "@user/core/entities/user.entity";
import { IArticle } from "../interfaces/article.interface";
import { CommentEntity } from "./comment.entity";

@Entity("article")
export class ArticleEntity {
  constructor(props: IArticle) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Index("article_slug")
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ default: "" })
  description: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updated = new Date();
  }

  @Column("simple-array")
  tagList: string[];

  @ManyToOne((type) => UserEntity, (user) => user.articles)
  author: UserEntity;

  @OneToMany((type) => CommentEntity, (comment) => comment.article, {
    eager: true,
  })
  @JoinColumn()
  comments: CommentEntity[];

  @Column({ default: 0 })
  favoriteCount: number;

  @OneToMany(() => BlockEntity, (block) => block.article, { cascade: true })
  blocks: BlockEntity[];

  @Column("tsvector", { select: false, nullable: true })
  document_with_weights?: any;
}