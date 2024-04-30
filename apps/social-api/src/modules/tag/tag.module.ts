import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { TagService } from "./application";
import { TagController } from "./presentation";

@Module({
  imports: [UserModule],
  providers: [TagService],
  controllers: [TagController],
  exports: [],
})
export class TagModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
