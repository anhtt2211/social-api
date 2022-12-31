import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    description: "Username",
    example: "abcdxyz",
  })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({
    description: "Email",
    example: "abcdxyz@gmail.com",
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: "Password",
    example: "123456",
  })
  @IsNotEmpty()
  readonly password: string;
}
