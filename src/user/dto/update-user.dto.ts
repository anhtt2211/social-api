import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiProperty({
    description: "Username",
    // default: "abcdyxz",
    example: "abcdxyz",
  })
  readonly username: string;

  @ApiProperty({
    description: "Username",
    // default: "abcdyxz",
    example: "abcdxyz",
  })
  readonly bio: string;

  @ApiProperty({
    description: "Username",
    // default: "abcdyxz",
    example: "abcdxyz",
  })
  readonly image: string;
}
