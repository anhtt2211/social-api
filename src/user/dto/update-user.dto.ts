import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    description: "Username",
    example: "abcdxyz",
  })
  readonly username: string;

  @ApiProperty({
    description: "Username",
    example: "abcdxyz",
  })
  readonly bio: string;

  @ApiProperty({
    description: "Username",
    example: "abcdxyz",
  })
  readonly image: string;
}
