import { SearchArticleDto } from "../../dto";

export class SearchArticleQuery {
  constructor(public readonly query: SearchArticleDto) {}
}
