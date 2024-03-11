import { ApiProperty } from "@nestjs/swagger";
import { BlockDto } from "./block.dto";

export class CreateArticleDto {
  @ApiProperty({
    example: "The Lord of the Rings - một thế giới tuyệt vời! Phần 1",
  })
  readonly title: string;

  @ApiProperty({
    example:
      "Bài có liên quan Gặp Phật giết Phật, gặp Tổ diệt Tổ... Bài viết gửi bởi Gwens83 trong mục Quan điểm - Tranh luận spiderum.com...",
  })
  readonly description: string;

  @ApiProperty({
    example: ["Chuyện thời sự", "Love"],
  })
  readonly tagList: string[];

  @ApiProperty()
  readonly blocks: BlockDto[];

  @ApiProperty({ required: false })
  readonly readingTime?: number;

  @ApiProperty({ required: false })
  readonly commentCount?: number;

  @ApiProperty({ required: false })
  readonly favoriteCount?: number;

  @ApiProperty({ required: false })
  readonly created?: Date;
}
