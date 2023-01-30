import { UserCreatedEventHandler, UserUpdatedEventHandler } from "./handlers";

export * from "./handlers";
export * from "./impl";

export const EventHandlers = [UserCreatedEventHandler, UserUpdatedEventHandler];
