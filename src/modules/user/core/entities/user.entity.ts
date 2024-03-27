import * as argon2 from "argon2";
import { IsEmail } from "class-validator";
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { ArticleEntity, CommentEntity } from "@article/core/entities";
import { FileEntity } from "@media/core";
import { IUser } from "../interfaces/user.interface";

@Entity("user")
export class UserEntity {
  constructor(props: IUser) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Index("user_username")
  @Column()
  username: string;

  @Column({ nullable: true, name: "full_name" })
  fullName: string;

  @Index("user_email")
  @Column()
  @IsEmail()
  email: string;

  @Column({ default: "" })
  bio: string;

  @Column({ default: "" })
  image: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @ManyToMany((type) => ArticleEntity)
  @JoinTable()
  favorites: ArticleEntity[];

  @OneToMany((type) => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @OneToMany((type) => CommentEntity, (comment) => comment.author)
  comments: CommentEntity[];

  @OneToMany((type) => FileEntity, (file) => file.author)
  photos: FileEntity[];
}
