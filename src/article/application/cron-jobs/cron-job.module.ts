import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { READ_CONNECTION } from "../../../configs";
import { ArticleEntity } from "../../core";
import { CronjobService } from "./cronjob.service";

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity], READ_CONNECTION)],
  providers: [CronjobService],
  controllers: [],
})
export class CronjobModule {}
