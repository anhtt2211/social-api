import { Module } from "@nestjs/common";
import { DatabaseModule } from "./persistence/database.module";
import { RabbitMqModule } from "./rabbitmq/rabbitmq.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [DatabaseModule, RabbitMqModule, RedisModule],
})
export class InfrastructureModule {}
