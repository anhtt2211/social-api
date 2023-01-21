import {
  CreateUserCommandHandler,
  LoginCommandHandler,
  UpdateUserCommandHandler,
} from "./handlers";

export * from "./handlers";
export * from "./impl";

export const CommandHandlers = [
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  LoginCommandHandler,
];
