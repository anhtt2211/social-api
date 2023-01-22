import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadConnection } from "../config";
import { UserModule } from "../user/user.module";
import { TagController } from "./tag.controller";
import { TagEntity } from "./tag.entity";
import { TagService } from "./tag.service";

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity], ReadConnection), UserModule],
  providers: [TagService],
  controllers: [TagController],
  exports: [],
})
export class TagModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
