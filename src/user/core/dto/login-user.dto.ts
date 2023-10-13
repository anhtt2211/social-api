import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: "Email",
    example: "abcdxyz@yopmail.com",
  })
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    description: "Password",
    example: "abcdxyz",
  })
  @IsNotEmpty()
  readonly password: string;
}
