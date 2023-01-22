import * as argon2 from "argon2";
import { IsEmail } from "class-validator";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArticleWrite_DBEntity } from "../article/article.writedb.entity";
import { Comment } from "../article/comment.entity";

@Entity("user")
export class UserWrite_DBEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

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

  @ManyToMany((type) => ArticleWrite_DBEntity)
  @JoinTable()
  favorites: ArticleWrite_DBEntity[];

  @OneToMany((type) => ArticleWrite_DBEntity, (article) => article.author)
  articles: ArticleWrite_DBEntity[];

  @OneToMany((type) => Comment, (comment) => comment.author)
  comments: Comment[];
}
