import {
  FollowProfileCommandHandler,
  UnFollowProfileCommandHandler,
} from "./handlers";

export * from "./handlers";
export * from "./impl";

export const CommandHandlers = [
  FollowProfileCommandHandler,
  UnFollowProfileCommandHandler,
];
