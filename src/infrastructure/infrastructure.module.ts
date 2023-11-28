import { Module } from "@nestjs/common";
import { PersistenceModule } from "./persistence/persistence.module";
import { RabbitMqModule } from "./rabbitmq/rabbitmq.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [PersistenceModule, RabbitMqModule, RedisModule],
})
export class InfrastructureModule {}
