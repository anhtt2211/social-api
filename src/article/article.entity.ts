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
import { BlockEntity } from "../block/block.entity";
import { UserEntity } from "../user/user.entity";
import { Comment } from "./comment.entity";

interface IArticle {
  id?: number;
  slug?: string;
  title?: string;
  description?: string;
  created?: Date;
  updated?: Date;
  tagList?: string[];
  author?: UserEntity;
  comments?: Comment[];
  favoriteCount?: number;
  blocks?: BlockEntity[];
}

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

  @OneToMany((type) => Comment, (comment) => comment.article, {
    eager: true,
  })
  @JoinColumn()
  comments: Comment[];

  @Column({ default: 0 })
  favoriteCount: number;

  @OneToMany(() => BlockEntity, (block) => block.article, { cascade: true })
  blocks: BlockEntity[];

  @Column("tsvector", { select: false, nullable: true })
  document_with_weights?: any;
}
