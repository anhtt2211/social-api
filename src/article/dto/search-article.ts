import { ApiProperty } from "@nestjs/swagger";

export class SearchArticleDto {
  @ApiProperty({ required: false })
  limit?: number;

  @ApiProperty({ required: false })
  offset?: number;

  @ApiProperty({ required: true })
  search: string;
}
