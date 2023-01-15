import { ApiProperty } from "@nestjs/swagger";

export class ArticleFilters {
  @ApiProperty({ required: false })
  tag?: string;

  @ApiProperty({ required: false })
  author?: string;

  @ApiProperty({ required: false })
  favorited?: string;

  @ApiProperty({ required: false })
  limit?: number;

  @ApiProperty({ required: false })
  offset?: number;

  @ApiProperty({ required: false })
  search?: string;
}
