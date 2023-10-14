import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { READ_CONNECTION } from "../../../configs";
import { UserEntity } from "../../core";
import { EventHandlers } from ".";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity], READ_CONNECTION),
    CqrsModule,
  ],
  providers: [...EventHandlers],
  controllers: [],
})
export class EventModule {}
