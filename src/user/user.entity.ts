import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  JoinTable,
  ManyToMany,
  OneToMany,
  Index,
} from "typeorm";
import { IsEmail } from "class-validator";
import * as argon2 from "argon2";
import { ArticleEntity } from "../article/article.entity";
import { Comment } from "../article/comment.entity";

@Entity("user")
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index("user_username")
  @Column()
  username: string;

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

  @OneToMany((type) => Comment, (comment) => comment.author)
  comments: Comment[];
}
