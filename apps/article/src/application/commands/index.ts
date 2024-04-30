import {
  CreateArticleCommandHandler,
  CreateCommentCommandHandler,
  DeleteArticleCommandHandler,
  DeleteCommentCommandHandler,
  FavoriteArticleCommandHandler,
  SeedArticleCommandHandler,
  UnFavoriteArticleCommandHandler,
  UpdateArticleCommandHandler,
} from "./handlers";

export * from "./handlers";
export * from "./impl";

export const CommandHandlers = [
  CreateArticleCommandHandler,
  CreateCommentCommandHandler,
  DeleteArticleCommandHandler,
  DeleteCommentCommandHandler,
  FavoriteArticleCommandHandler,
  UnFavoriteArticleCommandHandler,
  UpdateArticleCommandHandler,
  SeedArticleCommandHandler,
];
