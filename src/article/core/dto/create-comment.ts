import { ApiProperty } from "@nestjs/swagger";

export class CreateCommentDto {
  @ApiProperty({ example: "This is comment" })
  readonly body: string;
}
