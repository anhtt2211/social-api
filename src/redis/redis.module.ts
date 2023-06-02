import { Module } from "@nestjs/common";
import Redis from "ioredis";
import { RedisService } from "./redis.service";

@Module({
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: () => {
        if (process.env.NODE_ENV === "development") {
          return new Redis({
            host: "localhost",
            port: 6379,
          });
        }
        if (process.env.NODE_ENV === "staging") {
          return new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT),
          });
        }
      },
    },
    RedisService,
  ],
  exports: ["REDIS_CLIENT", RedisService],
})
export class RedisModule {}
