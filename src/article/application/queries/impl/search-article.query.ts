import { SearchArticleDto } from "../../../core/dto";

export class SearchArticleQuery {
  constructor(public readonly query: SearchArticleDto) {}
}
