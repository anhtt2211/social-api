import {
  CreateArticleCommandHandler,
  CreateCommentCommandHandler,
  DeleteArticleCommandHandler,
  DeleteCommentCommandHandler,
  FavoriteArticleCommandHandler,
  UnFavoriteArticleCommandHandler,
  UpdateArticleCommandHandler,
} from "./commands";
import {
  FindAllArticleQueryHandler,
  FindCommentQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
} from "./queries";

export const QueryHandlers = [
  FindAllArticleQueryHandler,
  FindFeedArticleQueryHandler,
  FindOneArticleQueryHandler,
  FindCommentQueryHandler,
];
export const CommandHandlers = [
  CreateArticleCommandHandler,
  UpdateArticleCommandHandler,
  DeleteArticleCommandHandler,
  CreateCommentCommandHandler,
  DeleteCommentCommandHandler,
  FavoriteArticleCommandHandler,
  UnFavoriteArticleCommandHandler,
];
