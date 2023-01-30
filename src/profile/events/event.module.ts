import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadConnection } from "../../config";
import { UserEntity } from "../../user/user.entity";
import { EventHandlers } from "../events";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity], ReadConnection), CqrsModule],
  providers: [...EventHandlers],
  controllers: [],
})
export class EventModule {}
