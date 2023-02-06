import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IFollow } from "../interfaces/profile.interface";

@Entity("follows")
export class FollowsEntity {
  constructor(props: IFollow) {
    Object.assign(this, props);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;
}
