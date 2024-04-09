import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UserController } from "./rest";

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
})
export class PresentationModule {}
