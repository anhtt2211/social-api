import {
  FindAllArticleQueryHandler,
  FindCommentQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
  GetHotArticleMonthlyQueryHandler,
  GetHotArticleQueryHandler,
} from "./handlers";

export * from "./handlers";
export * from "./impl";

export const QueryHandlers = [
  FindAllArticleQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
  FindCommentQueryHandler,
  GetHotArticleQueryHandler,
  GetHotArticleMonthlyQueryHandler,
];
