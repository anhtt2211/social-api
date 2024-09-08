import { Controller, Get, Injectable } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InjectConnection } from "@nestjs/typeorm";
import { RedisService } from "@redis/redis.service";
import { Connection } from "typeorm";

@Controller()
@Injectable()
export class AppController {
  constructor(
    @InjectConnection() private readonly dbConnection: Connection,
    private readonly redisService: RedisService
  ) {}

  @Get("healthz")
  @ApiTags("Health")
  async healthCheck(): Promise<{
    status: string;
    postgres: object;
    redis: object;
  }> {
    const postgresStatus = await this.checkPostgres();
    const redisStatus = await this.checkRedis();

    return {
      status: "OK",
      postgres: postgresStatus,
      redis: redisStatus,
    };
  }

  private async checkPostgres(): Promise<object> {
    const start = Date.now();
    try {
      await this.dbConnection.query("SELECT 1"); // Simple query to check
      const end = Date.now();
      return {
        status: "Connected",
        responseTime: `${end - start}ms`,
      };
    } catch (error) {
      return {
        status: "Disconnected",
        error: error.message,
      };
    }
  }

  private async checkRedis(): Promise<object> {
    const start = Date.now();
    try {
      const pong = await this.redisService.ping();
      const end = Date.now();
      return {
        status: "Connected",
        responseTime: `${end - start}ms`,
        ping: pong,
      };
    } catch (error) {
      return {
        status: "Disconnected",
        error: error.message,
      };
    }
  }
}
