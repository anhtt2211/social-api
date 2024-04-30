import { BlockType } from "../enums/block.enum";

interface Info {
  width?: number;
  height?: number;
}

interface File {
  info?: Info;
  url?: string;
}
interface Data {
  alignment?: string;
  text?: string;
  caption?: string;
  file?: File;
}

export interface IBlock {
  id: number;
  type: BlockType;
  data: Data;
}
