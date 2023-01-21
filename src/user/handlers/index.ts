import {
  CreateUserCommandHandler,
  LoginCommandHandler,
  UpdateUserCommandHandler,
} from "./commands";
import { FindUserByEmailQueryHandler } from "./queries";

export const QueryHandlers = [FindUserByEmailQueryHandler];
export const CommandHandlers = [
  LoginCommandHandler,
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
];
