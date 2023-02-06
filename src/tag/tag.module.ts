import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { READ_CONNECTION } from "../config";
import { UserModule } from "../user/user.module";
import { TagController } from "./tag.controller";
import { TagEntity } from "./core/entities/tag.entity";
import { TagService } from "./tag.service";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity], READ_CONNECTION), UserModule],
  providers: [TagService],
  controllers: [TagController],
  exports: [],
})
export class TagModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
