import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadConnection } from "../../config";
import { UserEntity } from "../../user/user.entity";
import { ArticleController } from "../article.controller";
import { ArticleEntity } from "../article.entity";
import { ArticleService } from "../article.service";
import { EventHandlers } from "../events";

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity], ReadConnection),
    CqrsModule,
  ],
  providers: [ArticleService, ...EventHandlers],
  controllers: [ArticleController],
})
export class EventModule {}
