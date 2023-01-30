import {
  ArticleCreatedEventHandler,
  ArticleDeletedEventHandler,
  ArticleFavoritedEventHandler,
  ArticleUnFavoritedEventHandler,
  ArticleUpdatedEventHandler,
  CommentCreatedEventHandler,
} from "./handlers";

export * from "./handlers";
export * from "./impl";

export const EventHandlers = [
  ArticleCreatedEventHandler,
  ArticleUpdatedEventHandler,
  ArticleDeletedEventHandler,
  ArticleFavoritedEventHandler,
  ArticleUnFavoritedEventHandler,
  CommentCreatedEventHandler,
];
