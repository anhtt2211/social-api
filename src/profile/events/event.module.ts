import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadConnection } from "../../config";
import { EventHandlers } from "../events";
import { FollowsEntity } from "../follows.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([FollowsEntity], ReadConnection),
    CqrsModule,
  ],
  providers: [...EventHandlers],
  controllers: [],
})
export class EventModule {}
