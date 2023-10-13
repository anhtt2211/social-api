import {
  FindAllArticleQueryHandler,
  FindCommentQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
} from "./handlers";

export * from "./handlers";
export * from "./impl";

export const QueryHandlers = [
  FindAllArticleQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
  FindCommentQueryHandler,
];
