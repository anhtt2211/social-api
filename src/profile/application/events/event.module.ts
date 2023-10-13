import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { READ_CONNECTION } from "../../../config";
import { EventHandlers } from ".";
import { FollowsEntity } from "../../core/entities/follows.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowsEntity], READ_CONNECTION),
    CqrsModule,
  ],
  providers: [...EventHandlers],
  controllers: [],
})
export class EventModule {}
