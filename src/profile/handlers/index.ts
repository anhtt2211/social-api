import {
  FollowProfileCommandHandler,
  UnFollowProfileCommandHandler,
} from "./commands";
import { FindProfileQueryHandler } from "./queries";

export const QueryHandlers = [FindProfileQueryHandler];
export const CommandHandlers = [
  FollowProfileCommandHandler,
  UnFollowProfileCommandHandler,
];
