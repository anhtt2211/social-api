import { Injectable, Inject } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject("REDIS_CLIENT") private readonly redisClient: Redis) {}

  async set(key: string, value: any, ttl?: number): Promise<any> {
    if (ttl) {
      return await this.redisClient.setex(key, ttl, JSON.stringify(value));
    }
    return await this.redisClient.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    const result = await this.redisClient.get(key);
    return result ? JSON.parse(result) : null;
  }

  async del(key: string): Promise<any> {
    return await this.redisClient.del(key);
  }
}
