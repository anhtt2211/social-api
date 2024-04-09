import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ProfileController } from "./rest";

@Module({
  imports: [CqrsModule],
  controllers: [ProfileController],
})
export class PresentationModule {}
