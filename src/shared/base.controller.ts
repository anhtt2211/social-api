import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../configs";

export class BaseController {
  constructor() {}

  protected getUserIdFromToken(authorization) {
    if (!authorization) return null;

    const token = authorization.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
    return decoded.id;
  }
}
