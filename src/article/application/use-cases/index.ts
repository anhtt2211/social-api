import { FindAllArticleUseCase } from "./find-all.article.use-case";
import { FindOneArticleUseCase } from "./find-one.article.use-case";

export * from "./find-all.article.use-case";
export * from "./find-one.article.use-case";

export const UseCases = [FindAllArticleUseCase, FindOneArticleUseCase];
