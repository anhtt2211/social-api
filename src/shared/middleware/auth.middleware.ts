import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import { QueryBus } from "@nestjs/cqrs";
import { NextFunction, Request, Response } from "express";
import { IncomingHttpHeaders } from "http";
import * as jwt from "jsonwebtoken";

import { JWT_SECRET_KEY } from "../../configs";
import { RedisService } from "../../redis/redis.service";
import { FindUserById } from "../../user/application/queries";
import { UserData } from "../../user/core/interfaces/user.interface";

interface IRequestCustom extends Request {
  user: UserData;
  headers: IncomingHttpHeaders;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly redisCacheService: RedisService
  ) {}

  async use(req: IRequestCustom, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(" ")[1]) {
      const token = (authHeaders as string).split(" ")[1];
      const decoded: any = jwt.verify(token, JWT_SECRET_KEY);

      const _user = await this.redisCacheService.get(decoded.id);
      if (_user) {
        req.user = _user;
        return next();
      }

      const user = await this.queryBus.execute(new FindUserById(decoded.id));

      if (!user) {
        throw new HttpException("User not found.", HttpStatus.UNAUTHORIZED);
      }

      req.user = user.user;
      next();
    } else {
      throw new HttpException("Not authorized.", HttpStatus.UNAUTHORIZED);
    }
  }
}
