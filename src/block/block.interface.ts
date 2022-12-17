import { BlockType } from "./block.enum";

class Info {
  readonly width?: number;
  readonly height?: number;
}

class File {
  readonly info?: Info;
  readonly url?: string;
}
class Data {
  readonly alignment?: string;
  readonly text?: string;
  readonly caption?: string;
  readonly file?: File;
}

export interface BlockInterface {
  readonly type: BlockType;
  readonly data: Data;
}
