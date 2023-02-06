import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { READ_CONNECTION } from "../../config";
import { UserEntity } from "../core";
import { EventHandlers } from "../events";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], READ_CONNECTION),
    CqrsModule,
  ],
  providers: [...EventHandlers],
  controllers: [],
})
export class EventModule {}
