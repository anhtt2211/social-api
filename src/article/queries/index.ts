import {
  FindAllArticleQueryHandler,
  FindCommentQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
  IndexingArticleQueryHandler,
  SearchArticleQueryHandler,
} from "./handlers";

export * from "./handlers";
export * from "./impl";

export const QueryHandlers = [
  FindAllArticleQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
  FindCommentQueryHandler,

  SearchArticleQueryHandler,
  IndexingArticleQueryHandler,
];
