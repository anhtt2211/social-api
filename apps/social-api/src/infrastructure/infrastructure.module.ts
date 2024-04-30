import { Module } from "@nestjs/common";
import { PersistenceModule } from "./persistence/persistence.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [PersistenceModule, RedisModule],
})
export class InfrastructureModule {}
