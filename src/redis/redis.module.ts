import { Module } from "@nestjs/common";
import Redis from "ioredis";
import { RedisService } from "./redis.service";

@Module({
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        if (process.env.NODE_ENV !== "development") {
          return new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          });
        }
        return new Redis(process.env.REDIS_URL);
      },
    },
    RedisService,
  ],
  exports: ["REDIS_CLIENT", RedisService],
})
export class RedisModule {}
