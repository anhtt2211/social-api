import { IndexingArticleQueryHandler } from "./handlers/indexing-article.handler";
import {
  FindAllArticleQueryHandler,
  FindCommentQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
  SearchArticleQueryHandler,
} from "./handlers";

export * from "./handlers";
export * from "./impl";

export const QueryHandlers = [
  FindAllArticleQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
  FindCommentQueryHandler,
  IndexingArticleQueryHandler,
  SearchArticleQueryHandler,
];
