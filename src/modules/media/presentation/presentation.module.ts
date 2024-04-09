import { Module } from "@nestjs/common";
import { MediaController } from "./rest";
import { ApplicationModule } from "@media/application/application.module";

@Module({
  imports: [ApplicationModule],
  controllers: [MediaController],
})
export class PresentationModule {}
