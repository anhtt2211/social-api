import { ApiProperty } from "@nestjs/swagger";
import { BlockType } from "../core/enums/block.enum";

class Info {
  @ApiProperty()
  readonly width?: number;

  @ApiProperty()
  readonly height?: number;
}

class File {
  @ApiProperty()
  readonly info?: Info;

  @ApiProperty()
  readonly url?: string;
}
class Data {
  @ApiProperty()
  readonly alignment?: string;

  @ApiProperty()
  readonly text?: string;

  @ApiProperty()
  readonly caption?: string;

  @ApiProperty()
  readonly file?: File;
}

export class BlockDto {
  @ApiProperty({ example: BlockType.PARAGRAPH })
  readonly type: BlockType;

  @ApiProperty()
  readonly data: Data;
}
