import { BlockInterface } from "../../block/block.interface";

export class CreateArticleDto {
  readonly title: string;
  readonly description: string;
  readonly body: string;
  readonly tagList: string[];
  readonly blocks: BlockInterface[];
}
