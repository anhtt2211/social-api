import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { READ_CONNECTION } from "../configs";
import { UserModule } from "../user/user.module";
import { TagController } from "./presentation";
import { TagEntity } from "./core/entities";
import { TagService } from "./application";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity], READ_CONNECTION), UserModule],
  providers: [TagService],
  controllers: [TagController],
  exports: [],
})
export class TagModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
