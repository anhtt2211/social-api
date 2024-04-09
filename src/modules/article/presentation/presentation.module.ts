import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ArticleController } from "./rest";

@Module({
  imports: [CqrsModule],
  controllers: [ArticleController],
})
export class PresentationModule {}
