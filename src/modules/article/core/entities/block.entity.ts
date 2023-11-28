import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { BlockType } from "../enums/block.enum";

export class Info {
  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  height?: number;
}

export class File {
  @Column(() => Info)
  info?: Info;

  @Column({ nullable: true })
  url?: string;
}

export class Data {
  @Column({ nullable: true })
  alignment?: string;

  @Column({ nullable: true })
  text?: string;

  @Column({ nullable: true })
  caption?: string;

  @Column(() => File)
  file?: File;
}

@Entity("block")
export class BlockEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column(() => Data)
  data: Data;

  @Column({
    type: "enum",
    enum: BlockType,
    default: BlockType.PARAGRAPH,
  })
  type: BlockType;

  @ManyToOne(() => ArticleEntity, (article) => article.blocks)
  article?: ArticleEntity;
}
