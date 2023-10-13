import {
  ProfileFollowedEventHandler,
  ProfileUnFollowedEventHandler,
} from "./handlers";

export * from "./handlers";
export * from "./impl";

export const EventHandlers = [
  ProfileFollowedEventHandler,
  ProfileUnFollowedEventHandler,
];
